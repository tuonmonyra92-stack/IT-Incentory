import React from 'react';
import { Settings, RefreshCw, Trash2, Sun, Moon, Database, ShieldCheck } from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleDarkMode: () => void;
  onResetSampleData: () => void;
  onClearAllData: () => void;
  totalAssetsCount: number;
}

export const SettingsView: React.FC<Props> = ({
  isDark,
  toggleDarkMode,
  onResetSampleData,
  onClearAllData,
  totalAssetsCount
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          Portal Configuration & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage system appearance, enterprise currency, and local database storage
        </p>
      </div>

      {/* Appearance Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Appearance & Theme
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Dark Mode Theme
              </div>
              <p className="text-[11px] text-slate-400">
                Optimized high-contrast dark color palette for monitoring consoles
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
              isDark ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Database & Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            LocalStorage Database Management
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {totalAssetsCount} Assets Stored Locally
          </span>
        </div>

        <div className="space-y-3">
          {/* Reset to Sample Enterprise Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Reset to Sample Enterprise Dataset
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Populates 36 realistic enterprise hardware records (MacBooks, ThinkPads, Servers, CCTV, UPS, switches)
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset all asset data back to initial enterprise sample records?')) {
                  onResetSampleData();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

          {/* Clear All Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
            <div>
              <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Purge Entire Local Database
              </div>
              <p className="text-[11px] text-rose-500/80 dark:text-rose-400/80 mt-0.5">
                Removes all asset entries from browser LocalStorage. Action cannot be undone.
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Warning: This will delete ALL assets from your local database. Proceed?')) {
                  onClearAllData();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
