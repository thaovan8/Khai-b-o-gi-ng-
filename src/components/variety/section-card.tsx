import type { ReactNode } from "react";

export function SectionCard({
  icon,
  title,
  subtitle,
  action,
  children,
  noDivider = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  noDivider?: boolean;
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <header
        className={
          noDivider
            ? "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
            : "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4"
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-card-foreground">{title}</h2>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}