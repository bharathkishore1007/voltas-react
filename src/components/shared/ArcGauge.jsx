/**
 * shared/ArcGauge.jsx — Circular SVG gauge (like Battery Monitor live monitoring)
 */
export default function ArcGauge({ pct = 0, value, unit, label, color = '#6366f1', size = 130, sw = 11 }) {
  const r = (size - sw) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(100, pct));
  const arc  = (safe / 100) * circ * 0.75;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          transform={`rotate(135 ${cx} ${cy})`} />
        {/* Arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc} ${circ - arc}`}
          transform={`rotate(135 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)' }} />
        {/* Value */}
        <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: size * 0.19, fontWeight: 800, fill: '#18181b' }}>
          {value ?? Math.round(safe)}
        </text>
        <text x={cx} y={cy + size * 0.155} textAnchor="middle"
          style={{ fontFamily: 'Inter,sans-serif', fontSize: size * 0.105, fontWeight: 600, fill: '#94a3b8' }}>
          {unit}
        </text>
      </svg>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}
