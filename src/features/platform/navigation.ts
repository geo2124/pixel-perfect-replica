import {
  LayoutDashboard,
  Network,
  Building2,
  HeartPulse,
  Plug,
  FlaskConical,
  Target,
  FileText,
  Database,
  BookOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";
export const modules: {
  path:
    | "/"
    | "/intelligence"
    | "/business"
    | "/architecture"
    | "/assessment"
    | "/systems"
    | "/lab"
    | "/strategy"
    | "/decisions"
    | "/data"
    | "/knowledge"
    | "/settings";
  title: string;
  icon: LucideIcon;
  group: string;
}[] = [
  { path: "/", title: "Command center", icon: LayoutDashboard, group: "WORKSPACE" },
  { path: "/intelligence", title: "Business intelligence", icon: Network, group: "WORKSPACE" },
  { path: "/business", title: "Business definition", icon: Building2, group: "WORKSPACE" },
  { path: "/architecture", title: "Business architecture", icon: Network, group: "WORKSPACE" },
  { path: "/assessment", title: "Health assessment", icon: HeartPulse, group: "WORKSPACE" },
  { path: "/systems", title: "Systems & integrations", icon: Plug, group: "INTELLIGENCE" },
  { path: "/lab", title: "Research & optimization", icon: FlaskConical, group: "INTELLIGENCE" },
  { path: "/strategy", title: "Strategy & targets", icon: Target, group: "INTELLIGENCE" },
  { path: "/decisions", title: "Reports & decisions", icon: FileText, group: "INTELLIGENCE" },
  { path: "/data", title: "Data management", icon: Database, group: "MANAGEMENT" },
  { path: "/knowledge", title: "Knowledge repository", icon: BookOpen, group: "MANAGEMENT" },
  { path: "/settings", title: "Workspace settings", icon: Settings, group: "MANAGEMENT" },
];
