export const APP_NAME = "ProjectFlow";

// Proxied through Next.js rewrites to avoid browser CORS issues (see next.config.ts)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/projects",
  "/tasks",
  "/members",
  "/notes",
  "/settings",
] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  projects: "/projects",
  settings: "/settings",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Projects", href: "/projects", icon: "FolderKanban" },
  { label: "Tasks", href: "/tasks", icon: "CheckSquare" },
  { label: "Members", href: "/members", icon: "Users" },
  { label: "Notes", href: "/notes", icon: "FileText" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const KEYBOARD_SHORTCUTS = {
  search: { key: "k", meta: true, label: "⌘K" },
  newProject: { key: "p", meta: true, shift: true, label: "⇧⌘P" },
  dashboard: { key: "d", meta: true, shift: true, label: "⇧⌘D" },
} as const;
