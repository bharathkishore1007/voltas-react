/**
 * PowerBarChart.jsx
 * Horizontal bar chart showing per-relay power contribution
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RELAY_COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];
const RELAY_CURRENTS = [1.0, 2.5, 0.5, 0.8];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700">{payload[0].payload.name}</p>
      <p className="font-mono text-slate-500">{payload[0].value.toFixed(2)} W</p>
    </div>
  );
}

export default function PowerBarChart({ relays, voltage }) {
  const v = parseFloat(voltage) || 12.0;
  const data = relays.map((on, i) => ({
    name: `CH ${i + 1}`,
    power: on ? parseFloat((RELAY_CURRENTS[i] * v).toFixed(2)) : 0,
    current: RELAY_CURRENTS[i],
    state: on,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}W`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
        <Bar dataKey="power" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.state ? RELAY_COLORS[i] : '#e2e8f0'}
              opacity={entry.state ? 1 : 0.6}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
