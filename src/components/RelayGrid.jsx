/**
 * RelayGrid.jsx
 * 4-channel relay control grid
 */
import RelayCard from './RelayCard';

export default function RelayGrid({ relays, disabled, onToggle }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
        Relay Control
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {relays.map((state, i) => (
          <RelayCard
            key={i}
            index={i}
            state={state}
            disabled={disabled}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
