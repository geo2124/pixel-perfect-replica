import { useState } from "react";
import {
  BookOpen,
  Plus,
  Check,
  Shield,
  Users,
  RotateCcw,
  Settings,
  Search,
  FileText,
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
import { PageHeading, Tag, Field, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Knowledge() {
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Business facts");
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState("");
  const [classification, setClassification] = useState("User-provided figure");
  const [search, setSearch] = useState("");
  const entries = Object.entries(state.dimensionAnswers["knowledge"] ?? {});
  return (
    <div className="page">
      <PageHeading
        title="Business knowledge repository"
        subtitle="An explicit record of what is known, assumed and still awaiting validation."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus />
            Add information
          </Button>
        }
      />
      <ModuleTabs
        tabs={["Business facts", "Assumptions", "Decisions & outcomes", "Knowledge history"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Business facts" ? (
        <>
          <input
            className="max-w-sm mb-5"
            aria-label="Search knowledge"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter facts..."
          />
          <div className="panel">
            {[
              [
                "Business identity",
                `${state.profile.name} · ${state.profile.model}`,
                state.profile.approved ? "Approved concept" : "Requires review",
              ],
              [
                "Employee headcount",
                `${state.figures["employees"] ?? "Unavailable"} employees`,
                state.classification,
              ],
              ["Management objective", state.profile.objective, "Management-approved sample"],
              ...entries.map(([k, v]) => [k, v, "User-recorded information"]),
            ]
              .filter((r) => r.join(" ").toLowerCase().includes(search.toLowerCase()))
              .map(([k, v, c]) => (
                <div className="list-row" key={k}>
                  <BookOpen className="size-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <h3>{k}</h3>
                    <p>{v}</p>
                  </div>
                  <Tag>{c}</Tag>
                </div>
              ))}
          </div>
        </>
      ) : tab === "Assumptions" ? (
        <div className="three-grid">
          {state.decisions.map((d) => (
            <article className="dimension-card" key={d.id}>
              <Tag tone="warning">Requires validation</Tag>
              <h3>
                {d.id} / {d.pillar}
              </h3>
              <p className="description mt-3">{d.assumption}</p>
              <p className="text-[10px] text-muted-foreground mt-4">Affected analysis: {d.title}</p>
            </article>
          ))}
        </div>
      ) : tab === "Decisions & outcomes" ? (
        <div className="panel">
          {state.decisions.map((d) => (
            <div className="list-row" key={d.id}>
              <Check className="size-4 text-success" />
              <div className="flex-1">
                <h3>{d.title}</h3>
                <p>{d.status} · Actual financial outcome not yet measured</p>
              </div>
              <Tag>Sample evidence</Tag>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel">
          {state.activity.map((a, i) => (
            <div className="list-row" key={i}>
              <FileText className="size-4 text-muted-foreground" />
              <div>
                <h3>{a}</h3>
                <p>Review required before incorporating into a production business model</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="notice">
        New information is not automatically treated as correct. Classification, supporting evidence
        and management validation are required before changing downstream models.
      </div>
      <Footer />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add business information</DialogTitle>
            <DialogDescription>Record a fact or assumption for review</DialogDescription>
          </DialogHeader>
          <Field label="Information">
            <textarea
              aria-label="Business information"
              rows={4}
              value={fact}
              onChange={(e) => setFact(e.target.value)}
            />
          </Field>
          <Field label="Classification">
            <select value={classification} onChange={(e) => setClassification(e.target.value)}>
              {[
                "User-provided figure",
                "Estimated figure",
                "Assumption",
                "Requires validation",
                "Not available",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Button
            onClick={() => {
              if (!fact.trim()) {
                toast.error("Enter the information to record");
                return;
              }
              update((s) => ({
                ...s,
                dimensionAnswers: {
                  ...s.dimensionAnswers,
                  knowledge: {
                    ...s.dimensionAnswers["knowledge"],
                    [`Record ${Date.now()}`]: `${fact} · ${classification}`,
                  },
                },
              }));
              log(`Knowledge record added for review (${classification})`);
              setOpen(false);
              setFact("");
              toast.success("Information recorded for review");
            }}
          >
            <Check />
            Record for review
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function WorkspaceSettings() {
  const { state, update, reset, log } = usePlatform();
  const [tab, setTab] = useState("Workspace");
  const [confirm, setConfirm] = useState(false);
  const roles = [
    "Business owner",
    "CEO",
    "CFO",
    "COO",
    "Department manager",
    "Financial analyst",
    "Operations analyst",
    "IT administrator",
    "External consultant",
  ];
  return (
    <div className="page">
      <PageHeading
        title="Workspace settings"
        subtitle="Manage your demonstration workspace, interface role and local data."
      />
      <ModuleTabs
        tabs={["Workspace", "Users & roles", "Permissions", "Activity"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Workspace" ? (
        <>
          <div className="max-w-2xl">
            <div className="settings-line">
              <div>
                <h3 className="font-semibold">Business workspace</h3>
                <p className="description">
                  {state.profile.name} · {state.profile.industry}
                </p>
              </div>
              <Tag tone="blue">Local prototype</Tag>
            </div>
            <div className="settings-line">
              <div>
                <h3 className="font-semibold">Data storage</h3>
                <p className="description">
                  Saved to this browser. Not shared between devices or users.
                </p>
              </div>
              <Tag>Browser only</Tag>
            </div>
            <div className="settings-line">
              <div>
                <h3 className="font-semibold">Reset demonstration</h3>
                <p className="description">
                  Restore Cedar House and remove user-entered local changes.
                </p>
              </div>
              <Button variant="outline" onClick={() => setConfirm(true)}>
                <RotateCcw />
                Reset demo
              </Button>
            </div>
          </div>
        </>
      ) : tab === "Users & roles" ? (
        <>
          <div className="two-column">
            <section>
              <h2 className="section-title">Preview an interface role</h2>
              <p className="description mb-5">
                Role selection changes available decision actions. It is not a sign-in or a security
                boundary.
              </p>
              <Field label="Current demonstration role">
                <select
                  aria-label="Demonstration role"
                  value={state.role}
                  onChange={(e) => {
                    update((s) => ({ ...s, role: e.target.value }));
                    log(`Interface role preview changed to ${e.target.value}`);
                  }}
                >
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </section>
            <div className="side-note">
              <h3 className="font-semibold">Khaled Ayoubi</h3>
              <p className="description mt-2">
                {state.role}
                <br />
                Sample workspace member · no production account connected
              </p>
              <Tag tone={canApprove(state.role) ? "success" : "neutral"}>
                {canApprove(state.role) ? "Simulated approver" : "Review & analysis"}
              </Tag>
            </div>
          </div>
        </>
      ) : tab === "Permissions" ? (
        <>
          <div className="panel table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Interface role</th>
                  <th>View analytics</th>
                  <th>Request analysis</th>
                  <th>Approve decisions</th>
                  <th>Manage data</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r}>
                    <td>{r}</td>
                    <td>
                      <Check className="size-3 text-success" />
                    </td>
                    <td>
                      <Check className="size-3 text-success" />
                    </td>
                    <td>{canApprove(r) ? "Simulated approval" : "Disabled in UI"}</td>
                    <td>Prototype access</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            No sensitive production data is present. A production implementation must enforce
            authenticated roles on the server, never through browser storage.
          </div>
        </>
      ) : (
        <div className="panel">
          {state.activity.map((a, i) => (
            <div className="list-row" key={i}>
              <Settings className="size-4 text-muted-foreground" />
              <p className="text-xs">{a}</p>
            </div>
          ))}
        </div>
      )}
      <Footer />
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset demonstration data?</DialogTitle>
            <DialogDescription>
              This removes local edits, saved scenarios, targets and imported rows and restores the
              Cedar House sample.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                reset();
                setConfirm(false);
                toast.success("Cedar House sample restored");
              }}
            >
              <RotateCcw />
              Reset demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
