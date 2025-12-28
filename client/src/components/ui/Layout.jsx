import React from 'react';

export default function Layout({ children, leftSidebar, rightSidebar }) {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">

            {/* Left Sidebar */}
            {leftSidebar && (
                <aside className="w-80 flex-shrink-0 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                    {leftSidebar}
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
                <div className="relative flex-1 overflow-hidden flex flex-col">
                    {children}
                </div>
            </main>

            {/* Right Sidebar */}
            {rightSidebar && (
                <aside className="w-80 flex-shrink-0 border-l border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                    {rightSidebar}
                </aside>
            )}

        </div>
    );
}
