import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Download, FileText, Info, RotateCcw, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlatform } from "../platform/state";
import { demoFigures, figureLabels, costKeys, financials, money } from "../platform/model";
import { downloadReport } from "../platform/report";
import { PageHeading, Field, Kpi, Panel, Tag, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Assessment() {
  const { state, update, log } = usePlatform();
  const f = financials(state.figures);
  const [tab, setTab] = useState("Financial overview");
  const [method, setMethod] = useState(false);
  const [edit, setEdit] = useState(false);
  const data = costKeys.map((k) => ({
    name: figureLabels[k]?.split(" ")[0] ?? k,
    value: state.figures[k],
  }));
  return (
    <div className="page">
      <PageHeading
        title="Business health assessment"
        subtitle="A transparent financial baseline, grounded in the figures you provide."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setEdit(true)}>
              Edit figures
            </Button>
            <Button
              size="sm"
              onClick={() => downloadReport(state.profile, state.figures, state.classification)}
            >
              <Download />
              Export PDF
            </Button>
          </>
        }
      />
      <div className="flex gap-2 mb-5">
        <Tag tone="blue">{state.classification}</Tag>
        <Tag>{f.coverage}% data coverage</Tag>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] text-primary"
          onClick={() => setMethod(true)}
        >
          <Info />
          Score methodology
        </Button>
      </div>
      <div className="kpi-grid">
        <Kpi
          label="Financial health score"
          value={f.score != null ? `${f.score}/100` : "Insufficient data"}
          caption="Disclosed heuristic · not an overall rating"
        />
        <Kpi
          label="Gross margin"
          value={f.gross != null ? `${f.gross.toFixed(1)}%` : "Insufficient data"}
          caption="Revenue less direct ingredient costs"
        />
        <Kpi
          label="Operating margin"
          value={f.margin != null ? `${f.margin.toFixed(1)}%` : "Insufficient data"}
          caption="Operating profit / revenue"
        />
        <Kpi
          label="Break-even revenue"
          value={money(f.breakEven)}
          caption="Fixed costs / contribution ratio"
        />
      </div>
      <ModuleTabs
        tabs={["Financial overview", "Strengths & risks", "Growth potential", "Source figures"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Financial overview" ? (
        <div className="two-column">
          <Panel title="Monthly cost structure" subtitle="Operating expense allocation · USD">
            <div className="chart-area h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ left: 0, right: 15, bottom: 20 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v / 1000}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                    width={45}
                  />
                  <Tooltip formatter={(v) => money(Number(v))} />
                  <Bar
                    dataKey="value"
                    fill="var(--chart-revenue)"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              Total operating expenses
              <strong className="text-foreground">{money(f.expenses)}</strong>
            </div>
          </Panel>
          <Panel title="Financial position" subtitle="Calculated from the entered monthly figures">
            <div className="panel-body">
              {[
                ["Revenue", money(state.figures["revenue"])],
                ["Operating profit", money(f.profit)],
                [
                  "Cash coverage",
                  f.cashMonths != null ? `${f.cashMonths.toFixed(2)} months` : "Insufficient data",
                ],
                ["Fixed operating costs", money(f.fixed)],
                [
                  "Variable costs",
                  money(
                    state.figures["ingredients"] != null && state.figures["delivery"] != null
                      ? state.figures["ingredients"] + state.figures["delivery"]
                      : null,
                  ),
                ],
                ["Net margin", "Not available"],
              ].map(([k, v]) => (
                <div className="settings-line py-3" key={k}>
                  <span className="text-muted-foreground text-xs">{k}</span>
                  <strong className="text-xs">{v}</strong>
                </div>
              ))}
              <div className="notice mb-0">
                Debt service, taxes, capital expenditure and receivables are not included. Working
                capital and net profit cannot be established from the current fields alone.
              </div>
            </div>
          </Panel>
        </div>
      ) : tab === "Source figures" ? (
        <>
          <FigureForm />
          <Button
            className="mt-5"
            onClick={() => {
              log("Health assessment source figures reviewed");
              toast.success("Figures saved and assessment recalculated");
            }}
          >
            <Check />
            Save & recalculate
          </Button>
        </>
      ) : tab === "Strengths & risks" ? (
        <div className="two-column">
          <section>
            <h2 className="section-title">Measured from the entered figures</h2>
            {[
              [
                "Positive gross margin",
                `Gross margin is ${f.gross?.toFixed(1) ?? "unavailable"}%. This is not a comparison to a validated industry benchmark.`,
              ],
              [
                "Limited operating buffer",
                `Operating profit is ${money(f.profit)}. A revenue or cost change may materially affect profitability.`,
              ],
              [
                "Cash coverage",
                `${f.cashMonths?.toFixed(2) ?? "Unknown"} months of fixed costs. The 1.5-month reference is an illustrative management threshold.`,
              ],
            ].map(([t, b]) => (
              <div className="side-note" key={t}>
                <h3 className="font-semibold text-xs">{t}</h3>
                <p className="description mt-2">{b}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="section-title">Hypotheses requiring validation</h2>
            <p className="description">
              Ingredient waste, excess weekday staffing, supplier concentration and delivery channel
              dependency require supporting records. The prototype does not establish causation or
              verified inefficiency.
            </p>
            <div className="notice">
              Operational efficiency, commercial performance, strategic readiness and risk exposure:
              insufficient verified data for numerical scores.
            </div>
          </section>
        </div>
      ) : (
        <>
          <h2 className="section-title">Evidence-led opportunities</h2>
          <div className="three-grid">
            {state.decisions.map((d) => (
              <div className="dimension-card" key={d.id}>
                <Tag tone="warning">Illustrative estimate</Tag>
                <h3>{d.title}</h3>
                <div className="text-xl text-success font-semibold my-4">
                  +{money(d.impact)} / month
                </div>
                <p className="description">{d.method}</p>
                <div className="notice">{d.assumption}</div>
              </div>
            ))}
          </div>
          <p className="description mt-4">
            Estimates may overlap. Validate assumptions and costs before adding potential savings
            together.
          </p>
        </>
      )}
      <Footer />
      <Dialog open={method} onOpenChange={setMethod}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Financial health methodology</DialogTitle>
            <DialogDescription>A deterministic, disclosed preliminary heuristic</DialogDescription>
          </DialogHeader>
          <p className="description">
            Operating margin: up to 40 points, reaching the cap at 10%. Gross margin: up to 30
            points, reaching the cap at 70%. Cash coverage: up to 30 points, reaching the cap at 1.5
            months of fixed expenses.
          </p>
          <p className="description">
            Negative margins contribute zero. A missing required figure makes the score unavailable.
            Thresholds are illustrative management criteria, not industry standards. This is a
            financial score only, not an overall business rating.
          </p>
          <div className="notice">
            Score {f.score ?? "unavailable"} · {f.coverage}% source-field coverage ·{" "}
            {state.classification}. Confidence is limited by source validation, not the arithmetic.
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="dialog-large">
          <DialogHeader>
            <DialogTitle>Enter business figures</DialogTitle>
            <DialogDescription>
              Monthly figures in USD; blank fields remain unavailable
            </DialogDescription>
          </DialogHeader>
          <FigureForm />
          <Button
            onClick={() => {
              setEdit(false);
              log("Monthly business figures updated");
              toast.success("Assessment recalculated");
            }}
          >
            <Check />
            Update assessment
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function FigureForm() {
  const { state, update } = usePlatform();
  return (
    <>
      <div className="flex gap-3 items-center mb-6">
        <select
          aria-label="Figure type"
          value={state.classification}
          onChange={(e) => update((s) => ({ ...s, classification: e.target.value }))}
        >
          {["Illustrative sample", "User-provided figure", "Estimated figure"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            update((s) => ({
              ...s,
              figures: { ...demoFigures },
              classification: "Illustrative sample",
            }))
          }
        >
          <RotateCcw />
          Sample
        </Button>
      </div>
      <div className="form-grid">
        {Object.entries(figureLabels).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              aria-label={label}
              type="number"
              min={0}
              value={state.figures[key] ?? ""}
              onChange={(e) => {
                const value = e.target.value === "" ? null : Number(e.target.value);
                if (value != null && (value < 0 || !Number.isFinite(value))) return;
                update((s) => ({ ...s, figures: { ...s.figures, [key]: value } }));
              }}
              placeholder="Not available"
            />
          </Field>
        ))}
      </div>
    </>
  );
}
