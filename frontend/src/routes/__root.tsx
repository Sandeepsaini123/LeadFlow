import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LeadFlow — Lead Management Dashboard" },
      { name: "description", content: "Modern lead management dashboard with analytics, leads CRUD, and reports." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function HamburgerButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
      aria-label="Toggle Sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

function RootComponent() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "13rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
            <HamburgerButton />
            <div className="text-sm font-medium text-muted-foreground">Lead Management</div>
          </header>
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </SidebarProvider>
  );
}
