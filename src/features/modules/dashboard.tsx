import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  SlidersHorizontal,
  Download,
  TrendingUp,
  TriangleAlert,
  Package,
  Users,
  MoreHorizontal,
  Check,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlatform } from "../platform/state";
import { financials, money, revenueHistory } from "../platform/model";
import { downloadReport } from "../platform/report";
import { PageHeading, Kpi, Panel, Tag, Progress, Footer } from "../platform/common";
import { Inspector } from "../platform/shell";
export function Dashboard() {
  const { state, update } = usePlatform();
  const navigate = useNavigate();
  const f = financials(state.figures);
  const [period, setPeriod] = useState("6 months");
  const [configure, setConfigure] = useState(false);
  const [inspect, setInspect] = useState("");
  const history = revenueHistory
    .map((r, i) =>
      i === 5 ? { ...r, revenue: state.figures["revenue"] ?? 0, profit: f.profit ?? 0 } : r,
    )
    .slice(period === "3 months" ? -3 : 0);
  const widgets = state.widgets;
  const currentRevenue = state.figures["revenue"];
  const revenueChange =
    currentRevenue != null ? `${((currentRevenue / 68400 - 1) * 100).toFixed(1)}%` : undefined;
  const profitChange =
    f.profit != null ? `${((f.profit / 3500 - 1) * 100).toFixed(1)}%` : undefined;
  const marginChange =
    f.margin != null ? `${(f.margin - (3500 / 68400) * 100).toFixed(1)} pts` : undefined;
  const growth =
    currentRevenue != null ? `${((currentRevenue / 61800 - 1) * 100).toFixed(1)}%` : "unavailable";
  return (
    <div className="page">
      <PageHeading
        title="Executive command center"
        eyebrow="YOUR BUSINESS, AT A GLANCE"
        subtitle={`A clear view of ${state.profile.name}’s performance, priorities and next decisions.`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfigure(true)}>
              <SlidersHorizontal />
              Customize
            </Button>
            <Button size="sm" onClick={() => navigate({ to: "/lab" })}>
              <PlusIcon />
              New analysis
            </Button>
          </>
        }
      />
      <div className="period-bar">
        <div className="flex items-center gap-2">
          <Tag tone="success">
            {state.profile.approved ? "Business profile approved" : "Profile in progress"}
          </Tag>
          <Tag>{state.classification}</Tag>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPeriod(period === "6 months" ? "3 months" : "6 months")}
          >
            <CalendarDays />
            Jun – Nov 2026
            <ChevronDown />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Download executive report"
            onClick={() => downloadReport(state.profile, state.figures, state.classification)}
          >
            <Download />
          </Button>
        </div>
      </div>
      <div className="kpi-grid">
        <Kpi
          label="Monthly revenue"
          value={money(state.figures["revenue"])}
          {...(revenueChange ? { change: revenueChange } : {})}
          caption="vs. previous month"
          onClick={() => setInspect("Monthly revenue")}
        />
        <Kpi
          label="Operating profit"
          value={money(f.profit)}
          {...(profitChange ? { change: profitChange } : {})}
          caption="vs. previous month"
          onClick={() => setInspect("Operating profit")}
        />
        <Kpi
          label="Operating margin"
          value={f.margin != null ? `${f.margin.toFixed(1)}%` : "Insufficient data"}
          {...(marginChange ? { change: marginChange } : {})}
          caption="vs. previous month"
          onClick={() => setInspect("Operating margin")}
        />
        <Kpi
          label="Available cash"
          value={money(state.figures["cash"])}
          caption={`${f.cashMonths?.toFixed(1) ?? "—"} months of fixed costs`}
          onClick={() => setInspect("Available cash")}
        />
      </div>
      <div className="dashboard-analysis">
        {widgets.includes("revenue") && (
          <Panel
            title="Revenue performance"
            subtitle="Monthly revenue against your growth plan"
            actions={
              <div className="segmented">
                {["3 months", "6 months"].map((p) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    key={p}
                    className={`h-6 px-2 text-[9px] ${period === p ? "selected" : ""}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p === "3 months" ? "3M" : "6M"}
                  </Button>
                ))}
              </div>
            }
          >
            <div className="flex justify-end px-5 mt-4">
              <div className="chart-legend">
                <span>
                  <i className="legend-line" />
                  Revenue
                </span>
                <span>
                  <i className="legend-line target" />
                  Target
                </span>
              </div>
            </div>
            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-revenue)" stopOpacity={0.14} />
                      <stop offset="100%" stopColor="var(--chart-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    dy={8}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v / 1000}k`}
                    domain={[40000, 90000]}
                    ticks={[40000, 50000, 60000, 70000, 80000, 90000]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                    width={47}
                  />
                  <Tooltip
                    formatter={(v) => money(Number(v))}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 5,
                      fontSize: 11,
                    }}
                  />
                  <Area
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="var(--chart-target)"
                    strokeWidth={1.5}
                    strokeDasharray="4 5"
                    fill="none"
                  />
                  <Area
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="var(--chart-revenue)"
                    strokeWidth={2.5}
                    fill="url(#revenueFill)"
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              <span>
                <TrendingUp className="inline size-3 mr-1 text-success" />
                Revenue change {growth} over the sample period
              </span>
              <Link to="/intelligence" className="text-primary flex items-center gap-1">
                Explore analysis
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </Panel>
        )}
        {widgets.includes("health") && (
          <Panel
            title="Business health"
            subtitle="Financial resilience · preliminary assessment"
            actions={
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                title="View health methodology"
                onClick={() => navigate({ to: "/assessment" })}
              >
                <MoreHorizontal />
              </Button>
            }
          >
            <div className="health-main">
              <div className="health-dial">
                <svg viewBox="0 0 100 100">
                  <circle className="track" cx="50" cy="50" r="43" strokeWidth="7" fill="none" />
                  <circle
                    className="value"
                    cx="50"
                    cy="50"
                    r="43"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${(f.score ?? 0) * 2.7} 270`}
                  />
                </svg>
                <div className="dial-text">
                  {f.score ?? "—"}
                  <small>out of 100</small>
                </div>
              </div>
              <div>
                <Tag tone="warning">Room to improve</Tag>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-3">
                  Strong gross margin.
                  <br />
                  Limited operating headroom.
                </p>
              </div>
            </div>
            <div className="health-bars">
              {[
                ["Financial health", f.score ?? 0],
                ["Data coverage", f.coverage],
                ["Profile completeness", state.profile.approved ? 100 : 60],
              ].map(([label, value]) => (
                <div className="health-row" key={label}>
                  <span>{label}</span>
                  <Progress value={Number(value)} />
                  <strong className="text-[10px] w-6 text-right">{value}</strong>
                </div>
              ))}
            </div>
            <div className="chart-footer">
              <span>Heuristic score · illustrative data</span>
              <Link to="/assessment" className="text-primary flex items-center gap-1">
                Full assessment
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </Panel>
        )}
      </div>
      {widgets.includes("opportunities") && (
        <>
          <div className="section-header">
            <h2 className="flex items-center gap-2">
              Optimization opportunities <span className="tag">{state.decisions.length}</span>
            </h2>
            <Link to="/decisions" className="text-primary text-[11px] flex items-center gap-1">
              View all decisions
              <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="panel table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Recommended action</th>
                  <th>Dimension</th>
                  <th>Potential monthly impact</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.decisions.map((d, i) => (
                  <tr key={d.id}>
                    <td>
                      <div className="opportunity-title">
                        <span className="opportunity-icon">
                          {i === 0 ? (
                            <Package className="size-3.5" />
                          ) : i === 1 ? (
                            <Users className="size-3.5" />
                          ) : (
                            <TrendingUp className="size-3.5" />
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          className="text-[11px] px-0 h-auto"
                          onClick={() => navigate({ to: "/decisions" })}
                        >
                          {d.title}
                        </Button>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{d.pillar}</td>
                    <td>
                      <strong className="text-success">+{money(d.impact)}</strong>
                      <span className="text-muted-foreground text-[9px]"> / mo</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <span className="w-12">
                          <Progress value={d.confidence} />
                        </span>
                        {d.confidence}%
                      </span>
                    </td>
                    <td>
                      <Tag tone={d.status === "Pending review" ? "warning" : "blue"}>
                        {d.status}
                      </Tag>
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        title={`Review ${d.id}`}
                        onClick={() => navigate({ to: "/decisions" })}
                      >
                        <ArrowUpRight className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {widgets.includes("activity") && (
        <div className="dashboard-bottom">
          <Panel
            title="Attention required"
            subtitle="Risks and gaps that need a closer look"
            actions={<Tag tone="warning">4 open</Tag>}
          >
            <div className="mt-4">
              {[
                {
                  title: "Ingredient waste above the sample threshold",
                  detail: "Estimated 10% waste · validate daily kitchen logs",
                  route: "/dimensions/inventory",
                },
                {
                  title: "Customer attribution is incomplete",
                  detail: "Marketing spend cannot yet be tied to acquired guests",
                  route: "/dimensions/marketing",
                },
                {
                  title: "Cash buffer below 1.5 months",
                  detail: `${f.cashMonths?.toFixed(2) ?? "—"} months of fixed expenses · monitor weekly`,
                  route: "/assessment",
                },
              ].map((r) => (
                <div className="list-row" key={r.title}>
                  <TriangleAlert className="size-4 text-warning shrink-0" />
                  <div className="flex-1">
                    <h3>{r.title}</h3>
                    <p>{r.detail}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    title={r.title}
                    onClick={() =>
                      r.route.startsWith("/dimensions")
                        ? navigate({
                            to: "/dimensions/$pillar",
                            params: { pillar: r.route.split("/")[2] ?? "inventory" },
                          })
                        : navigate({ to: "/assessment" })
                    }
                  >
                    <ChevronDown className="-rotate-90 size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Strategic priorities"
            subtitle="Progress toward the outcomes that matter"
            actions={
              <Link to="/strategy" className="text-primary text-[10px]">
                View plan
                <ArrowUpRight className="inline size-3 ml-1" />
              </Link>
            }
          >
            <div className="mt-4">
              {state.targets.map((t) => {
                const progress =
                  t.target === t.baseline
                    ? 100
                    : ((t.current - t.baseline) / (t.target - t.baseline)) * 100;
                return (
                  <div className="list-row" key={t.id}>
                    <span className="opportunity-icon bg-success-soft text-success">
                      <TrendingUp className="size-3.5" />
                    </span>
                    <div className="flex-1">
                      <h3>{t.title}</h3>
                      <p>
                        {t.unit === "USD" ? money(t.current) : `${t.current}${t.unit}`} →{" "}
                        {t.unit === "USD" ? money(t.target) : `${t.target}${t.unit}`}{" "}
                        <span className="mx-1">·</span> Jun 2027
                      </p>
                    </div>
                    <div className="w-16">
                      <Progress value={progress} />
                      <p className="text-[9px] text-muted-foreground text-right mt-1.5">
                        {Math.round(Math.max(0, progress))}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}
      <Footer />
      <Dialog open={configure} onOpenChange={setConfigure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize command center</DialogTitle>
            <DialogDescription>Choose the information in your executive view</DialogDescription>
          </DialogHeader>
          {[
            ["revenue", "Revenue performance"],
            ["health", "Business health"],
            ["opportunities", "Optimization opportunities"],
            ["activity", "Risks and strategic priorities"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={widgets.includes(key ?? "")}
                onChange={() =>
                  update((s) => ({
                    ...s,
                    widgets: s.widgets.includes(key ?? "")
                      ? s.widgets.filter((w) => w !== key)
                      : [...s.widgets, key ?? ""],
                  }))
                }
              />
              {label}
            </label>
          ))}
          <Button onClick={() => setConfigure(false)}>
            <Check />
            Done
          </Button>
        </DialogContent>
      </Dialog>
      {inspect && (
        <Inspector title={inspect} onClose={() => setInspect("")}>
          <Tag tone="blue">{state.classification}</Tag>
          <h3 className="text-2xl font-semibold mt-4">
            {inspect === "Monthly revenue"
              ? money(state.figures["revenue"])
              : inspect === "Operating profit"
                ? money(f.profit)
                : inspect === "Available cash"
                  ? money(state.figures["cash"])
                  : `${f.margin?.toFixed(1) ?? "—"}%`}
          </h3>
          <p className="description mt-3">
            {inspect === "Operating profit"
              ? "Revenue minus ingredients, salaries, rent, utilities, marketing, delivery commissions and other operating expenses."
              : inspect === "Operating margin"
                ? "Operating profit ÷ revenue × 100. Net profit requires additional tax and financing figures."
                : inspect === "Available cash"
                  ? "Cash balance divided by fixed monthly operating costs gives the cash coverage indicator."
                  : "Illustrative POS sample · November 2026 · USD. All channels consolidated."}
          </p>
          <div className="notice">
            Source: Cedar House sample dataset v3. Figures are fictional and can be edited in the
            health assessment.
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/assessment" })}>
            Open source figures
            <ArrowUpRight />
          </Button>
        </Inspector>
      )}
    </div>
  );
}
function PlusIcon() {
  return <span className="text-base leading-none">+</span>;
}
