/**
 * shared/SectionBox.jsx — white card wrapper with title + icon
 */
export default function SectionBox({ icon: Icon, title, sub, badge, badgeColor, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
              <Icon size={14} className="text-indigo-500" strokeWidth={2} />
            </div>
          )}
          <div>
            <h3 className="text-[13px] font-bold text-slate-700">{title}</h3>
            {sub && <p className="text-[10px] text-slate-400 font-medium">{sub}</p>}
          </div>
        </div>
        {badge && (
          <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
            style={{ borderColor: badgeColor + '40', color: badgeColor, background: badgeColor + '12' }}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
