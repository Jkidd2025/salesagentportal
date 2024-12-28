import { Link } from "react-router-dom";
import { LayoutDashboard, Users, DollarSign, LineChart } from "lucide-react";

export const SidebarNav = () => {
  return (
    <>
      <Link
        to="/dashboard"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <LayoutDashboard className="w-4 h-4 mr-3" />
        Dashboard
      </Link>
      <Link
        to="/accounts"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <Users className="w-4 h-4 mr-3" />
        Accounts
      </Link>
      <Link
        to="/commissions"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <DollarSign className="w-4 h-4 mr-3" />
        Commissions
      </Link>
      <Link
        to="/residuals"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <LineChart className="w-4 h-4 mr-3" />
        Residuals
      </Link>
    </>
  );
};