import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <Header sidebarCollapsed={sidebarCollapsed} />

            <main
                className={cn(
                    "pt-[60px] min-h-screen transition-all duration-300",
                    sidebarCollapsed ? "pl-[72px]" : "pl-[240px]"
                )}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
