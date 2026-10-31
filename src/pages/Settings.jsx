/**
 * pages/Settings.jsx — Device configuration and thresholds
 */
import { useState } from 'react';
import { Settings, ShieldCheck, ChevronRight, Save } from 'lucide-react';
import SectionBox from '../components/shared/SectionBox';

const PRESETS = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

function FieldRow({ label, value, sub }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-3 last:border-0">
      <div>
        <p className="text-[12px] font-semibold text-slate-700">{label}</p>
        {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
      </div>
      <span className="font-mono text-[12px] font-bold text-slate-600 bg-slate-50 rounded-lg px-3 py-1 border border-slate-200">{value}</span>
    </div>
  );
}

export default function SettingsPage({ state, isOnline, setLimit }) {
  const [custom, setCustom] = useState(state.currentLimit.toString());
  const [saved, setSaved] = useState(false);

  function handleSet() {
    const n = parseFloat(custom);
    if (!isNaN(n) && n > 0) { setLimit(n); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Overcurrent protection */}
      <SectionBox icon={ShieldCheck} title="Overcurrent Protection" sub="Trip point stored in ESP32 Flash NVS">
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-medium text-slate-500">Quick presets:</span>
            {PRESETS.map(p => (
              <button key={p} disabled={!isOnline} onClick={() => { setLimit(p); setCustom(p.toString()); }}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-bold border transition-all disabled:opacity-40
                  ${state.currentLimit === p
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                {p} A
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[12px] font-medium text-slate-500 w-32 shrink-0">Custom limit:</label>
            <input type="number" step="0.1" min="0.5" max="10" value={custom}
              onChange={e => setCustom(e.target.value)} disabled={!isOnline}
              className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center font-mono text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-40" />
            <span className="text-sm text-slate-400">A</span>
            <button onClick={handleSet} disabled={!isOnline}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${saved ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}`}>
              {saved ? <><Save size={13} /> Saved!</> : <><ChevronRight size={13} /> Set Limit</>}
            </button>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-[11px] font-bold text-amber-700">Current threshold: <span className="font-mono">{state.currentLimit} A</span></p>
            <p className="text-[10px] text-amber-600 mt-0.5 font-mono">Topic: voltas/config/high_current_limit</p>
          </div>
        </div>
      </SectionBox>

      {/* Firmware config read-only */}
      <SectionBox icon={Settings} title="Device Configuration" sub="Firmware defaults from ESP32 flash NVS">
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div>
            <FieldRow label="Device ID"         value="esp32-voltas-relay-001" />
            <FieldRow label="MQTT Broker"        value="broker.emqx.io"         sub="Public EMQX broker" />
            <FieldRow label="MQTT Port"          value="8084 (WSS)"             />
            <FieldRow label="Publish Rate"       value="1 000 ms"               sub="Sensor telemetry interval" />
            <FieldRow label="Heartbeat Rate"     value="30 000 ms"              sub="LWT online/offline" />
            <FieldRow label="mDNS Hostname"      value="voltas.local"           />
          </div>
          <div>
            <FieldRow label="Battery Voltage"   value="12.60 V"     sub="No-load reference" />
            <FieldRow label="Int. Resistance"   value="0.08 Ω"      sub="Used for SoC calc" />
            <FieldRow label="Battery Capacity"  value="14.0 Ah"     />
            <FieldRow label="LCD Address"       value="I²C 0x27"    sub="SDA=21, SCL=22" />
            <FieldRow label="Relay Logic"       value="Active LOW"   sub="LOW = energised" />
            <FieldRow label="GPIO Relays"       value="26 / 27 / 14 / 32" />
          </div>
        </div>
      </SectionBox>
    </div>
  );
}
