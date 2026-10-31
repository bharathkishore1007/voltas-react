/**
 * shared/MiniChart.jsx — compact area chart with time-filter tabs
 */
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FILTERS = ['1H', '6H', '24H', '7D'];

function ChartTip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-mono text-slate-400">{label}</p>
      <p className="font-bold text-slate-700">{payload[0].value?.toFixed(2)} <span className="text-slate-400 font-normal">{unit}</span></p>
    </div>
  );
}

export default function MiniChart({ title, data, dataKey, unit, color, domain }) {
  const [filter, setFilter] = useState('1H');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold text-slate-600">{title}</p>
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${filter === f
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-400 hover:text-slate-600'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="h-36">
        {data.length < 2
          ? <div className="flex h-full items-center justify-center text-xs text-slate-300 animate-pulse">Waiting for data…</div>
          : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 2, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id={`mc-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#cbd5e1', fontFamily: 'monospace' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis domain={domain || ['auto','auto']} tick={{ fontSize: 8, fill: '#cbd5e1', fontFamily: 'monospace' }} tickLine={false} axisLine={false} width={44} tickFormatter={v => `${v}${unit}`} />
                <Tooltip content={<ChartTip unit={unit} />} />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2}
                  fill={`url(#mc-${dataKey})`} dot={false}
                  activeDot={{ r: 3, fill: color, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          )
        }
      </div>
      <p className="mt-1 text-[10px] text-slate-400 font-medium text-center">● {dataKey} ({unit})</p>
    </div>
  );
}
