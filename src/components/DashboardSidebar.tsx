import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, AlertCircle, Activity, UserPlus } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/departments', label: 'Departmental Trends', icon: TrendingUp },
  { path: '/resolution', label: 'Resolution Center', icon: AlertCircle },
  { path: '/admissions', label: 'Admissions Portal', icon: UserPlus },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-foreground">MedCoreOps</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Clinical Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-[10px] text-muted-foreground">v1.0 — Clinical Dashboard</p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
