import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Menu,
  X,
  Plus,
  Pin,
  Minus,
  Maximize2,
  PanelsTopLeft,
  HelpCircle,
  ArrowUpRight,
  Home,
  Command,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { modules } from "./navigation";
import { usePlatform } from "./state";
import { Tag } from "./common";
import { money, financials } from "./model";
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { state, update } = usePlatform();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [command, setCommand] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [sessions, setSessions] = useState(false);
  const [split, setSplit] = useState(false);
  const [help, setHelp] = useState(false);
  const path = location.pathname;
  const current = modules.find((m) => m.path === path);
  const title = current?.title ?? "Dimension analysis";
  useEffect(() => {
    update((s) =>
      s.sessions.some((w) => w.path === path)
        ? {
            ...s,
            sessions: s.sessions.map((w) => (w.path === path ? { ...w, minimized: false } : w)),
          }
        : { ...s, sessions: [...s.sessions, { path, title, pinned: false, minimized: false }] },
    );
    setMobile(false);
  }, [path, title]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const go = (p: string) => {
    const module = modules.find((m) => m.path === p);
    if (module) navigate({ to: module.path });
    else if (p.startsWith("/dimensions/"))
      navigate({ to: "/dimensions/$pillar", params: { pillar: p.split("/")[2] ?? "financial" } });
    setCommand(false);
    setSessions(false);
  };
  const close = (p: string) => {
    update((s) => ({ ...s, sessions: s.sessions.filter((w) => w.path !== p) }));
    if (p === path) go("/");
  };
  return (
    <div className="app-layout">
      {mobile && <div className="fixed inset-0 z-30 bg-overlay" onClick={() => setMobile(false)} />}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
        <Link to="/" className="brand" aria-label="Axiom home">
          <svg className="brand-symbol" viewBox="0 0 30 32" fill="none">
            <path d="M14 2 1 29h8l6-13 7 13h8L17 2z" fill="currentColor" />
            <path d="m14 23-3 6h9l-3-6z" fill="currentColor" />
          </svg>
          {!collapsed && (
            <div>
              Axiom<div className="brand-label">DECISION INTELLIGENCE</div>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="business-switch">
            <span className="business-monogram">C</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{state.profile.name}</div>
              <div className="text-[10px] text-sidebar-muted mt-1">
                {state.profile.industry} · Demo workspace
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              title="Business profiles"
              onClick={() => go("/business")}
            >
              <ChevronDown />
            </Button>
          </div>
        )}
        <nav className="overflow-y-auto">
          {["WORKSPACE", "INTELLIGENCE", "MANAGEMENT"].map((group) => (
            <div key={group}>
              {!collapsed && <div className="nav-label">{group}</div>}
              {modules
                .filter((m) => m.group === group)
                .map((m) => (
                  <Link
                    key={m.path}
                    to={m.path}
                    className={`nav-link ${path === m.path ? "active" : ""}`}
                    title={m.title}
                  >
                    <m.icon />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{m.title}</span>
                        {m.path === "/decisions" && (
                          <span className="text-[9px] rounded bg-sidebar-active px-1.5">
                            {state.decisions.filter((d) => d.status === "Pending review").length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {" "}
          <Button
            variant="ghost"
            className="nav-link w-[calc(100%-24px)] justify-start"
            title="Workspace manager"
            onClick={() => setSessions(true)}
          >
            <PanelsTopLeft />
            {!collapsed && <span>Workspace manager</span>}
          </Button>
          <Button
            variant="ghost"
            className="nav-link w-[calc(100%-24px)] justify-start"
            title="Help and prototype status"
            onClick={() => setHelp(true)}
          >
            <HelpCircle />
            {!collapsed && (
              <span>
                Help & resources
                <ArrowUpRight className="ml-auto" />
              </span>
            )}
          </Button>
          {!collapsed && (
            <div className="sidebar-user">
              <span className="avatar">KA</span>
              <div className="flex-1">
                <div className="text-xs">Khaled Ayoubi</div>
                <div className="text-[10px] text-sidebar-muted mt-1">{state.role}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                title="Account settings"
                onClick={() => go("/settings")}
              >
                <ChevronDown />
              </Button>
            </div>
          )}
        </div>
      </aside>
      <div className={`main-shell ${collapsed ? "compact" : ""}`}>
        <header className="topbar">
          <div className="breadcrumb">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu size-7"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hide-mobile size-6"
              title="Collapse navigation"
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeftClose className="size-3.5" />
            </Button>
            <Home className="size-3.5 hide-mobile" />
            <span>{state.profile.name}</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground truncate">{title}</span>
          </div>
          <div className="top-actions">
            <Button
              variant="ghost"
              className="search-trigger h-8"
              onClick={() => setCommand(true)}
              aria-label="Search workspace"
            >
              <Search className="size-3.5" />
              <span>Search anything...</span>
              <kbd className="text-[9px] border border-border rounded px-1">⌘ K</kbd>
            </Button>
            <Tag tone="success">
              <span className="hide-mobile">Prototype</span>
            </Tag>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-7"
              aria-label="Notifications"
              onClick={() => setNotifications(true)}
            >
              <Bell className="size-4" />
              <i className="absolute right-1 top-1 size-1.5 bg-primary rounded-full" />
            </Button>
            <span className="avatar hide-mobile">KA</span>
          </div>
        </header>
        <div className="workspace-strip">
          {state.sessions
            .filter((w) => !w.minimized)
            .map((w) => (
              <div key={w.path} className={`workspace-tab ${w.path === path ? "active" : ""}`}>
                <Button
                  variant="ghost"
                  className="h-full px-0 text-[10px]"
                  onClick={() => go(w.path)}
                >
                  {w.pinned ? <Pin className="size-2.5" /> : <PanelsTopLeft className="size-3" />}
                  {w.title}
                </Button>
                {!w.pinned && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4"
                    title={`Close ${w.title}`}
                    onClick={() => close(w.path)}
                  >
                    <X className="size-2.5" />
                  </Button>
                )}
              </div>
            ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-9 shrink-0"
            title="Open workspace"
            onClick={() => setCommand(true)}
          >
            <Plus className="size-3" />
          </Button>
          <div className="ml-auto flex items-center px-2 border-l border-border">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              title="Side-by-side comparison"
              onClick={() => setSplit(!split)}
            >
              <PanelsTopLeft className="size-3" />
            </Button>
          </div>
        </div>
        <div className="content-split">
          <main>{children}</main>
          {split && (
            <aside className="split-preview">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Baseline comparison</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Close comparison"
                  onClick={() => setSplit(false)}
                >
                  <X />
                </Button>
              </div>
              <Tag tone="blue">{state.classification}</Tag>
              <h3 className="text-xl font-semibold mt-5">{state.profile.name}</h3>
              {[
                ["Revenue", money(state.figures["revenue"])],
                ["Operating profit", money(financials(state.figures).profit)],
                ["Margin", `${financials(state.figures).margin?.toFixed(1) ?? "N/A"}%`],
              ].map(([k, v]) => (
                <div key={k} className="settings-line">
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
              <p className="description mt-5">
                Monthly baseline · November 2026
                <br />
                Dataset v3 · Illustrative restaurant data
              </p>
            </aside>
          )}
        </div>
      </div>
      <Dialog open={command} onOpenChange={setCommand}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Axiom</DialogTitle>
            <DialogDescription>Pages, analyses and decisions</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              aria-label="Search pages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workspace..."
            />
          </div>
          <div className="command-results">
            {modules
              .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
              .map((m) => (
                <Button
                  variant="ghost"
                  key={m.path}
                  className="command-item"
                  onClick={() => go(m.path)}
                >
                  <span className="flex gap-3 items-center">
                    <m.icon />
                    {m.title}
                  </span>
                  <ChevronRight />
                </Button>
              ))}
            {state.decisions
              .filter((d) => search && d.title.toLowerCase().includes(search.toLowerCase()))
              .map((d) => (
                <Button
                  key={d.id}
                  variant="ghost"
                  className="command-item whitespace-normal h-auto"
                  onClick={() => go("/decisions")}
                >
                  {d.title}
                  <ArrowUpRight />
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={notifications} onOpenChange={setNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity center</DialogTitle>
            <DialogDescription>Workspace updates and management actions</DialogDescription>
          </DialogHeader>
          {state.activity.map((a, i) => (
            <div className="list-row px-0" key={`${a}-${i}`}>
              <span className="size-2 rounded-full bg-success shrink-0" />
              <div>
                <p className="text-xs text-foreground">{a}</p>
                <p>Local prototype activity</p>
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
      <Dialog open={sessions} onOpenChange={setSessions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace manager</DialogTitle>
            <DialogDescription>Open, pin or park your analytical sessions</DialogDescription>
          </DialogHeader>
          {state.sessions.map((w) => (
            <div className="flex items-center gap-2 border-b border-border py-3" key={w.path}>
              <Button variant="ghost" className="flex-1 justify-start" onClick={() => go(w.path)}>
                {w.title}
                {w.minimized && <Tag>Parked</Tag>}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title={w.pinned ? "Unpin" : "Pin"}
                onClick={() =>
                  update((s) => ({
                    ...s,
                    sessions: s.sessions.map((v) =>
                      v.path === w.path ? { ...v, pinned: !v.pinned } : v,
                    ),
                  }))
                }
              >
                <Pin className={w.pinned ? "text-primary" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title={w.minimized ? "Reopen" : "Minimize"}
                onClick={() => {
                  update((s) => ({
                    ...s,
                    sessions: s.sessions.map((v) =>
                      v.path === w.path ? { ...v, minimized: !v.minimized } : v,
                    ),
                  }));
                  if (path === w.path && !w.minimized) go("/");
                }}
              >
                {w.minimized ? <Maximize2 /> : <Minus />}
              </Button>
              {!w.pinned && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Close workspace"
                  onClick={() => close(w.path)}
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
        </DialogContent>
      </Dialog>
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Axiom prototype status</DialogTitle>
            <DialogDescription>Demonstration environment</DialogDescription>
          </DialogHeader>
          <p className="description">
            Business figures, connections, market information and research results are illustrative.
            Financial arithmetic uses the entered figures. Profiles, sessions and actions are saved
            in this browser only.
          </p>
          <p className="description">
            No production authentication, ERP connection, AI model training or mathematical solver
            is running. PDF downloads and spreadsheet imports work locally. Role switching
            demonstrates interface permissions, not security enforcement.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setHelp(false);
              go("/settings");
            }}
          >
            <RotateCcw />
            Workspace settings
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function Inspector({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const [max, setMax] = useState(false);
  const [min, setMin] = useState(false);
  return (
    <div className={`floating-panel ${max ? "maximized" : ""} ${min ? "minimized" : ""}`}>
      <div
        className="floating-header"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          const header = e.currentTarget;
          const el = header.parentElement;
          if (!el || max) return;
          const startX = e.clientX,
            startY = e.clientY,
            rect = el.getBoundingClientRect();
          header.setPointerCapture(e.pointerId);
          header.onpointermove = (ev) => {
            el.style.left = `${Math.max(0, rect.left + ev.clientX - startX)}px`;
            el.style.top = `${Math.max(0, rect.top + ev.clientY - startY)}px`;
            el.style.right = "auto";
            el.style.bottom = "auto";
          };
          header.onpointerup = () => {
            header.onpointermove = null;
          };
        }}
      >
        <h3 className="text-xs font-semibold">{title}</h3>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Minimize inspector"
            onClick={() => {
              setMax(false);
              setMin(!min);
            }}
          >
            <Minus className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Maximize inspector"
            onClick={(e) => {
              const panel = e.currentTarget.closest<HTMLElement>(".floating-panel");
              if (panel) {
                for (const property of ["left", "top", "right", "bottom", "width", "height"]) {
                  panel.style.removeProperty(property);
                }
              }
              setMin(false);
              setMax(!max);
            }}
          >
            <Maximize2 className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Close inspector"
            onClick={onClose}
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>
      {!min && <div className="p-5">{children}</div>}
    </div>
  );
}
