import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { ArrowRight, Download, Network, FileSpreadsheet, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlatform } from "../platform/state";
import { revenueHistory, financials, money, dimensions } from "../platform/model";
import { downloadCSV } from "../platform/report";
import { PageHeading, Panel, Kpi, ModuleTabs, Tag, Footer } from "../platform/common";
import { RelationshipMap } from "./business";
export function Intelligence() {
  const { state } = usePlatform();
  const [tab, setTab] = useState("Analytics");
  const [analysis, setAnalysis] = useState("Financial performance");
  const [range, setRange] = useState("6 months");
  const [group, setGroup] = useState("Monthly");
  const f = financials(state.figures);
  const monthly = revenueHistory
    .map((r, i) =>
      i === 5 ? { ...r, revenue: state.figures["revenue"] ?? 0, profit: f.profit ?? 0 } : r,
    )
    .slice(range === "3 months" ? -3 : 0);
  const quarterly = [
    {
      month: "Q3",
      revenue: monthly.slice(0, 3).reduce((s, r) => s + r.revenue, 0),
      profit: monthly.slice(0, 3).reduce((s, r) => s + r.profit, 0),
    },
    {
      month: "Q4 partial",
      revenue: monthly.slice(3).reduce((s, r) => s + r.revenue, 0),
      profit: monthly.slice(3).reduce((s, r) => s + r.profit, 0),
    },
  ];
  const chart = group === "Quarterly" && range === "6 months" ? quarterly : monthly;
  return (
    <div className="page">
      <PageHeading
        title="Business intelligence workspace"
        subtitle="Explore the complete business model and the relationships behind performance."
        actions={
          <Link to="/lab">
            <Button size="sm">
              Open research session
              <ArrowRight />
            </Button>
          </Link>
        }
      />
      <ModuleTabs
        tabs={["Analytics", "Business model", "Dimensions", "Data sources"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Analytics" ? (
        <>
          <div className="form-grid mb-5">
            <div>
              <label>Analysis</label>
              <select
                aria-label="Analysis type"
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
              >
                {[
                  "Financial performance",
                  "Sales & menu economics",
                  "Inventory & suppliers",
                  "Customer intelligence",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label>Period</label>
                <select
                  aria-label="Analysis period"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option>6 months</option>
                  <option>3 months</option>
                </select>
              </div>
              <div className="flex-1">
                <label>Grouping</label>
                <select
                  aria-label="Analysis grouping"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
            </div>
          </div>
          {analysis === "Financial performance" ? (
            <>
              <div className="kpi-grid">
                <Kpi
                  label="Period revenue"
                  value={money(monthly.reduce((s, r) => s + r.revenue, 0))}
                  caption="Illustrative history + current baseline"
                />
                <Kpi
                  label="Period operating profit"
                  value={money(monthly.reduce((s, r) => s + r.profit, 0))}
                  caption="Before financing and tax"
                />
                <Kpi
                  label="Current gross margin"
                  value={`${f.gross?.toFixed(1) ?? "—"}%`}
                  caption="Current baseline"
                />
              </div>
              <Panel
                title="Revenue and operating profit"
                subtitle={`${range} · ${group.toLowerCase()} · illustrative history`}
                actions={
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(chart)}>
                    <Download />
                    CSV
                  </Button>
                }
              >
                <div className="chart-area h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart}>
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `$${v / 1000}k`}
                        tick={{ fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip formatter={(v) => money(Number(v))} />
                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="var(--chart-revenue)"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="profit"
                        name="Operating profit"
                        fill="var(--chart-profit)"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-footer">
                  <span>Sources: illustrative POS and accounting datasets</span>
                  <Tag>Deterministic arithmetic</Tag>
                </div>
              </Panel>
            </>
          ) : analysis === "Sales & menu economics" ? (
            <>
              <Panel
                title="Menu economics"
                subtitle="Sample product subset · not the complete sales ledger"
              >
                <div className="table-wrap mt-5">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Units</th>
                        <th>Price</th>
                        <th>Direct cost</th>
                        <th>Unit gross margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.rows.map((r, i) => {
                        const price = Number(r["price"]);
                        const cost = Number(r["cost"]);
                        return (
                          <tr key={i}>
                            <td>{r["item"] ?? "Not mapped"}</td>
                            <td>{r["units"] ?? "Not mapped"}</td>
                            <td>{Number.isFinite(price) ? money(price) : "Not mapped"}</td>
                            <td>{Number.isFinite(cost) ? money(cost, 2) : "Not mapped"}</td>
                            <td>
                              {Number.isFinite(price) && price > 0 && Number.isFinite(cost)
                                ? `${(((price - cost) / price) * 100).toFixed(1)}%`
                                : "Insufficient data"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <div className="notice">
                Gross margin excludes labor, rent and other overhead. Imported fields must be mapped
                to item, units, price and cost to compute product economics.
              </div>
            </>
          ) : analysis === "Inventory & suppliers" ? (
            <div className="two-column">
              <Panel title="Inventory position" subtitle="Illustrative sample observations">
                <div className="panel-body">
                  <div className="kpi-value">{money(state.figures["inventory"])}</div>
                  <p className="description mt-3">
                    6 monitored ingredient groups · estimated waste 10% · on-time supplier delivery
                    94%
                  </p>
                  <div className="notice">
                    Supplier concentration: largest vendor supplies an illustrative 48% of
                    purchases. Alternative-vendor qualification is recommended before reducing order
                    commitments.
                  </div>
                </div>
              </Panel>
              <section>
                <h2 className="section-title">Research priorities</h2>
                <p className="description">
                  Validate expiry logs, stockouts, reorder points and purchase lead times. Do not
                  infer inventory turnover without opening stock, closing stock and period
                  consumption.
                </p>
                <Link to="/dimensions/$pillar" params={{ pillar: "inventory" }}>
                  <Button variant="outline" className="mt-5">
                    Inventory assessment
                    <ArrowRight />
                  </Button>
                </Link>
              </section>
            </div>
          ) : (
            <>
              <div className="kpi-grid">
                <Kpi
                  label="Monthly transactions"
                  value={String(state.figures["customers"] ?? "Not available")}
                  caption="Not unique customers"
                />
                <Kpi
                  label="Average transaction"
                  value={
                    state.figures["revenue"] != null && state.figures["customers"]
                      ? money(state.figures["revenue"] / state.figures["customers"])
                      : "Insufficient data"
                  }
                  caption="Revenue / transaction count"
                />
                <Kpi label="Retention / LTV" value="Not available" caption="Requires cohort data" />
              </div>
              <div className="notice">
                The fictional sample suggests a 42% repeat-customer share; this is not a verified
                retention metric. Customer segmentation and churn models need validated customer
                identifiers and longitudinal history.
              </div>
            </>
          )}
        </>
      ) : tab === "Business model" ? (
        <RelationshipMap />
      ) : tab === "Dimensions" ? (
        <div className="three-grid">
          {dimensions.map((d) => (
            <Link
              className="dimension-card"
              key={d.slug}
              to="/dimensions/$pillar"
              params={{ pillar: d.slug }}
            >
              <div className="eyebrow">{d.short}</div>
              <h3>{d.name}</h3>
              <p className="description mt-3">{d.fields.join(" · ")}</p>
              <div className="flex justify-between mt-4">
                <Tag>{d.completeness}% sample coverage</Tag>
                <ArrowRight className="size-4 text-primary" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="three-grid">
          {[
            ["POS transactions", "Revenue, sales channels and menu products"],
            ["Accounting ledger", "Expenses, operating profit and cash position"],
            ["Operations spreadsheets", "Inventory, purchasing, staffing and service logs"],
          ].map(([title, desc]) => (
            <article className="dimension-card" key={title}>
              <FileSpreadsheet className="text-primary size-5" />
              <h3>{title}</h3>
              <p className="description mt-3">{desc}</p>
              <Link to="/data">
                <Button variant="outline" size="sm" className="mt-4">
                  Inspect dataset
                  <ArrowRight />
                </Button>
              </Link>
            </article>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
