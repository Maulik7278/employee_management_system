import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Diamond } from 'lucide-react';

export const Header: React.FC = () => {
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
          <ThemeToggle />
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              DW
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};