import React, { useState, useRef, useEffect } from 'react';
import { Asset, NotificationItem } from '../types/asset';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  ShieldAlert,
  Laptop,
  Check,
  ChevronDown,
  User,
  ExternalLink,
  X
} from 'lucide-react';

interface Props {
  onToggleMobileNav: () => void;
  pageTitle: string;
  isDark: boolean;
  toggleDarkMode: () => void;
  assets: Asset[];
  notifications: NotificationItem[];
  onOpenAddModal: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const Header: React.FC<Props> = ({
  onToggleMobileNav,
  pageTitle,
  isDark,
  toggleDarkMode,
  assets,
  notifications,
  onOpenAddModal,
  onSelectAsset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter assets based on search query
  const searchResults = searchQuery.trim()
    ? assets
        .filter(a => {
          const q = searchQuery.toLowerCase();
          return (
            a.model.toLowerCase().includes(q) ||
            a.serialNumber.toLowerCase().includes(q) ||
            a.userName.toLowerCase().includes(q) ||
            a.device.toLowerCase().includes(q) ||
            a.location.toLowerCase().includes(q) ||
            a.jobTitle.toLowerCase().includes(q) ||
            a.vendor.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Header / Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 hidden sm:block">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {pageTitle}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Good Morning, Admin · Hope you have a productive day
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search asset, serial number, user, location..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Assets ({searchResults.length})
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No assets match &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map(a => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onSelectAsset(a);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {a.model}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-slate-500 dark:text-slate-300">{a.serialNumber}</span>
                          <span>·</span>
                          <span>{a.userName}</span>
                          <span>·</span>
                          <span>{a.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                        {a.device}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Action, Notifications, Dark Mode, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Add Asset Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Asset</span>
          </button>

          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Real-time alerts</span>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 py-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.assetId) {
                            const found = assets.find(a => a.id === n.assetId);
                            if (found) {
                              onSelectAsset(found);
                              setIsNotifOpen(false);
                            }
                          }
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'warranty-expired' ? (
                            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : n.type === 'warranty-warning' ? (
                            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <Laptop className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Quick Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Avatar & Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                TM
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                  Tuon Monyra
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Lead IT Systems
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Tuon Monyra
                  </div>
                  <div className="text-[11px] text-slate-400">
                    tuonmonyra92@gmail.com
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <div className="px-3 py-2 text-slate-500 flex items-center justify-between">
                    <span>Role</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Super Admin
                    </span>
                  </div>
                  <div className="px-3 py-2 text-slate-500 flex items-center justify-between">
                    <span>Active Session</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
