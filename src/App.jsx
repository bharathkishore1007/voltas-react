/**
 * App.jsx — NEURAVOLT · ESP32 IoT Dashboard
 * Layout: collapsible sidebar + topbar + routed pages
 */
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMqtt } from './hooks/useMqtt';
import Sidebar  from './components/Sidebar';
import TopBar   from './components/TopBar';

import Overview          from './pages/Overview';
import LiveMonitor       from './pages/LiveMonitor';
import Analytics         from './pages/Analytics';
import RuntimePrediction from './pages/RuntimePrediction';
import EnergyConsumption from './pages/EnergyConsumption';
import RelayControl      from './pages/RelayControl';
import Temperature       from './pages/Temperature';
import Alerts            from './pages/Alerts';
import SettingsPage      from './pages/Settings';

export default function App() {
  const { state, setLimit, toggleRelay, toggleRelayManual } = useMqtt();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isOnline = state.status === 'ONLINE';
  const alertCount = state.alerts.length + (state.warning ? 1 : 0);

  const pageProps = { state, isOnline, setLimit, toggleRelay, toggleRelayManual };


  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          status={state.status}
        />

        {/* ── Main area ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

          {/* TopBar */}
          <TopBar
            status={state.status}
            lastSeen={state.lastSeen}
            alertCount={alertCount}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <Routes>
              <Route path="/"          element={<Overview          {...pageProps} />} />
              <Route path="/monitor"   element={<LiveMonitor       {...pageProps} />} />
              <Route path="/analytics" element={<Analytics         {...pageProps} />} />
              <Route path="/runtime"   element={<RuntimePrediction {...pageProps} />} />
              <Route path="/energy"    element={<EnergyConsumption {...pageProps} />} />
              <Route path="/relays"    element={<RelayControl      {...pageProps} />} />
              <Route path="/thermal"   element={<Temperature       {...pageProps} />} />
              <Route path="/alerts"    element={<Alerts            {...pageProps} />} />
              <Route path="/settings"  element={<SettingsPage      {...pageProps} />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}
