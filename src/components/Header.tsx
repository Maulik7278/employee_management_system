import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Diamond } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gradient-card shadow-soft">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Diamond className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Diamond Works</h1>
              <p className="text-xs text-muted-foreground">Worker Management System</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {state.user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-full">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{state.user.name}</span>
                <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                  {state.user.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};