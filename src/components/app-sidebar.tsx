import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  GitCompare,
  ImageIcon,
  Video,
  Wand2,
  BookMarked,
  Folder,
  Newspaper,
  Settings,
  CreditCard,
  ChevronLeft,
  Menu,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/app/compare", label: "Compare Models", icon: GitCompare },
  { to: "/app/image", label: "Image Generator", icon: ImageIcon },
  { to: "/app/video", label: "Video Generator", icon: Video },
  { to: "/app/tools", label: "AI Tools", icon: Wand2 },
  { to: "/app/prompts", label: "Prompt Library", icon: BookMarked },
  { to: "/app/saved", label: "Saved Projects", icon: Folder },
  { to: "/app/blog", label: "Blog", icon: Newspaper },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/subscription", label: "Subscription", icon: CreditCard },
] as const;

export function AppSidebar({ onRequestAuth }: { onRequestAuth?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  // close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const userInitial = (user?.user_metadata?.full_name || user?.email || "?").charAt(0).toUpperCase();
  const userLabel = user?.user_metadata?.full_name || user?.email || "Guest";

  const UserBlock = (
    <div className="mx-3 mb-3 mt-1 rounded-2xl border border-glass-border bg-white/[0.02] p-2">
      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
            {userInitial}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{userLabel}</p>
                <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={async () => { await signOut(); toast.success("Signed out"); }}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={onRequestAuth}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
        >
          <LogIn className="h-4 w-4" />
          {!collapsed && <span>Sign in</span>}
        </button>
      )}
    </div>
  );


  const SidebarBody = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 78 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="glass-strong relative hidden h-screen shrink-0 flex-col overflow-hidden border-r border-glass-border lg:flex"
    >
      <div className="flex items-center justify-between px-4 py-5">
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Logo />
            </motion.div>
          ) : (
            <motion.div
              key="mini"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mx-auto"
            >
              <Link to="/" aria-label="Taara">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                  <span className="font-display text-sm font-bold">T</span>
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-primary/15 to-transparent text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-primary shadow-glow"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition ${
                  active ? "text-primary" : "group-hover:text-primary/80"
                }`}
              />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-4 rounded-2xl border border-glass-border bg-gradient-to-br from-primary/15 to-transparent p-4">
          <p className="text-xs font-medium text-foreground">Taara Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock unlimited chats, image & video gen.
          </p>
          <Link
            to="/app/subscription"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            Upgrade
          </Link>
        </div>
      )}
    </motion.aside>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="glass-strong sticky top-0 z-40 flex items-center justify-between border-b border-glass-border px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-foreground hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {SidebarBody}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="glass-strong fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-glass-border lg:hidden"
            >
              <div className="flex items-center justify-between px-4 py-5">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
                {nav.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-primary/15 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
