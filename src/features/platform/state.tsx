import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  demoFigures,
  demoProfile,
  demoDecisions,
  demoTargets,
  demoSystems,
  demoRows,
  type Figures,
  type Profile,
  type Decision,
  type Target,
} from "./model";
export type Session = { path: string; title: string; pinned: boolean; minimized: boolean };
export type StoredState = {
  profile: Profile;
  figures: Figures;
  classification: string;
  decisions: Decision[];
  targets: Target[];
  systems: typeof demoSystems;
  rows: Record<string, string | number>[];
  sessions: Session[];
  dimensionAnswers: Record<string, Record<string, string>>;
  activity: string[];
  role: string;
  widgets: string[];
  savedScenarios: { name: string; growth: number; ingredients: number; payroll: number }[];
  onboardingStep: number;
};
const initial = (): StoredState => ({
  profile: { ...demoProfile },
  figures: { ...demoFigures },
  classification: "Illustrative sample",
  decisions: demoDecisions.map((d) => ({ ...d })),
  targets: demoTargets.map((t) => ({ ...t })),
  systems: demoSystems.map((s) => ({ ...s })),
  rows: demoRows.map((r) => ({ ...r })),
  sessions: [{ path: "/", title: "Command center", pinned: true, minimized: false }],
  dimensionAnswers: {},
  activity: [
    "Monthly sample data refreshed · November 2026",
    "Inventory analysis identified a potential $1,800 monthly opportunity",
    "Cedar House business profile approved",
  ],
  role: "Business owner",
  widgets: ["revenue", "health", "opportunities", "activity"],
  savedScenarios: [],
  onboardingStep: 0,
});
type Store = {
  state: StoredState;
  update: (fn: (s: StoredState) => StoredState) => void;
  reset: () => void;
  log: (text: string) => void;
};
const Context = createContext<Store | null>(null);
export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("axiom-prototype-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredState>;
        setState({ ...initial(), ...parsed });
      }
    } catch {
      /* retain safe sample state */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("axiom-prototype-v1", JSON.stringify(state));
  }, [state, ready]);
  const update = (fn: (s: StoredState) => StoredState) => setState(fn);
  const log = (text: string) =>
    setState((s) => ({ ...s, activity: [text, ...s.activity].slice(0, 40) }));
  return (
    <Context.Provider value={{ state, update, reset: () => setState(initial()), log }}>
      {children}
    </Context.Provider>
  );
}
export function usePlatform() {
  const c = useContext(Context);
  if (!c) throw new Error("Platform provider missing");
  return c;
}
export function canApprove(role: string) {
  return ["Business owner", "CEO", "CFO", "COO"].includes(role);
}
