const NAMES = ["New moon","Waxing crescent","First quarter","Waxing gibbous","Full moon","Waning gibbous","Last quarter","Waning crescent"];
const ICONS = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];

export function moonInfo(date: Date) {
  const synodic = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((date.getTime() - ref) / 86400000) % synodic + synodic) % synodic;
  const idx = Math.floor((age / synodic) * 8 + 0.5) % 8;
  const lit = Math.round(((1 - Math.cos((2 * Math.PI * age) / synodic)) / 2) * 100);
  const toFull = Math.round(((synodic / 2 - age) % synodic + synodic) % synodic);
  return { name: NAMES[idx], icon: ICONS[idx], lit, toFull };
}

export function MoonPhase() {
  const m = moonInfo(new Date());
  return (
    <section className="rounded-xl border border-border bg-card p-4 flex items-center gap-4" aria-label="Moon phase">
      <span className="text-4xl leading-none" aria-hidden>{m.icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-mono uppercase text-muted-foreground">Tonight's moon</p>
        <p className="font-display text-lg">{m.name}</p>
        <p className="text-xs text-muted-foreground">{m.lit}% lit · {m.toFull === 0 ? "full tonight" : `full in ${m.toFull} days`}</p>
      </div>
    </section>
  );
}
