import { type ReactNode } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return (
    <span className={`tag ${tone}`}>
      <i className="dot" />
      {children}
    </span>
  );
}
export function PageHeading({
  title,
  subtitle,
  eyebrow = "BUSINESS INTELLIGENCE",
  actions,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <div className="page-actions">{actions}</div>
    </div>
  );
}
export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{title}</h2>
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
export function Kpi({
  label,
  value,
  change,
  caption,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  change?: string;
  caption?: string;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="kpi">
      <div className="kpi-label">
        {label}
        {onClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            title={`Inspect ${label}`}
            onClick={onClick}
          >
            <Info className="size-3" />
          </Button>
        ) : (
          icon
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-change">
        {change && (
          <>
            <ArrowUpRight className="size-3" />
            {change}
          </>
        )}
        <span>{caption}</span>
      </div>
      {change && (
        <svg className="kpi-spark" viewBox="0 0 70 25" aria-hidden="true">
          <polyline
            points="0,22 9,18 18,20 28,12 38,15 48,7 57,11 68,1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div className="progress-track">
      <progress max={100} value={Math.max(0, Math.min(100, value))} />
    </div>
  );
}
export function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="app-footer">
      <span>
        <span className="text-success">●</span> All systems operational{" "}
        <span className="mx-2">·</span> Simulated environment
      </span>
      <span>
        Axiom Intelligence <span className="mx-2">/</span> Cedar House workspace{" "}
        <span className="mx-2">·</span> November 2026
      </span>
    </footer>
  );
}
export function ModuleTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="module-tabs">
      {tabs.map((t) => (
        <Button
          key={t}
          variant="ghost"
          className={`module-tab ${value === t ? "active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
