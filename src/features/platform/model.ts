export type Figures = Record<string, number | null>;
export const demoFigures: Figures = {
  revenue: 75000,
  ingredients: 24000,
  salaries: 21000,
  rent: 6000,
  utilities: 3000,
  marketing: 2000,
  delivery: 4000,
  other: 10500,
  cash: 42000,
  debt: 18000,
  employees: 22,
  customers: 2500,
  inventory: 12500,
};
export const figureLabels: Record<string, string> = {
  revenue: "Monthly revenue",
  ingredients: "Ingredient / direct costs",
  salaries: "Salaries & benefits",
  rent: "Rent",
  utilities: "Utilities",
  marketing: "Marketing",
  delivery: "Delivery commissions",
  other: "Other operating expenses",
  cash: "Cash available",
  debt: "Outstanding debt",
  employees: "Employees",
  customers: "Monthly transactions",
  inventory: "Inventory value",
};
export const costKeys = [
  "ingredients",
  "salaries",
  "rent",
  "utilities",
  "marketing",
  "delivery",
  "other",
];
export const money = (n: number | null | undefined, digits = 0) =>
  n == null
    ? "Not available"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: digits,
      }).format(n);
export function financials(f: Figures) {
  const revenue = f["revenue"];
  const complete = revenue != null && revenue > 0 && costKeys.every((k) => f[k] != null);
  const expenses = complete ? costKeys.reduce((s, k) => s + (f[k] ?? 0), 0) : null;
  const profit = expenses != null && revenue != null ? revenue - expenses : null;
  const gross =
    revenue != null && revenue > 0 && f["ingredients"] != null
      ? ((revenue - f["ingredients"]) / revenue) * 100
      : null;
  const margin = profit != null && revenue != null && revenue > 0 ? (profit / revenue) * 100 : null;
  const variable =
    f["ingredients"] != null && f["delivery"] != null ? f["ingredients"] + f["delivery"] : null;
  const fixed = expenses != null && variable != null ? expenses - variable : null;
  const contribution =
    revenue != null && revenue > 0 && variable != null ? 1 - variable / revenue : null;
  const breakEven =
    fixed != null && contribution != null && contribution > 0 ? fixed / contribution : null;
  const cashMonths = f["cash"] != null && fixed != null && fixed > 0 ? f["cash"] / fixed : null;
  const score =
    margin != null && gross != null && cashMonths != null
      ? Math.round(
          Math.min(40, Math.max(0, (margin / 10) * 40)) +
            Math.min(30, Math.max(0, (gross / 70) * 30)) +
            Math.min(30, (cashMonths / 1.5) * 30),
        )
      : null;
  return {
    expenses,
    profit,
    gross,
    margin,
    fixed,
    contribution,
    breakEven,
    cashMonths,
    score,
    coverage: Math.round(
      (Object.values(f).filter((v) => v != null).length / Object.keys(figureLabels).length) * 100,
    ),
  };
}
export const dimensions = [
  {
    slug: "financial",
    name: "Financial management",
    short: "Finance",
    completeness: 92,
    status: "Attention needed",
    metric: "Operating margin",
    value: "6.0%",
    fields: ["Budgeting & reporting process", "Tax obligations", "Working capital policy"],
  },
  {
    slug: "sales",
    name: "Sales & revenue",
    short: "Sales",
    completeness: 88,
    status: "Healthy",
    metric: "Average transaction",
    value: "$30",
    fields: ["Sales channels", "Pricing & discount policy", "Customer acquisition process"],
  },
  {
    slug: "marketing",
    name: "Marketing & market position",
    short: "Marketing",
    completeness: 64,
    status: "Data gaps",
    metric: "Monthly spend",
    value: "$2,000",
    fields: ["Marketing channels", "Attribution method", "Competitive positioning"],
  },
  {
    slug: "operations",
    name: "Operations & processes",
    short: "Operations",
    completeness: 85,
    status: "Attention needed",
    metric: "Service time",
    value: "18 min",
    fields: ["Daily operating workflows", "Capacity & bottlenecks", "Quality assurance process"],
  },
  {
    slug: "procurement",
    name: "Procurement & suppliers",
    short: "Procurement",
    completeness: 82,
    status: "Healthy",
    metric: "On-time delivery",
    value: "94%",
    fields: ["Supplier concentration", "Payment terms", "Alternative suppliers"],
  },
  {
    slug: "inventory",
    name: "Inventory & assets",
    short: "Inventory",
    completeness: 76,
    status: "Attention needed",
    metric: "Inventory value",
    value: "$12,500",
    fields: ["Reorder policy", "Expiry & waste tracking", "Equipment maintenance"],
  },
  {
    slug: "people",
    name: "Human resources",
    short: "People",
    completeness: 91,
    status: "Healthy",
    metric: "Team members",
    value: "22",
    fields: ["Organization & departments", "Workforce scheduling", "Skills & training"],
  },
  {
    slug: "customers",
    name: "Customer intelligence",
    short: "Customers",
    completeness: 68,
    status: "Data gaps",
    metric: "Repeat customers",
    value: "42%",
    fields: ["Customer segments", "Retention measurement", "Feedback & complaints"],
  },
  {
    slug: "strategy",
    name: "Strategy & development",
    short: "Strategy",
    completeness: 80,
    status: "Healthy",
    metric: "Active objectives",
    value: "3",
    fields: ["Growth priorities", "Expansion constraints", "Competitive advantage"],
  },
  {
    slug: "risk",
    name: "Risk & compliance",
    short: "Risk",
    completeness: 72,
    status: "Attention needed",
    metric: "Open risks",
    value: "4",
    fields: ["Regulatory obligations", "Business continuity", "Insurance & controls"],
  },
  {
    slug: "forecasting",
    name: "Forecasting & planning",
    short: "Forecasting",
    completeness: 65,
    status: "Data gaps",
    metric: "Planning horizon",
    value: "6 months",
    fields: ["Seasonality assumptions", "Forecast validation", "Planning horizon"],
  },
  {
    slug: "optimization",
    name: "Optimization & allocation",
    short: "Optimization",
    completeness: 78,
    status: "Healthy",
    metric: "Opportunities",
    value: "6",
    fields: ["Resource constraints", "Decision approval process", "Optimization objectives"],
  },
];
export const revenueHistory = [
  { month: "Jun", revenue: 61800, profit: 2900, target: 66000 },
  { month: "Jul", revenue: 65200, profit: 3300, target: 68000 },
  { month: "Aug", revenue: 63800, profit: 2600, target: 70000 },
  { month: "Sep", revenue: 70200, profit: 3900, target: 72000 },
  { month: "Oct", revenue: 68400, profit: 3500, target: 74000 },
  { month: "Nov", revenue: 75000, profit: 4500, target: 76000 },
];
export type Decision = {
  id: string;
  title: string;
  pillar: string;
  impact: number;
  confidence: number;
  risk: string;
  status: string;
  evidence: string;
  action: string;
  assumption: string;
  method: string;
  cost: number;
};
export const demoDecisions: Decision[] = [
  {
    id: "D-024",
    title: "Reduce ingredient waste with demand-led ordering",
    pillar: "Inventory",
    impact: 1800,
    confidence: 82,
    risk: "Low",
    status: "Pending review",
    evidence:
      "Illustrative purchase ledger v3: $24,000 monthly ingredient spend; waste logs indicate 10% avoidable loss.",
    action:
      "Pilot daily par levels for the 12 highest-waste ingredients, then review after four weeks.",
    assumption: "75% of the estimated $2,400 waste can be avoided without reducing quality.",
    method: "$24,000 × 10% estimated waste × 75% recovery = $1,800/month.",
    cost: 450,
  },
  {
    id: "D-023",
    title: "Align weekday staffing with service demand",
    pillar: "Operations",
    impact: 1050,
    confidence: 76,
    risk: "Medium",
    status: "Pending review",
    evidence:
      "Illustrative roster v2 and hourly POS demand show excess coverage on Tuesday and Wednesday.",
    action: "Trial staggered shifts while preserving the minimum of four staff per service period.",
    assumption: "5% of payroll is recoverable through shift alignment; no redundancies assumed.",
    method: "$21,000 monthly payroll × 5% = $1,050/month.",
    cost: 200,
  },
  {
    id: "D-022",
    title: "Shift repeat delivery orders to direct ordering",
    pillar: "Sales",
    impact: 600,
    confidence: 71,
    risk: "Medium",
    status: "In progress",
    evidence: "Illustrative monthly delivery commission expense is $4,000.",
    action: "Introduce a direct-order incentive for existing customers, subject to platform terms.",
    assumption: "15% net commission reduction after incentives; demand remains stable.",
    method: "$4,000 commissions × 15% net savings = $600/month.",
    cost: 300,
  },
];
export const demoSystems = [
  {
    name: "Square POS",
    category: "Point of sale",
    initial: "S",
    status: "Connected",
    records: 12540,
    department: "Sales & operations",
  },
  {
    name: "QuickBooks",
    category: "Accounting",
    initial: "qb",
    status: "Connected",
    records: 3842,
    department: "Finance",
  },
  {
    name: "Google Sheets",
    category: "Inventory & planning",
    initial: "G",
    status: "Needs mapping",
    records: 428,
    department: "Procurement",
  },
  {
    name: "7shifts",
    category: "Workforce scheduling",
    initial: "7",
    status: "Recommended",
    records: 0,
    department: "Human resources",
  },
  {
    name: "HubSpot",
    category: "Customer relationship",
    initial: "H",
    status: "Under evaluation",
    records: 0,
    department: "Marketing",
  },
  {
    name: "Odoo",
    category: "ERP & inventory",
    initial: "O",
    status: "Under evaluation",
    records: 0,
    department: "Operations",
  },
];
export const demoRows: Record<string, string | number>[] = [
  { item: "Grilled chicken plate", category: "Main course", units: 520, price: 24, cost: 7.2 },
  { item: "Cedar mezze platter", category: "Starter", units: 410, price: 18, cost: 5.4 },
  { item: "Lamb kofta", category: "Main course", units: 380, price: 28, cost: 9.1 },
  { item: "Seasonal salad", category: "Starter", units: 460, price: 14, cost: 3.8 },
  { item: "Sea bass", category: "Main course", units: 260, price: 32, cost: 12.4 },
  { item: "Pistachio dessert", category: "Dessert", units: 470, price: 10, cost: 2.8 },
];
export type Profile = {
  name: string;
  industry: string;
  model: string;
  stage: string;
  market: string;
  vision: string;
  objective: string;
  constraints: string;
  approved: boolean;
};
export const demoProfile: Profile = {
  name: "Cedar House",
  industry: "Restaurant",
  model: "Casual dining",
  stage: "Operating business",
  market: "Austin, Texas",
  vision: "A neighborhood restaurant built around seasonal Mediterranean food.",
  objective: "Improve operating margin to 12% without compromising guest experience.",
  constraints: "Preserve food quality; retain 22 employees; $10,000 investment budget.",
  approved: true,
};
export type Target = {
  id: string;
  title: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  budget: number;
};
export const demoTargets: Target[] = [
  {
    id: "T-01",
    title: "Improve operating margin",
    baseline: 6,
    target: 12,
    current: 6,
    unit: "%",
    deadline: "2027-06-30",
    budget: 10000,
  },
  {
    id: "T-02",
    title: "Grow monthly revenue",
    baseline: 60000,
    target: 90000,
    current: 75000,
    unit: "USD",
    deadline: "2027-06-30",
    budget: 15000,
  },
  {
    id: "T-03",
    title: "Reduce ingredient waste",
    baseline: 10,
    target: 5,
    current: 8,
    unit: "%",
    deadline: "2027-03-31",
    budget: 2500,
  },
];
export function scenario(
  f: Figures,
  growth: number,
  ingredientSaving: number,
  payrollSaving: number,
) {
  const base = financials(f);
  if (
    base.profit == null ||
    f["revenue"] == null ||
    f["ingredients"] == null ||
    f["salaries"] == null ||
    f["delivery"] == null ||
    base.fixed == null
  )
    return null;
  const revenue = f["revenue"] * (1 + growth / 100);
  const ingredients = f["ingredients"] * (1 + growth / 100) * (1 - ingredientSaving / 100);
  const delivery = f["delivery"] * (1 + growth / 100);
  const savings = (f["salaries"] * payrollSaving) / 100;
  const profit = revenue - ingredients - delivery - (base.fixed - savings);
  return { revenue, profit, margin: (profit / revenue) * 100, improvement: profit - base.profit };
}
