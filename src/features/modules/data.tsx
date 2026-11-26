import { useRef, useState } from "react";
import {
  Upload,
  Download,
  Database,
  Search,
  Check,
  Eye,
  RefreshCw,
  Pencil,
  FileSpreadsheet,
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
import { demoRows } from "../platform/model";
import { downloadCSV } from "../platform/report";
import { PageHeading, Tag, Kpi, Field, ModuleTabs, Footer } from "../platform/common";
import { Inspector } from "../platform/shell";
import { toast } from "sonner";
export function DataManagement() {
  const { state, update, log } = usePlatform();
  const fileInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Datasets");
  const [preview, setPreview] = useState<Record<string, string | number>[]>([]);
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [inspect, setInspect] = useState<Record<string, string | number> | null>(null);
  const [editing, setEditing] = useState(false);
  const columns = Object.keys(state.rows[0] ?? {});
  const rows = state.rows.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())),
  );
  const duplicateCount = state.rows.length - new Set(state.rows.map((r) => JSON.stringify(r))).size;
  const emptyCount = state.rows.reduce(
    (sum, r) => sum + Object.values(r).filter((v) => v === "").length,
    0,
  );
  async function importFile(file: File) {
    try {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Choose a file smaller than 10 MB");
        return;
      }
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const first = workbook.SheetNames[0];
      const sheet = first ? workbook.Sheets[first] : undefined;
      if (!sheet) {
        toast.error("No readable worksheet found");
        return;
      }
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const clean = raw
        .slice(0, 5000)
        .map((r) =>
          Object.fromEntries(
            Object.entries(r).map(([k, v]) => [k, typeof v === "number" ? v : String(v ?? "")]),
          ),
        );
      if (!clean.length) {
        toast.error("The file has no data rows");
        return;
      }
      setPreview(clean);
      setMapping(Object.fromEntries(Object.keys(clean[0] ?? {}).map((c) => [c, c])));
      setFileName(file.name);
    } catch {
      toast.error("Could not read this spreadsheet. Try a CSV or XLSX file.");
    }
  }
  return (
    <div className="page">
      <PageHeading
        title="Data management"
        subtitle="Inspect, classify and validate the information behind your business model."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(state.rows)}>
              <Download />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => fileInput.current?.click()}>
              <Upload />
              Import dataset
            </Button>
          </>
        }
      />
      <input
        className="hidden"
        ref={fileInput}
        type="file"
        accept=".csv,.xlsx,.xls"
        aria-label="Import dataset file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void importFile(file);
          e.target.value = "";
        }}
      />
      <div className="kpi-grid">
        <Kpi
          label="Dataset rows"
          value={state.rows.length.toLocaleString()}
          caption="Active menu / imported dataset"
        />
        <Kpi label="Duplicate rows" value={String(duplicateCount)} caption="Exact-row comparison" />
        <Kpi label="Missing cells" value={String(emptyCount)} caption="Empty values, not zeros" />
        <Kpi
          label="Source classification"
          value={state.classification === "Illustrative sample" ? "Sample" : "User input"}
          caption="Requires independent validation"
        />
      </div>
      <ModuleTabs
        tabs={["Datasets", "Quality review", "Import history"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Datasets" ? (
        <>
          <div className="section-header">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-primary" />
              <h2>Menu performance dataset</h2>
              <Tag>v3 · sample subset</Tag>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                <Pencil />
                {editing ? "Done editing" : "Edit cells"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  update((s) => ({ ...s, rows: demoRows.map((r) => ({ ...r })) }));
                  toast.success("Sample menu dataset loaded");
                }}
              >
                <RefreshCw />
                Sample
              </Button>
            </div>
          </div>
          <div className="max-w-xs mb-4">
            <input
              aria-label="Search dataset"
              placeholder="Filter rows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="panel table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th className="capitalize" key={c}>
                      {c}
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c}>
                        {editing ? (
                          <input
                            aria-label={`Edit ${c} row ${i + 1}`}
                            className="min-w-24"
                            value={r[c] ?? ""}
                            onChange={(e) => {
                              const oldIndex = state.rows.indexOf(r);
                              const value =
                                typeof r[c] === "number" && e.target.value !== ""
                                  ? Number(e.target.value)
                                  : e.target.value;
                              update((s) => ({
                                ...s,
                                rows: s.rows.map((row, index) =>
                                  index === oldIndex ? { ...row, [c]: value } : row,
                                ),
                              }));
                            }}
                          />
                        ) : (
                          String(r[c] ?? "")
                        )}
                      </td>
                    ))}
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        title={`Inspect row ${i + 1}`}
                        onClick={() => setInspect(r)}
                      >
                        <Eye className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            Menu rows are a sample product subset, not the complete sales ledger. Their totals must
            not be interpreted as total restaurant revenue.
          </div>
        </>
      ) : tab === "Quality review" ? (
        <>
          <h2 className="section-title">Data validation summary</h2>
          <div className="three-grid">
            {[
              [
                "Duplicates",
                `${duplicateCount} exact duplicate rows. Review before removing records.`,
              ],
              [
                "Missing information",
                `${emptyCount} empty cells. Unavailable values are not imputed as zero.`,
              ],
              [
                "Source validation",
                "Imported or sample data is not independently verified. Review units, dates and currency before analysis.",
              ],
            ].map(([t, b]) => (
              <article className="dimension-card" key={t}>
                <h3>{t}</h3>
                <p className="description mt-3">{b}</p>
              </article>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              update((s) => ({
                ...s,
                rows: s.rows.filter(
                  (r, i, all) =>
                    all.findIndex((a) => JSON.stringify(a) === JSON.stringify(r)) === i,
                ),
              }));
              log("Dataset exact duplicates removed after manual review");
              toast.success("Exact duplicate rows removed");
            }}
          >
            <Check />
            Remove exact duplicates
          </Button>
        </>
      ) : (
        <div className="panel">
          {state.activity.filter((a) => a.toLowerCase().includes("dataset") || a.includes("import"))
            .length ? (
            state.activity
              .filter((a) => a.toLowerCase().includes("dataset") || a.includes("import"))
              .map((a, i) => (
                <div className="list-row" key={i}>
                  <Database className="size-4 text-primary" />
                  <p>{a}</p>
                </div>
              ))
          ) : (
            <div className="panel-body description">
              No user imports yet. Sample dataset v3 is available.
            </div>
          )}
        </div>
      )}
      <Footer />
      <Dialog
        open={preview.length > 0}
        onOpenChange={(v) => {
          if (!v) setPreview([]);
        }}
      >
        <DialogContent className="dialog-large">
          <DialogHeader>
            <DialogTitle>Review dataset import</DialogTitle>
            <DialogDescription>
              {fileName} · {preview.length} rows · first worksheet · capped at 5,000 rows
            </DialogDescription>
          </DialogHeader>
          <div className="form-grid">
            {Object.keys(preview[0] ?? {}).map((c) => (
              <Field label={`Map “${c}” to`} key={c}>
                <input
                  aria-label={`Column mapping ${c}`}
                  value={mapping[c] ?? c}
                  onChange={(e) => setMapping((m) => ({ ...m, [c]: e.target.value }))}
                />
              </Field>
            ))}
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(preview[0] ?? {}).map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 4).map((r, i) => (
                  <tr key={i}>
                    {Object.values(r).map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            This replaces the active dataset only; it does not alter your financial baseline. Review
            currency, units and field names.
          </div>
          <Button
            onClick={() => {
              const names = Object.values(mapping);
              if (names.some((n) => !n.trim()) || new Set(names).size !== names.length) {
                toast.error("Column names must be unique and non-empty");
                return;
              }
              update((s) => ({
                ...s,
                rows: preview.map((r) =>
                  Object.fromEntries(Object.entries(r).map(([k, v]) => [mapping[k] ?? k, v])),
                ),
              }));
              log(`Dataset imported: ${fileName} (${preview.length} rows, user-provided)`);
              setPreview([]);
              toast.success("Dataset imported into this browser");
            }}
          >
            <Check />
            Approve import
          </Button>
        </DialogContent>
      </Dialog>
      {inspect && (
        <Inspector title="Data record inspector" onClose={() => setInspect(null)}>
          <Tag>Requires validation</Tag>
          {Object.entries(inspect).map(([k, v]) => (
            <div className="settings-line py-3" key={k}>
              <span className="capitalize text-muted-foreground">{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
          <p className="description mt-4">Active dataset · local prototype record</p>
        </Inspector>
      )}
    </div>
  );
}
