import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Gamepad2 } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/videogames', label: 'Video Games' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/hardware', label: 'Hardware' },
  { to: '/accessories', label: 'Accessories' },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Gamepad2 className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Slam&apos;s Video Game Inventory
            </h1>
          </div>
          {/* Navigation tabs */}
          <nav className="flex gap-1 -mb-px">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors',
                    'hover:bg-muted/50 hover:text-foreground',
                    isActive
                      ? 'bg-background text-foreground border border-b-0 border-border shadow-sm'
                      : 'text-muted-foreground'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
