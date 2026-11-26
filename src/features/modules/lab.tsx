import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Play, Save, Plus, FlaskConical, Check, ArrowRight, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlatform } from "../platform/state";
import { financials, scenario, money } from "../platform/model";
import { downloadCSV } from "../platform/report";
import { PageHeading, Field, Panel, Kpi, Tag, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Lab() {
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Scenario studio");
  const [name, setName] = useState("Margin improvement · November");
  const [growth, setGrowth] = useState(5);
  const [ingredients, setIngredients] = useState(7.5);
  const [payroll, setPayroll] = useState(5);
  const [budget, setBudget] = useState(10000);
  const [staff, setStaff] = useState(4);
  const [horizon, setHorizon] = useState("6 months");
  const [objective, setObjective] = useState("Maximize operating profit");
  const [engine, setEngine] = useState("Resource allocation");
  const [ran, setRan] = useState(false);
  const f = financials(state.figures);
  const result = ran ? scenario(state.figures, growth, ingredients, payroll) : null;
  const scenarios = [
    { name: "Conservative", growth: 2, ingredients: 3, payroll: 0 },
    { name: "Expected", growth: 5, ingredients: 7.5, payroll: 5 },
    { name: "Aggressive", growth: 10, ingredients: 10, payroll: 7.5 },
    ...state.savedScenarios,
  ];
  const forecasting = Array.from({ length: 6 }, (_, i) => {
    const expected = (state.figures["revenue"] ?? 0) * Math.pow(1 + growth / 100, i + 1);
    return {
      month: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"][i] ?? "",
      expected: Math.round(expected),
      low: Math.round(expected * 0.92),
      high: Math.round(expected * 1.08),
    };
  });
  const run = () => {
    if (f.profit == null) {
      toast.error("Complete the source financial figures first");
      return;
    }
    setRan(true);
    log(`Illustrative scenario evaluated: ${name}`);
  };
  return (
    <div className="page">
      <PageHeading
        title="Research & optimization lab"
        subtitle="Define the problem, test the assumptions and compare possible outcomes."
        actions={
          <Button
            size="sm"
            onClick={() => {
              setRan(false);
              setName("Untitled scenario");
              setGrowth(0);
              setIngredients(0);
              setPayroll(0);
            }}
          >
            <Plus />
            New session
          </Button>
        }
      />
      <ModuleTabs
        tabs={["Scenario studio", "Compare scenarios", "Forecasting", "Model evaluation"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Scenario studio" ? (
        <>
          <div className="two-column">
            <section>
              <div className="eyebrow">MODEL CONFIGURATION</div>
              <h2 className="section-title">A better operating margin</h2>
              <div className="form-grid mt-6">
                <Field label="Session name" full>
                  <input
                    aria-label="Session name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Objective">
                  <select value={objective} onChange={(e) => setObjective(e.target.value)}>
                    {[
                      "Maximize operating profit",
                      "Reduce operating costs",
                      "Improve cash resilience",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Research method">
                  <select value={engine} onChange={(e) => setEngine(e.target.value)}>
                    {[
                      "Resource allocation",
                      "Inventory optimization",
                      "Workforce scheduling",
                      "Pricing optimization",
                      "Linear programming concept",
                      "Mixed-integer optimization concept",
                      "Constraint programming concept",
                      "Sensitivity analysis",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <h3 className="font-semibold text-xs mt-7 mb-5">Decision variables</h3>
              {[
                ["Revenue growth", growth, setGrowth, 20],
                ["Ingredient cost reduction", ingredients, setIngredients, 20],
                ["Payroll efficiency", payroll, setPayroll, 10],
              ].map(([label, value, set, max]) => (
                <div key={String(label)} className="mb-5">
                  <div className="flex justify-between mb-2">
                    <label>{String(label)}</label>
                    <span className="font-mono text-xs text-primary">
                      {Number(value).toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label={String(label)}
                    min={0}
                    max={Number(max)}
                    step={0.5}
                    value={Number(value)}
                    onChange={(e) => {
                      (set as (v: number) => void)(Number(e.target.value));
                      setRan(false);
                    }}
                  />
                </div>
              ))}
              <h3 className="font-semibold text-xs mt-7 mb-4">Constraints & assumptions</h3>
              <div className="form-grid">
                <Field label="Implementation budget (USD)">
                  <input
                    aria-label="Implementation budget"
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  />
                </Field>
                <Field label="Minimum staff per service">
                  <input
                    aria-label="Minimum staff"
                    type="number"
                    min={1}
                    max={22}
                    value={staff}
                    onChange={(e) => setStaff(Math.max(1, Math.min(22, Number(e.target.value))))}
                  />
                </Field>
                <Field label="Planning horizon" full>
                  <select value={horizon} onChange={(e) => setHorizon(e.target.value)}>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                  </select>
                </Field>
              </div>
              <div className="notice">
                Preserve food quality, service standards and employee headcount. Budget and minimum
                staffing are recorded constraints, not solver-enforced feasibility checks.
              </div>
              <Button onClick={run}>
                <Play />
                Evaluate scenario
              </Button>
            </section>
            <Panel
              title={ran ? "Scenario results" : "Current monthly baseline"}
              subtitle={ran ? name : "November 2026 · illustrative dataset v3"}
            >
              <div className="panel-body">
                <Tag tone="blue">Deterministic arithmetic · illustrative</Tag>
                <div className="mt-7">
                  <div className="eyebrow">PROJECTED MONTHLY OPERATING PROFIT</div>
                  <div className="text-4xl font-semibold">{money(result?.profit ?? f.profit)}</div>
                  <p className="text-success text-xs mt-3">
                    {result
                      ? `+${money(result.improvement)} vs. baseline`
                      : "Enter assumptions and evaluate a scenario"}
                  </p>
                </div>
                <div className="settings-line">
                  <span>Operating margin</span>
                  <strong>{(result?.margin ?? f.margin)?.toFixed(1) ?? "—"}%</strong>
                </div>
                <div className="settings-line">
                  <span>Revenue</span>
                  <strong>{money(result?.revenue ?? state.figures["revenue"])}</strong>
                </div>
                <div className="settings-line">
                  <span>Horizon / budget</span>
                  <strong>
                    {horizon} / {money(budget)}
                  </strong>
                </div>
                <div className="notice">
                  Revenue grows at the selected rate; ingredients and delivery commissions scale
                  with revenue. Ingredient reductions and payroll efficiency apply to those cost
                  bases. Other costs remain fixed.
                </div>
                <p className="description">
                  Model v1.0 · dataset v3 · no external solver. This is an explainable what-if
                  calculation, not an optimal solution. Capacity, staffing and implementation
                  feasibility still require validation.
                </p>
                {result && (
                  <Button
                    variant="outline"
                    className="mt-5 w-full"
                    onClick={() => {
                      update((s) => ({
                        ...s,
                        savedScenarios: [
                          ...s.savedScenarios,
                          { name, growth, ingredients, payroll },
                        ],
                      }));
                      log(`Scenario saved: ${name}`);
                      toast.success("Scenario saved");
                    }}
                  >
                    <Save />
                    Save analytical session
                  </Button>
                )}
              </div>
            </Panel>
          </div>
        </>
      ) : tab === "Compare scenarios" ? (
        <>
          <div className="panel table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Revenue growth</th>
                  <th>Ingredient reduction</th>
                  <th>Payroll efficiency</th>
                  <th>Revenue</th>
                  <th>Operating profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => {
                  const r = scenario(state.figures, s.growth, s.ingredients, s.payroll);
                  return (
                    <tr key={i}>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td>{s.growth}%</td>
                      <td>{s.ingredients}%</td>
                      <td>{s.payroll}%</td>
                      <td>{money(r?.revenue)}</td>
                      <td className="text-success">{money(r?.profit)}</td>
                      <td>{r?.margin.toFixed(1) ?? "—"}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="notice">
            Conservative, expected and aggressive are illustrative assumption sets, not
            probability-weighted forecasts. Aggressive savings may not be operationally feasible.
          </div>
          <Button
            variant="outline"
            onClick={() =>
              downloadCSV(
                scenarios.map((s) => ({
                  ...s,
                  ...scenario(state.figures, s.growth, s.ingredients, s.payroll),
                })),
              )
            }
          >
            <Download />
            Export comparison
          </Button>
        </>
      ) : tab === "Forecasting" ? (
        <>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="section-title">Revenue planning envelope</h2>
              <p className="description">
                Monthly growth assumption: {growth}% · illustrative ±8% envelope, not a statistical
                confidence interval
              </p>
            </div>
            <Tag tone="warning">Unvalidated forecast</Tag>
          </div>
          <Panel
            title="Six-month revenue projection"
            subtitle="Assumption-based compounding; no trained model"
          >
            <div className="chart-area h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecasting}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis
                    tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip formatter={(v) => money(Number(v))} />
                  <Line
                    dataKey="high"
                    name="Upper envelope"
                    stroke="var(--chart-target)"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    dataKey="expected"
                    name="Expected assumption"
                    stroke="var(--chart-revenue)"
                    strokeWidth={2.5}
                  />
                  <Line
                    dataKey="low"
                    name="Lower envelope"
                    stroke="var(--chart-target)"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              No seasonality, price shocks or demand constraints applied.
            </div>
          </Panel>
          <div className="notice">
            A production forecast would require sufficient historical observations, out-of-sample
            evaluation and calibrated uncertainty. These values are planning scenarios only.
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">Machine learning model registry</h2>
          <div className="panel table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model concept</th>
                  <th>Version</th>
                  <th>Sample evaluation</th>
                  <th>Status</th>
                  <th>Training data</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Demand forecasting", "MAPE 12.4%"],
                  ["Customer segmentation", "Silhouette 0.61"],
                  ["Churn prediction", "AUC 0.78"],
                  ["Supplier performance", "MAE 1.8 days"],
                  ["Anomaly detection", "Precision 0.83"],
                ].map(([m, v]) => (
                  <tr key={m}>
                    <td>{m}</td>
                    <td>Concept v0.1</td>
                    <td>{v} · illustrative</td>
                    <td>
                      <Tag tone="warning">Not trained</Tag>
                    </td>
                    <td>Fictional demonstration</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            No ML model is trained or deployed. Sample evaluation numbers are interface examples,
            not measured performance. Feature importance, model drift and production version
            governance require validated datasets.
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
