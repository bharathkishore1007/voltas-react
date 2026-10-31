/**
 * useMqtt.js — MQTT engine with demo-mode fallback + rolling history
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';

const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const HISTORY_MAX = 60;

export const BATTERY_CAPACITY_AH = 14.0;
export const BATTERY_CUTOFF_V   = 10.50;
export const BATTERY_FULL_V     = 12.70;

const T_VOLTAGE      = 'voltas/sensors/voltage';
const T_CURRENT      = 'voltas/sensors/current';
const T_POWER        = 'voltas/sensors/power';
const T_TEMP         = 'voltas/sensors/temperature';
const T_RELAY_STATUS = 'voltas/relay/status';
const T_STATUS       = 'voltas/status';
const T_WARNING      = 'voltas/warnings/high_current';
export const T_CURRENT_LIMIT = 'voltas/config/high_current_limit';
const T_RELAY_CMD = ['voltas/relay/1','voltas/relay/2','voltas/relay/3','voltas/relay/4'];
const ALL_TOPICS = [T_VOLTAGE,T_CURRENT,T_POWER,T_TEMP,T_RELAY_STATUS,T_STATUS,T_WARNING,T_CURRENT_LIMIT];

export const RELAY_CURRENTS = [1.0, 2.5, 0.5, 0.8];
export const RELAY_LABELS   = ['Channel 1','Channel 2','Channel 3','Channel 4'];
export const GPIO_PINS      = [26, 27, 14, 32];

export function calcSoC(voltage) {
  const v = parseFloat(voltage);
  if (isNaN(v)) return null;
  return Math.max(0, Math.min(100, ((v - BATTERY_CUTOFF_V) / (BATTERY_FULL_V - BATTERY_CUTOFF_V)) * 100));
}

export function calcRuntime(voltage, current, limitAh = BATTERY_CAPACITY_AH) {
  const v = parseFloat(voltage), c = parseFloat(current);
  if (isNaN(c) || c <= 0.05) return 'Idle';
  if (isNaN(v) || v <= BATTERY_CUTOFF_V) return '< 5 min';
  const voc = v + c * 0.08;
  const soc = Math.max(0.05, Math.min(1, (voc - BATTERY_CUTOFF_V) / (BATTERY_FULL_V - BATTERY_CUTOFF_V)));
  const hours = (limitAh * soc) / c;
  if (hours > 99) return '> 99h';
  const h = Math.floor(hours), m = Math.round((hours - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function push(arr, item) {
  const n = [...arr, item];
  if (n.length > HISTORY_MAX) n.shift();
  return n;
}

const INIT = {
  status: 'CONNECTING',
  lastSeen: null,
  voltage: '--', current: '--', power: '--', temperature: '--', runtime: '--',
  currentLimit: 3.5,
  relays: [false, false, false, false],
  warning: false,
  history: [],          // { t, voltage, current, power, temperature }
  sessionEnergy: 0,     // Wh accumulated this session
  peakVoltage: null,
  minVoltage: null,
  peakPower: null,
  avgCurrent: { sum: 0, count: 0 },
  relayOnTime: [0, 0, 0, 0],
  alerts: [],           // { id, time, msg, level }
};

export function useMqtt() {
  const [state, setState] = useState(INIT);
  const clientRef = useRef(null);

  // Accumulate relay on-time + session energy every second
  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'ONLINE') return prev;
        const relayOnTime = prev.relayOnTime.map((t, i) => prev.relays[i] ? t + 1 : t);
        const p = parseFloat(prev.power);
        const sessionEnergy = isNaN(p) ? prev.sessionEnergy : prev.sessionEnergy + p / 3600;
        return { ...prev, relayOnTime, sessionEnergy };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const clientId = `neuravolt-${Math.random().toString(16).slice(2, 8)}`;
    const client = mqtt.connect(BROKER_URL, {
      clientId, clean: true, keepalive: 60,
      reconnectPeriod: 4000, connectTimeout: 10_000,
    });
    clientRef.current = client;

    client.on('connect', () => {
      setState(prev => ({ ...prev, status: 'ONLINE' }));
      client.subscribe(ALL_TOPICS, { qos: 1 });
    });

    client.on('message', (topic, payload) => {
      const msg = payload.toString().trim();
      const t = new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

      if (topic === T_STATUS) {
        const online = msg.toLowerCase() === 'online';
        setState(prev => ({ ...prev, status: online ? 'ONLINE' : 'OFFLINE', lastSeen: t }));
        return;
      }

      setState(prev => {
        if (prev.status !== 'ONLINE') return prev;
        const n = { ...prev, lastSeen: t };

        if (topic === T_VOLTAGE) {
          const v = parseFloat(msg);
          if (!isNaN(v)) {
            n.voltage = v.toFixed(2);
            n.runtime = calcRuntime(v, parseFloat(n.current));
            n.peakVoltage = prev.peakVoltage === null ? v : Math.max(prev.peakVoltage, v);
            n.minVoltage  = prev.minVoltage  === null ? v : Math.min(prev.minVoltage,  v);
          }
        } else if (topic === T_CURRENT) {
          const c = parseFloat(msg);
          if (!isNaN(c)) {
            n.current = c.toFixed(2);
            n.runtime = calcRuntime(parseFloat(n.voltage), c);
            n.avgCurrent = { sum: prev.avgCurrent.sum + c, count: prev.avgCurrent.count + 1 };
          }
        } else if (topic === T_POWER) {
          const p = parseFloat(msg);
          if (!isNaN(p)) {
            n.power = p.toFixed(2);
            n.peakPower = prev.peakPower === null ? p : Math.max(prev.peakPower, p);
          }
        } else if (topic === T_TEMP) {
          const temp = parseFloat(msg);
          if (!isNaN(temp)) n.temperature = temp.toFixed(1);
        } else if (topic === T_CURRENT_LIMIT) {
          const lim = parseFloat(msg);
          if (!isNaN(lim) && lim > 0) n.currentLimit = parseFloat(lim.toFixed(2));
        } else if (topic === T_RELAY_STATUS) {
          try {
            const d = JSON.parse(msg);
            n.relays = [0,1,2,3].map(i => d[`relay${i+1}`] === 'ON');
          } catch { /* noop */ }
        } else if (topic === T_WARNING) {
          n.warning = msg === 'ALERT';
          if (msg === 'ALERT') {
            const alert = { id: Date.now(), time: t, msg: `Overcurrent! ${n.current} A exceeded ${n.currentLimit} A`, level: 'warn' };
            n.alerts = [alert, ...prev.alerts].slice(0, 50);
          }
        }

        // History
        const vn = parseFloat(n.voltage), cn = parseFloat(n.current),
              pn = parseFloat(n.power),   tn = parseFloat(n.temperature);
        if (!isNaN(vn) && !isNaN(cn)) {
          n.history = push(prev.history, { t, voltage: vn, current: cn, power: isNaN(pn)?null:pn, temperature: isNaN(tn)?null:tn });
        }
        return n;
      });
    });

    client.on('offline', () => setState(prev => ({ ...prev, status: 'OFFLINE' })));
    client.on('close',   () => setState(prev => ({ ...prev, status: 'OFFLINE' })));
    client.on('error',   () => setState(prev => ({ ...prev, status: 'OFFLINE' })));

    return () => { client.end(true); clientRef.current = null; };
  }, []);

  const setLimit = useCallback((val) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0 || !clientRef.current?.connected) return;
    const f = n.toFixed(2);
    setState(prev => ({ ...prev, currentLimit: parseFloat(f) }));
    clientRef.current.publish(T_CURRENT_LIMIT, f, { qos: 1, retain: true });
  }, []);

  // ── MQTT relay toggle — updates UI immediately, publishes if connected ──────
  const toggleRelay = useCallback((idx, target) => {
    if (idx < 0 || idx >= 4) return;
    setState(prev => { const r = [...prev.relays]; r[idx] = target; return { ...prev, relays: r }; });
    if (clientRef.current?.connected) {
      clientRef.current.publish(T_RELAY_CMD[idx], target ? 'ON' : 'OFF', { qos: 1, retain: false });
    }
  }, []);

  // ── Manual / Demo toggle — always works, no MQTT required ─────────────────
  const toggleRelayManual = useCallback((idx, target) => {
    if (idx < 0 || idx >= 4) return;
    setState(prev => { const r = [...prev.relays]; r[idx] = target; return { ...prev, relays: r }; });
    if (clientRef.current?.connected) {
      clientRef.current.publish(T_RELAY_CMD[idx], target ? 'ON' : 'OFF', { qos: 1, retain: false });
    }
  }, []);

  return { state, setLimit, toggleRelay, toggleRelayManual };
}
