
import React from 'react';
import { Page } from '../types';
import { TodayIcon, LeadsIcon, ListingsIcon, MarketingIcon, ToolsIcon, SettingsIcon } from './IconComponents';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  isCollapsed?: boolean;
}> = ({ page, label, currentPage, setCurrentPage, icon, isCollapsed }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      title={isCollapsed ? label : ''}
      className={`group flex items-center w-full ${isCollapsed ? 'justify-center' : 'px-4'} py-3.5 text-sm font-medium transition-all duration-200 rounded-xl mb-1 ${
        isActive
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
      }`}
    >
      <span className={`transition-transform duration-200 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      {!isCollapsed && <span className="ml-3 truncate">{label}</span>}
      {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={`hidden md:flex md:flex-col ${isCollapsed ? 'md:w-20' : 'md:w-72'} bg-slate-950 border-r border-slate-800/60 p-5 h-screen sticky top-0 transition-all duration-300 relative group`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-slate-800 border border-slate-700 rounded-full p-1 text-slate-400 hover:text-white z-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={`flex items-center mb-10 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path><path d="M19 10l-8 -4l-8 4"></path><path d="M9 21v-8h6v8"></path></svg>
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                  <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Afrimmo<span className="text-emerald-400">.ai</span></h1>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase whitespace-nowrap">Agent Workspace</p>
              </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto">
            {!isCollapsed && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Menu</div>}
            <nav className="space-y-1">
                <NavItem
                page="today"
                label="Dashboard"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<TodayIcon className="w-5 h-5" />}
                isCollapsed={isCollapsed}
                />
                <NavItem
                page="leads"
                label="Client CRM"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<LeadsIcon className="w-5 h-5" />}
                isCollapsed={isCollapsed}
                />
                <NavItem
                page="listings"
                label="Properties"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<ListingsIcon className="w-5 h-5" />}
                isCollapsed={isCollapsed}
                />
                <NavItem
                page="marketing"
                label="Marketing Hub"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<MarketingIcon className="w-5 h-5" />}
                isCollapsed={isCollapsed}
                />
                <NavItem
                page="tools"
                label="Smart Tools"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<ToolsIcon className="w-5 h-5" />}
                isCollapsed={isCollapsed}
                />
            </nav>

             {!isCollapsed && <div className="mt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">System</div>}
             <nav className="space-y-1">
                 <NavItem
                    page="settings"
                    label="Settings & Billing"
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    icon={<SettingsIcon className="w-5 h-5" />}
                    isCollapsed={isCollapsed}
                />
             </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800/60">
             <button onClick={() => setCurrentPage('settings')} className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'p-3'} rounded-xl hover:bg-slate-900 transition-colors group`}>
                <div className="relative flex-shrink-0">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-10 h-10 rounded-full border-2 border-slate-800 group-hover:border-emerald-500 transition-colors object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                {!isCollapsed && (
                  <>
                    <div className="ml-3 text-left overflow-hidden">
                        <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">Tunde Bakare</p>
                        <p className="text-xs text-slate-500 truncate">Premium Agent</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </>
                )}
            </button>
        </div>
    </div>
  );
};

export default Sidebar;
