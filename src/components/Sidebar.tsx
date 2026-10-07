import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Cpu,
  Users,
  Building,
  ShieldCheck,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
  Server
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'assets'
  | 'devices'
  | 'users'
  | 'vendors'
  | 'warranty'
  | 'reports'
  | 'import-export'
  | 'settings';

interface Props {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  warrantyAlertCount: number;
  totalAssetsCount: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  isDark,
  toggleDarkMode,
  warrantyAlertCount,
  totalAssetsCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'assets' as NavTab,
      label: 'Assets',
      icon: <Boxes className="w-4 h-4 shrink-0" />,
      badge: totalAssetsCount > 0 ? String(totalAssetsCount) : undefined
    },
    {
      id: 'devices' as NavTab,
      label: 'Devices',
      icon: <Cpu className="w-4 h-4 shrink-0" />
    },
    {
      id: 'users' as NavTab,
      label: 'Users',
      icon: <Users className="w-4 h-4 shrink-0" />
    },
    {
      id: 'vendors' as NavTab,
      label: 'Vendors',
      icon: <Building className="w-4 h-4 shrink-0" />
    },
    {
      id: 'warranty' as NavTab,
      label: 'Warranty',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
      badge: warrantyAlertCount > 0 ? String(warrantyAlertCount) : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />
    },
    {
      id: 'import-export' as NavTab,
      label: 'Import / Export',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />
    }
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          // Desktop collapse state
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          // Mobile state
          isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
              <Server className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate block">
                  AssetPulse
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block">
                  IT Enterprise Portal
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                {item.icon}

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions: Dark Mode & Collapse */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 shrink-0">
          {/* Dark mode button */}
          <button
            onClick={toggleDarkMode}
            title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            {!isCollapsed && <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
