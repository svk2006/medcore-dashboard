import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, AlertCircle, UserPlus, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import logo from '@/assets/medcoreops-logo.png';

const navItems = [
  { path: '/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
  { path: '/trends', label: 'Department Trends', icon: TrendingUp },
  { path: '/patients', label: 'Patient List', icon: Users },
  { path: '/resolution', label: 'Resolution Center', icon: AlertCircle },
  { path: '/admissions', label: 'Admissions Portal', icon: UserPlus },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <img src={logo} alt="MedCoreOps" className="h-9 w-9 rounded-lg" />
        <div>
          <h1 className="text-base font-bold tracking-tight text-foreground">MedCoreOps</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Clinical Admin</p>
        </div>
      </div>

      {/* User Info */}
      {profile && (
        <div className="px-6 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">{profile.full_name || 'User'}</p>
          <p className="text-[10px] text-muted-foreground">{profile.department}{isAdmin ? ' · Admin' : ''}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
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
      <div className="border-t border-border px-3 py-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
        <p className="text-[10px] text-muted-foreground px-3 mt-2">v1.0 — Clinical Dashboard</p>
      </div>
    </div>
  );
};

const DashboardSidebar = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0 border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <img src={logo} alt="MedCoreOps" className="h-6 w-6 rounded" />
            <span className="text-sm font-bold text-foreground">MedCoreOps</span>
          </div>
        </div>
        {/* Spacer for fixed header */}
        <div className="h-14" />
      </>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <SidebarContent />
    </aside>
  );
};

export default DashboardSidebar;
