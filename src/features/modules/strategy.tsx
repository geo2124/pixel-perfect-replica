import { useState } from "react";
import { Plus, Target, ArrowRight, Check, CalendarDays, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlatform } from "../platform/state";
import { money, scenario, type Target as TargetModel } from "../platform/model";
import { PageHeading, Tag, Field, Progress, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Strategy() {
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Active objectives");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TargetModel | null>(null);
  const [title, setTitle] = useState("");
  const [baseline, setBaseline] = useState(6);
  const [desired, setDesired] = useState(12);
  const [unit, setUnit] = useState("%");
  const [deadline, setDeadline] = useState("2027-06-30");
  const [budget, setBudget] = useState(10000);
  const [constraints, setConstraints] = useState("Preserve staffing and guest experience");
  const create = () => {
    if (!title.trim() || !deadline || desired === baseline) {
      toast.error("Enter a title, deadline and a target different from the baseline");
      return;
    }
    update((s) => ({
      ...s,
      targets: [
        ...s.targets,
        {
          id: `T-${Date.now()}`,
          title,
          baseline,
          target: desired,
          current: baseline,
          unit,
          deadline,
          budget,
        },
      ],
    }));
    log(`Strategic target created: ${title}; constraints: ${constraints}`);
    setOpen(false);
    setTitle("");
    toast.success("Target added");
  };
  return (
    <div className="page">
      <PageHeading
        title="Strategy & targets"
        subtitle="Define the destination. Compare the routes. Measure the progress."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus />
            Define target
          </Button>
        }
      />
      <ModuleTabs
        tabs={["Active objectives", "Scenario routes", "Milestones"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Active objectives" ? (
        <div className="three-grid">
          {state.targets.map((t) => {
            const pct = ((t.current - t.baseline) / (t.target - t.baseline)) * 100;
            return (
              <article className="target-card" key={t.id}>
                <div className="flex justify-between">
                  <Target className="size-5 text-primary" />
                  <Tag tone={pct >= 100 ? "success" : "blue"}>
                    {pct >= 100 ? "Target reached" : "In progress"}
                  </Tag>
                </div>
                <h3 className="mt-5">{t.title}</h3>
                <div className="target-value">
                  {t.unit === "USD" ? money(t.current) : `${t.current}${t.unit}`}{" "}
                  <small>/ {t.unit === "USD" ? money(t.target) : `${t.target}${t.unit}`}</small>
                </div>
                <Progress value={pct} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-3">
                  <span>{Math.round(Math.max(0, pct))}% progress</span>
                  <span>{t.deadline}</span>
                </div>
                <div className="settings-line mt-4 text-xs">
                  <span>Available investment</span>
                  <strong>{money(t.budget)}</strong>
                </div>
                <Button variant="outline" className="w-full mt-5" onClick={() => setSelected(t)}>
                  Review achievement plan
                  <ArrowRight />
                </Button>
              </article>
            );
          })}
        </div>
      ) : tab === "Scenario routes" ? (
        <>
          <h2 className="section-title">Operating margin target: 6% → 12%</h2>
          <p className="description mb-5">
            Illustrative levers and modeled outcomes against the current financial baseline.
          </p>
          <div className="three-grid">
            {[
              { title: "Conservative", growth: 2, cost: 3, payroll: 0, risk: "Low" },
              { title: "Expected", growth: 5, cost: 7.5, payroll: 5, risk: "Medium" },
              { title: "Aggressive", growth: 10, cost: 10, payroll: 7.5, risk: "High" },
            ].map((s) => {
              const r = scenario(state.figures, s.growth, s.cost, s.payroll);
              return (
                <article className="dimension-card" key={s.title}>
                  <Tag tone="warning">{s.risk} execution risk</Tag>
                  <h3>{s.title} route</h3>
                  <div className="target-value">
                    {r?.margin.toFixed(1) ?? "—"}% <small>modeled margin</small>
                  </div>
                  <p className="description">
                    Revenue +{s.growth}%, ingredient costs −{s.cost}%, payroll efficiency{" "}
                    {s.payroll}%. Other costs fixed.
                  </p>
                  <div className="notice">
                    {r && r.margin >= 12
                      ? "Reaches 12% in the elementary model; operational feasibility is unvalidated."
                      : "Does not reach 12% in this model. Additional levers or resources are needed."}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="panel">
          {[
            ["01", "Validate daily waste & staffing baseline", "Weeks 1–2", "Operations manager"],
            ["02", "Run demand-led purchasing pilot", "Weeks 3–6", "Kitchen & procurement"],
            ["03", "Review adjusted financial outcomes", "Week 7", "Finance lead"],
            ["04", "Approve scale-up or revise assumptions", "Week 8", "Business owner"],
          ].map(([i, t, d, o]) => (
            <div className="list-row" key={i}>
              <span className="opportunity-icon font-mono text-xs">{i}</span>
              <div className="flex-1">
                <h3>{t}</h3>
                <p>
                  {d} · {o} · Sample implementation plan
                </p>
              </div>
              <Tag>Planned</Tag>
            </div>
          ))}
        </div>
      )}
      <Footer />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Define a strategic target</DialogTitle>
            <DialogDescription>
              Set a measurable baseline, destination and constraints
            </DialogDescription>
          </DialogHeader>
          <div className="form-grid">
            <Field label="Objective" full>
              <input
                aria-label="Target objective"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Improve operating margin"
              />
            </Field>
            <Field label="Current baseline">
              <input
                aria-label="Target baseline"
                type="number"
                value={baseline}
                onChange={(e) => setBaseline(Number(e.target.value))}
              />
            </Field>
            <Field label="Desired target">
              <input
                aria-label="Desired target"
                type="number"
                value={desired}
                onChange={(e) => setDesired(Number(e.target.value))}
              />
            </Field>
            <Field label="Unit">
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option>%</option>
                <option>USD</option>
                <option>units</option>
                <option>days</option>
              </select>
            </Field>
            <Field label="Deadline">
              <input
                aria-label="Target deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Field>
            <Field label="Available investment (USD)" full>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
              />
            </Field>
            <Field label="Constraints & accepted risks" full>
              <textarea
                rows={2}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </Field>
          </div>
          <Button onClick={create}>
            <Check />
            Create target
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <DialogContent className="dialog-large">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Achievement plan · illustrative, subject to validation
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="form-grid">
                <div>
                  <div className="eyebrow">BASELINE → TARGET</div>
                  <strong>
                    {selected.baseline} → {selected.target} {selected.unit}
                  </strong>
                </div>
                <div>
                  <div className="eyebrow">DEADLINE / RESOURCES</div>
                  <strong>
                    {selected.deadline} / {money(selected.budget)}
                  </strong>
                </div>
              </div>
              <h3 className="font-semibold mt-3">Recommended route</h3>
              <p className="description">
                Validate the baseline, run a constrained four-week pilot, compare adjusted outcomes,
                and expand only after management review. Finance, operations and procurement owners
                must agree assumptions.
              </p>
              <div className="notice">
                Target feasibility is not established from a single metric. The modeled margin
                scenarios can test preliminary levers, but capacity, budget, demand and execution
                risks require validation.
              </div>
              <Field label="Update measured progress">
                <input
                  aria-label="Measured target progress"
                  type="number"
                  value={selected.current}
                  onChange={(e) => setSelected({ ...selected, current: Number(e.target.value) })}
                />
              </Field>
              <Button
                onClick={() => {
                  update((s) => ({
                    ...s,
                    targets: s.targets.map((t) => (t.id === selected.id ? selected : t)),
                  }));
                  log(
                    `Target progress updated by management: ${selected.title} (${selected.current}${selected.unit}, user-provided)`,
                  );
                  setSelected(null);
                  toast.success("Progress saved");
                }}
              >
                <Check />
                Save progress
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
