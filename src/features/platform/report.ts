import { financials, money, type Figures, type Profile } from "./model";
export async function downloadReport(profile: Profile, figures: Figures, classification: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const f = financials(figures);
  let y = 25;
  const line = (text: string, size = 11) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 170) as string[];
    if (y + lines.length * 6 > 275) {
      doc.addPage();
      y = 25;
    }
    doc.text(lines, 20, y);
    y += lines.length * 6 + 4;
  };
  doc.setFont("helvetica", "bold");
  line("AXIOM / MANAGEMENT INTELLIGENCE", 10);
  line(`${profile.name} — Business Health Report`, 23);
  doc.setFont("helvetica", "normal");
  line(`November 2026 | Version 1.0 | ${classification} | Frontend prototype`, 10);
  const sections = [
    [
      "01 Executive summary",
      `Monthly revenue ${money(figures["revenue"])}; operating profit ${money(f.profit)}; margin ${f.margin?.toFixed(1) ?? "Not available"}%. Results are preliminary, not forecasts or guarantees.`,
    ],
    [
      "02 Business profile",
      `${profile.industry} / ${profile.model}. Market: ${profile.market}. Stage: ${profile.stage}. Objective: ${profile.objective}`,
    ],
    [
      "03 Data availability & limitations",
      `${f.coverage}% field coverage. Source classification: ${classification}. Missing values are excluded, never treated as zero. Customer retention, taxes, loan terms and industry benchmarks are not validated.`,
    ],
    [
      "04 Financial assessment",
      `Gross margin: ${f.gross?.toFixed(1) ?? "Not available"}%. Monthly operating expenses: ${money(f.expenses)}. Estimated break-even revenue: ${money(f.breakEven)}. Cash: ${money(figures["cash"])}. Debt: ${money(figures["debt"])}. Net margin unavailable without tax and financing data.`,
    ],
    [
      "05 Operational assessment",
      "Illustrative service time 18 minutes. Sample roster: 22 employees. Ingredient waste requires validation. Kitchen throughput and guest satisfaction must be monitored before changing capacity.",
    ],
    [
      "06 Financial health methodology",
      `Score: ${f.score ?? "Insufficient data"}/100. Operating margin capped at 40 points at 10%; gross margin capped at 30 points at 70%; cash / fixed monthly costs capped at 30 points at 1.5 months. This heuristic is not an overall business score or industry-certified benchmark.`,
    ],
    [
      "07 Strengths & weaknesses",
      "Sample gross margin is positive; operating margin leaves limited headroom. Cash coverage is below the illustrative 1.5-month threshold. Forecast accuracy and customer profitability lack validated data.",
    ],
    [
      "08 Critical problems",
      "Validate ingredient waste, weekday staff utilization, and supplier concentration. None is treated as a verified finding on fictional data.",
    ],
    [
      "09 Opportunities & financial leaks",
      "Sample ingredient opportunity: $24,000 × 10% waste assumption × 75% recovery = $1,800/month; staffing: $21,000 × 5% = $1,050/month; delivery: $4,000 × 15% = $600/month. These are illustrative, potentially overlapping estimates, not guaranteed savings.",
    ],
    [
      "10 Systems recommendations",
      "Retain existing POS and accounting tools. Map inventory spreadsheets before evaluating replacement software. All displayed connections are simulated.",
    ],
    [
      "11 R&D requirements",
      "Validate daily demand patterns, ingredient yield, service quality and scheduling constraints. No model is trained on real customer data.",
    ],
    [
      "12 Recommended actions",
      "Run a four-week ordering pilot; establish a daily waste log; review shift coverage with the operations manager; approve budgets before implementation.",
    ],
    [
      "13 Potential impact",
      "Evaluate each intervention against its baseline and implementation cost. Do not sum opportunity estimates without checking overlap and capacity constraints.",
    ],
    [
      "14 Risks & assumptions",
      `Preserve guest experience and staffing minima. Constraints: ${profile.constraints}. Demand, supplier prices and execution may differ from modeled assumptions.`,
    ],
    [
      "15 Next steps",
      "Validate data sources, approve assumptions, agree owners and milestones, then compare measured outcomes against the baseline. Management approval remains required.",
    ],
  ];
  for (const [title, body] of sections) {
    if (!title || !body) continue;
    doc.setFont("helvetica", "bold");
    line(title, 13);
    doc.setFont("helvetica", "normal");
    line(body);
  }
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(9);
    doc.text(`${profile.name} | Confidential | Illustrative prototype`, 20, 288);
    doc.text(`${p} / ${pages}`, 180, 288);
  }
  doc.save(`${profile.name.replace(/[^a-z0-9]/gi, "-")}-health-report.pdf`);
}
export function downloadCSV(rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0] ?? {});
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    columns.map(escape).join(","),
    ...rows.map((r) => columns.map((c) => escape(r[c] ?? "")).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "axiom-analysis.csv";
  a.click();
  URL.revokeObjectURL(url);
}
