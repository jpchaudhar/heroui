type Props = {
  label: string;
  value: string;
  delta?: string;
};

export default function KpiCard({ label, value, delta }: Props) {
  return (
    <div className="kpi">
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {delta ? (
        <div className="text-xs text-brand-teal-400">{delta}</div>
      ) : null}
    </div>
  );
}