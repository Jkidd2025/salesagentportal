import { Link } from "react-router-dom";
import { Users, Settings, ClipboardList, Database } from "lucide-react";

export const AdminNav = () => {
  return (
    <>
      <div className="pt-4 pb-2">
        <h3 className="px-3 text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">
          Admin
        </h3>
      </div>
      <Link
        to="/admin/users"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <Users className="w-4 h-4 mr-3" />
        User Management
      </Link>
      <Link
        to="/admin/settings"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <Settings className="w-4 h-4 mr-3" />
        System Settings
      </Link>
      <Link
        to="/admin/logs"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <ClipboardList className="w-4 h-4 mr-3" />
        Activity Logs
      </Link>
      <Link
        to="/admin/backups"
        className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
      >
        <Database className="w-4 h-4 mr-3" />
        System Backups
      </Link>
    </>
  );
};