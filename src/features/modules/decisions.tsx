import { useState } from "react";
import {
  Check,
  X,
  ArrowRight,
  FileText,
  Download,
  Search,
  Clock,
  MoreHorizontal,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlatform, canApprove } from "../platform/state";
import { money, financials, type Decision } from "../platform/model";
import { downloadReport } from "../platform/report";
import { PageHeading, Panel, Tag, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Decisions() {
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Decision center");
  const [selected, setSelected] = useState<Decision | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [preview, setPreview] = useState(false);
  const f = financials(state.figures);
  const act = (status: string) => {
    if (!selected) return;
    update((s) => ({
      ...s,
      decisions: s.decisions.map((d) => (d.id === selected.id ? { ...d, status } : d)),
    }));
    log(`${selected.id}: ${status} by ${state.role} (simulated workflow)`);
    toast.success(`Decision ${status.toLowerCase()}`);
    setSelected(null);
  };
  return (
    <div className="page">
      <PageHeading
        title="Reports & decision center"
        subtitle="From evidence to accountable action. Review, approve and track what changes."
        actions={
          <Button size="sm" onClick={() => setPreview(true)}>
            <FileText />
            Executive report
          </Button>
        }
      />
      <ModuleTabs
        tabs={["Decision center", "Report library", "Implementation", "Audit trail"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Decision center" ? (
        <>
          <div className="flex gap-3 mb-5">
            <input
              className="max-w-sm"
              aria-label="Search decisions"
              placeholder="Search decisions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="max-w-44"
              aria-label="Decision status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {[
                "All statuses",
                "Pending review",
                "Approved",
                "Rejected",
                "In progress",
                "Analysis requested",
                "Implemented",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="panel table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Decision</th>
                  <th>Dimension</th>
                  <th>Potential impact</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.decisions
                  .filter(
                    (d) =>
                      d.title.toLowerCase().includes(search.toLowerCase()) &&
                      (filter === "All statuses" || d.status === filter),
                  )
                  .map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div className="text-[9px] text-muted-foreground mb-1">{d.id}</div>
                        <strong>{d.title}</strong>
                      </td>
                      <td>{d.pillar}</td>
                      <td className="text-success">{money(d.impact)} / month</td>
                      <td>
                        <Tag tone={d.risk === "Low" ? "success" : "warning"}>{d.risk}</Tag>
                      </td>
                      <td>
                        <Tag tone={d.status === "Pending review" ? "warning" : "blue"}>
                          {d.status}
                        </Tag>
                      </td>
                      <td>
                        <Button variant="outline" size="sm" onClick={() => setSelected(d)}>
                          Review
                          <ArrowRight />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            Recommendations use the original Cedar House sample baseline. If you change source
            figures, the sample evidence must be revalidated; it is not automatically recalibrated.
          </div>
        </>
      ) : tab === "Report library" ? (
        <div className="three-grid">
          {[
            "Executive business health",
            "Financial performance",
            "Operations & inventory",
            "Optimization scenarios",
            "Strategic planning",
            "Historical decisions",
          ].map((r, i) => (
            <article className="dimension-card" key={r}>
              <FileText className="size-6 text-primary" />
              <h3>{r}</h3>
              <p className="description mt-2">
                November 2026 · sample template
                <br />
                Version 1.0 · confidential
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" size="sm" onClick={() => setPreview(true)}>
                  <Eye />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Download consolidated management report"
                  onClick={() => downloadReport(state.profile, state.figures, state.classification)}
                >
                  <Download />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : tab === "Implementation" ? (
        <>
          <h2 className="section-title">Approved actions & outcome tracking</h2>
          <div className="panel mt-5">
            {state.decisions
              .filter((d) => ["Approved", "In progress", "Implemented"].includes(d.status))
              .map((d) => (
                <div className="list-row" key={d.id}>
                  <Check className="size-4 text-success" />
                  <div className="flex-1">
                    <h3>{d.title}</h3>
                    <p>
                      Owner: {d.pillar === "Operations" ? "Operations manager" : "Business owner"} ·
                      four-week pilot · {d.status}
                    </p>
                    <p>
                      Verification: compare measured cost against baseline, adjusted for sales
                      volume and quality.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={d.status === "Implemented"}
                    onClick={() => {
                      update((s) => ({
                        ...s,
                        decisions: s.decisions.map((v) =>
                          v.id === d.id
                            ? {
                                ...v,
                                status: d.status === "Approved" ? "In progress" : "Implemented",
                              }
                            : v,
                        ),
                      }));
                      log(
                        `${d.id}: implementation status updated; actual outcomes still require data`,
                      );
                    }}
                  >
                    {d.status === "Approved"
                      ? "Start pilot"
                      : d.status === "Implemented"
                        ? "Completed"
                        : "Complete pilot"}
                  </Button>
                </div>
              ))}
          </div>
          <div className="notice">
            Completing a task does not verify savings. Actual outcomes remain unavailable until
            measured data is entered and reviewed.
          </div>
        </>
      ) : (
        <div className="panel">
          {state.activity.map((a, i) => (
            <div className="list-row" key={i}>
              <Clock className="size-4 text-muted-foreground" />
              <div>
                <h3>{a}</h3>
                <p>Local prototype event · not an immutable production audit log</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
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
              {selected?.id} · Sample recommendation · management review required
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="flex gap-2">
                <Tag tone="warning">{selected.risk} risk</Tag>
                <Tag>{selected.confidence}% illustrative confidence</Tag>
                <Tag tone="success">+{money(selected.impact)} / month</Tag>
              </div>
              {[
                ["Problem & evidence", selected.evidence],
                ["Calculation / methodology", selected.method],
                ["Assumptions", selected.assumption],
                ["Recommended implementation", selected.action],
                ["Implementation cost", money(selected.cost)],
                [
                  "Risks & dependencies",
                  "Preserve food quality and service standards; validate source logs; obtain department-owner approval.",
                ],
                [
                  "Outcome verification",
                  "Four-week pilot. Compare adjusted actual spend to the prior baseline; track service time and guest feedback.",
                ],
              ].map(([t, b]) => (
                <div key={t}>
                  <h3 className="text-xs font-semibold mb-1.5">{t}</h3>
                  <p className="description">{b}</p>
                </div>
              ))}
              <div className="notice">
                {canApprove(state.role)
                  ? `Acting as ${state.role} in a simulated approval workflow.`
                  : `${state.role} can request further analysis; management approval is unavailable in this interface role.`}{" "}
                This is not production authorization.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled={!canApprove(state.role)} onClick={() => act("Approved")}>
                  <Check />
                  Approve decision
                </Button>
                <Button
                  variant="outline"
                  disabled={!canApprove(state.role)}
                  onClick={() => act("Rejected")}
                >
                  <X />
                  Reject
                </Button>
                <Button variant="outline" onClick={() => act("Analysis requested")}>
                  Request analysis
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="dialog-large">
          <DialogHeader>
            <DialogTitle>Executive report preview</DialogTitle>
            <DialogDescription>
              Consolidated management report · PDF contains 15 structured sections
            </DialogDescription>
          </DialogHeader>
          <div className="report-paper">
            <div className="eyebrow">AXIOM / MANAGEMENT INTELLIGENCE</div>
            <h2>
              {state.profile.name}
              <br />
              Business health report
            </h2>
            <Tag>{state.classification}</Tag>
            <h3>01 / Executive summary</h3>
            <p className="description">
              Monthly revenue of {money(state.figures["revenue"])} produces {money(f.profit)}{" "}
              operating profit, a {f.margin?.toFixed(1) ?? "—"}% operating margin. The preliminary
              financial score is {f.score ?? "unavailable"}/100 under the disclosed heuristic.
            </p>
            <h3>02 / Financial assessment</h3>
            <p className="description">
              Gross margin {f.gross?.toFixed(1) ?? "—"}%. Estimated break-even revenue{" "}
              {money(f.breakEven)}. Available cash {money(state.figures["cash"])}. Net margin and
              working capital require additional information.
            </p>
            <h3>03 / Recommendations & limitations</h3>
            <p className="description">
              Validate ingredient waste and staff coverage before running a four-week pilot. All
              underlying demonstration data and potential savings are illustrative. Forecasts and
              scenarios are not guarantees.
            </p>
            <div className="notice">
              Confidential · November 2026 · v1.0
              <br />
              Export includes methodology, operational findings, systems, R&D, implementation, risks
              and next steps.
            </div>
          </div>
          <Button
            onClick={() => downloadReport(state.profile, state.figures, state.classification)}
          >
            <Download />
            Download full PDF report
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
