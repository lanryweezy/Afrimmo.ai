
import React from 'react';
import { Page } from '../types';
import { TodayIcon, LeadsIcon, ListingsIcon, MarketingIcon, ToolsIcon } from './IconComponents';

interface BottomNavBarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
}> = ({ page, label, currentPage, setCurrentPage, icon }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex flex-col items-center justify-center w-full py-2 text-xs font-medium transition-colors duration-200 ${
        isActive ? 'text-teal-400' : 'text-gray-400 hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 z-10">
      <div className="flex justify-around max-w-6xl mx-auto">
        <NavItem 
          page="today" 
          label="Today" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          icon={<TodayIcon className="w-6 h-6" />}
        />
        <NavItem 
          page="leads" 
          label="Leads" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          icon={<LeadsIcon className="w-6 h-6" />}
        />
        <NavItem 
          page="listings" 
          label="Listings" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          icon={<ListingsIcon className="w-6 h-6" />}
        />
        <NavItem 
          page="marketing" 
          label="Marketing" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          icon={<MarketingIcon className="w-6 h-6" />}
        />
        <NavItem 
          page="tools" 
          label="Tools" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          icon={<ToolsIcon className="w-6 h-6" />}
        />
      </div>
    </nav>
  );
};

export default BottomNavBar;
