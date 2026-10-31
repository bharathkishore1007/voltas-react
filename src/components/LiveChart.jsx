/**
 * LiveChart.jsx
 * Real-time area chart for a single metric with Recharts
 */
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const COLOR_MAP = {
  cyan:   { stroke: '#0891b2', fill: '#0891b2', light: '#e0f7fa' },
  amber:  { stroke: '#d97706', fill: '#d97706', light: '#fef3c7' },
  green:  { stroke: '#059669', fill: '#059669', light: '#d1fae5' },
  rose:   { stroke: '#e11d48', fill: '#e11d48', light: '#ffe4e6' },
  violet: { stroke: '#7c3aed', fill: '#7c3aed', light: '#ede9fe' },
};

function CustomTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null;
  const c = COLOR_MAP[color] || COLOR_MAP.cyan;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
      <p className="font-mono text-slate-400 mb-1">{label}</p>
      <p className="font-bold" style={{ color: c.stroke }}>
        {payload[0].value?.toFixed(2)} {unit}
      </p>
    </div>
  );
}

export default function LiveChart({
  data = [],
  dataKey,
  unit = '',
  color = 'cyan',
  referenceValue = null,
  referenceLabel = '',
  domain = ['auto', 'auto'],
  emptyLabel = 'Waiting for data…',
}) {
  const c = COLOR_MAP[color] || COLOR_MAP.cyan;
  const gradId = `grad-${color}-${dataKey}`;

  if (data.length < 2) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-slate-400 animate-pulse">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={c.fill} stopOpacity={0.25} />
            <stop offset="100%" stopColor={c.fill} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="t"
          tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={domain}
          tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}${unit}`}
          width={52}
        />
        <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
        {referenceValue !== null && (
          <ReferenceLine
            y={referenceValue}
            stroke="#f43f5e"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: referenceLabel, position: 'insideTopRight', fontSize: 9, fill: '#f43f5e' }}
          />
        )}
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={c.stroke}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 4, fill: c.stroke, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
