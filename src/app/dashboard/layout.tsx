import SessionProvider from "@/components/providers/session-provider";
import DashboardNav from "@/components/navigation/navbar";
import { SidebarNavItem } from "@/types/nav-types";

const dashboardConfig: { sidebarNav: SidebarNavItem[] } = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "library",
    },
    {
      title: "Forms",
      href: "/dashboard/forms",
      icon: "list",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: "barChart",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <DashboardNav items={dashboardConfig.sidebarNav} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  );
} 