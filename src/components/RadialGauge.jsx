/**
 * RadialGauge.jsx
 * SVG-based circular gauge for SoC / Temperature / Current utilization
 */
export default function RadialGauge({
  value = 0,        // 0-100
  label = '',
  displayValue = '',
  unit = '',
  color = '#6366f1',
  trackColor = '#f1f5f9',
  size = 120,
  strokeWidth = 10,
}) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  // Start from top (–90°), sweep 270° total arc
  const arcLength = (pct / 100) * (circumference * 0.75);
  const offset    = circumference * 0.25; // rotate start to 7 o'clock

  // rotation so arc starts at bottom-left (225°) and sweeps clockwise to bottom-right
  const rotation = 135;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
        {/* Value arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.18, fontWeight: 700, fill: color }}>
          {displayValue || `${Math.round(pct)}`}
        </text>
        <text x={cx} y={cy + size * 0.14} textAnchor="middle"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: size * 0.11, fontWeight: 600, fill: '#94a3b8' }}>
          {unit}
        </text>
      </svg>
      <p className="text-[11px] font-semibold text-slate-500 tracking-wide">{label}</p>
    </div>
  );
}
