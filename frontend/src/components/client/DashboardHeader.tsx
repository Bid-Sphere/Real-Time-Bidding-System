interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h1>
      <p className="text-[var(--text-secondary)]">
        {subtitle}
      </p>
    </div>
  );
}