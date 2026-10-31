/**
 * ProtectionPanel.jsx
 * Overcurrent protection threshold control — presets + custom input
 * Publishes to voltas/config/high_current_limit → saved to ESP32 Flash NVS
 */
import { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

const PRESETS = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

export default function ProtectionPanel({ currentLimit, onSetLimit, isOnline }) {
  const [custom, setCustom] = useState(currentLimit.toString());

  // Sync when limit updates remotely
  useEffect(() => {
    setCustom(currentLimit.toString());
  }, [currentLimit]);

  function handlePreset(val) {
    onSetLimit(val);
  }

  function handleCustomSet() {
    const v = parseFloat(custom);
    if (!isNaN(v) && v > 0) onSetLimit(v);
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-md p-5 shadow-md shadow-indigo-50">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
              <ShieldCheck size={16} className="text-amber-600" strokeWidth={2} />
            </div>
            <h3 className="text-xs font-bold tracking-widest text-slate-600 uppercase">
              Overcurrent Protection
            </h3>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-700">
              {currentLimit} A
            </span>
          </div>
          <p className="text-xs text-slate-400 pl-10">
            Trip point is stored in ESP32 Flash NVS —{' '}
            <code className="text-indigo-500 font-mono text-[11px]">voltas/config/high_current_limit</code>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={!isOnline}
              onClick={() => handlePreset(preset)}
              className={`
                rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                ${currentLimit === preset
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100 ring-2 ring-amber-300 ring-offset-1'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                }
              `}
            >
              {preset}A
            </button>
          ))}

          {/* Custom input */}
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="10.0"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              disabled={!isOnline}
              placeholder="A"
              className="
                w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5
                text-center font-mono text-xs text-slate-700
                focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            />
            <button
              type="button"
              disabled={!isOnline || !custom || parseFloat(custom) === currentLimit}
              onClick={handleCustomSet}
              className="
                flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50
                px-2.5 py-1.5 text-xs font-semibold text-indigo-600
                hover:bg-indigo-500 hover:text-white hover:border-indigo-500
                transition-all disabled:opacity-30 disabled:pointer-events-none
              "
            >
              Set <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
