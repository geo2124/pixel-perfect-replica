import { useState } from "react";
import {
  Plug,
  RefreshCw,
  ArrowRight,
  Check,
  Search,
  Network,
  ShieldCheck,
  ExternalLink,
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
import { PageHeading, Panel, Field, Tag, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function Systems() {
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Connected systems");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [stage, setStage] = useState(0);
  const [method, setMethod] = useState("OAuth");
  const [frequency, setFrequency] = useState("Hourly");
  const selectedSystem = state.systems.find((s) => s.name === selected);
  const connect = () => {
    update((s) => ({
      ...s,
      systems: s.systems.map((v) =>
        v.name === selected ? { ...v, status: "Connected", records: v.records || 128 } : v,
      ),
    }));
    log(`${selected}: simulated connection configured (${frequency})`);
    toast.success("Simulated connection configured");
    setSelected("");
    setStage(0);
  };
  return (
    <div className="page">
      <PageHeading
        title="Systems & integrations"
        subtitle="A governed view of your technology, connectivity and data flows."
        actions={
          <Button size="sm" onClick={() => setTab("Application directory")}>
            <Plug />
            Add connection
          </Button>
        }
      />
      <div className="notice mt-0">
        All connections, sync events and permissions are simulated. No credentials or external data
        are transmitted.
      </div>
      <ModuleTabs
        tabs={["Connected systems", "Application directory", "Architecture map", "Sync history"]}
        value={tab}
        onChange={setTab}
      />
      {["Connected systems", "Application directory"].includes(tab) ? (
        <>
          <div className="flex justify-between mb-5 gap-4">
            <div className="relative max-w-xs flex-1">
              <input
                aria-label="Search applications"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tag>{tab === "Connected systems" ? "3 existing applications" : "6 applications"}</Tag>
          </div>
          <div className="three-grid systems-grid">
            {state.systems
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()) &&
                  (tab === "Application directory" ||
                    ["Connected", "Needs mapping"].includes(s.status)),
              )
              .map((s) => (
                <article className="system-card" key={s.name}>
                  <header>
                    <span className="system-mark">{s.initial}</span>
                    <div>
                      <h3>{s.name}</h3>
                      <p>{s.category}</p>
                    </div>
                  </header>
                  <Tag
                    tone={
                      s.status === "Connected"
                        ? "success"
                        : s.status === "Needs mapping"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {s.status}
                  </Tag>
                  <p className="mt-4">{s.department}</p>
                  <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                    <span className="text-[10px] text-muted-foreground">
                      {s.records.toLocaleString()} sample records
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(s.name);
                        setStage(0);
                      }}
                    >
                      {s.status === "Connected" ? "Manage" : "Configure"}
                      <ArrowRight />
                    </Button>
                  </div>
                </article>
              ))}
          </div>
          <div className="side-note">
            <h3 className="text-xs font-semibold">Right-sized technology recommendations</h3>
            <p className="description mt-2">
              Retain Square and QuickBooks. Connect the inventory spreadsheet before considering
              replacement. Evaluate 7shifts if scheduling savings justify its cost. A full ERP is
              not currently justified for this single-location sample business.
            </p>
          </div>
        </>
      ) : tab === "Architecture map" ? (
        <div className="panel map-canvas">
          <svg className="map-connectors" viewBox="0 0 700 330" preserveAspectRatio="none">
            <path d="M160 80 C260 80 270 165 350 165 M160 250 C260 250 270 165 350 165 M350 165H530" />
          </svg>
          <div className="map-column">
            <div className="map-node">Square POS</div>
            <div className="map-node">QuickBooks</div>
            <div className="map-node">Google Sheets</div>
          </div>
          <div className="map-node map-center">
            <Network />
            Governed data
          </div>
          <div className="map-column">
            <div className="map-node">Analytics</div>
            <div className="map-node">Decision engine</div>
          </div>
        </div>
      ) : (
        <div className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>System</th>
                <th>Last sync</th>
                <th>Records</th>
                <th>Status</th>
                <th>Environment</th>
              </tr>
            </thead>
            <tbody>
              {state.systems
                .filter((s) => s.status === "Connected")
                .map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td>Nov 26, 2026 · 15:00</td>
                    <td>{s.records.toLocaleString()}</td>
                    <td>
                      <Tag tone="success">Simulated success</Tag>
                    </td>
                    <td>Prototype</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Footer />
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected("");
        }}
      >
        <DialogContent className="dialog-large">
          <DialogHeader>
            <DialogTitle>{selected} connection</DialogTitle>
            <DialogDescription>Simulated setup · do not enter real credentials</DialogDescription>
          </DialogHeader>
          <div className="stepper">
            {["Authentication", "Field mapping", "Review"].map((v, i) => (
              <div key={v} className={`step ${i <= stage ? "active" : ""}`}>
                {v}
              </div>
            ))}
          </div>
          {stage === 0 ? (
            <>
              <Field label="Connection method">
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  {["OAuth", "API key", "CSV import", "Webhook"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              {method === "OAuth" ? (
                <div className="notice">
                  <ShieldCheck className="inline size-4 mr-2" />
                  Simulated authorization: read-only access to transactions, products and contacts.
                  No external sign-in is opened.
                </div>
              ) : (
                <Field label={`${method} configuration (mock only)`}>
                  <input
                    placeholder={
                      method === "API key" ? "demo_key_placeholder" : "Demo endpoint or filename"
                    }
                    readOnly
                    value={
                      method === "API key" ? "demo_key_placeholder" : "https://example.invalid/demo"
                    }
                  />
                </Field>
              )}
              <Field label="Sync frequency">
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  {["Hourly", "Daily", "Weekly", "Manual only"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
            </>
          ) : stage === 1 ? (
            <>
              <h3 className="font-semibold text-sm">Map source fields</h3>
              {[
                ["Transaction date", "date"],
                ["Total amount", "revenue"],
                ["Item identifier", "product_id"],
              ].map(([label, key]) => (
                <div key={label} className="form-grid items-center">
                  <span className="text-xs py-3">{label}</span>
                  <select aria-label={`Map ${label}`} defaultValue={key}>
                    {["date", "revenue", "product_id", "Ignore field"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
              <Field label="Data access">
                <select defaultValue="Read only">
                  <option>Read only</option>
                  <option>Read & write (mock)</option>
                </select>
              </Field>
            </>
          ) : (
            <>
              <div className="settings-line">
                <span>Application</span>
                <strong>{selected}</strong>
              </div>
              <div className="settings-line">
                <span>Method</span>
                <strong>{method} · simulated</strong>
              </div>
              <div className="settings-line">
                <span>Frequency</span>
                <strong>{frequency}</strong>
              </div>
              <div className="notice">
                Sample fields mapped. No live connection will be created.
              </div>
            </>
          )}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => (stage ? setStage(stage - 1) : setSelected(""))}
            >
              {stage ? "Back" : "Cancel"}
            </Button>
            {stage < 2 ? (
              <Button onClick={() => setStage(stage + 1)}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button onClick={connect}>
                <Check />
                Confirm simulated connection
              </Button>
            )}
          </div>
          {selectedSystem?.status === "Connected" && (
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                update((s) => ({
                  ...s,
                  systems: s.systems.map((v) =>
                    v.name === selected ? { ...v, status: "Under evaluation" } : v,
                  ),
                }));
                log(`${selected}: simulated connection disconnected`);
                setSelected("");
              }}
            >
              Disconnect sample connection
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
