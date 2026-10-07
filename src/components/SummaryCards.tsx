import React from 'react';
import { DashboardStats } from '../types/asset';
import { formatCurrency } from '../services/storage';
import { Boxes, DollarSign, Laptop, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  stats: DashboardStats;
  onWarrantyCardClick?: () => void;
  onActiveCardClick?: () => void;
}

export const SummaryCards: React.FC<Props> = ({ stats, onWarrantyCardClick, onActiveCardClick }) => {
  // SVG circular progress helper
  const renderCircularProgress = (percent: number, strokeColor: string, bgColor: string) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className={bgColor}
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className={`${strokeColor} transition-all duration-700 ease-out`}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300">
          {percent}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* CARD 1: Total Assets */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <Boxes className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            +8.4%
          </span>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Assets</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
              {stats.totalAssets.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">units</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            All tracked enterprise hardware devices
          </p>
        </div>
      </div>

      {/* CARD 2: Total Asset Value */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
            Active CapEx
          </span>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Asset Value</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
              {formatCurrency(stats.totalValue)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Cumulative capital hardware valuation
          </p>
        </div>
      </div>

      {/* CARD 3: Active Devices */}
      <div
        onClick={onActiveCardClick}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <Laptop className="w-5 h-5" />
          </div>
          {renderCircularProgress(
            stats.activePercentage,
            'stroke-emerald-500 dark:stroke-emerald-400',
            'stroke-slate-100 dark:stroke-slate-800'
          )}
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Devices</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
              {stats.activeDevices.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ({stats.activePercentage}% online)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Assigned & deployed in active workflows
          </p>
        </div>
      </div>

      {/* CARD 4: Warranty Expiring */}
      <div
        onClick={onWarrantyCardClick}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              stats.warrantyExpiringCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          {stats.warrantyExpiredCount > 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              {stats.warrantyExpiredCount} Expired
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
              Attention Required
            </span>
          )}
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Warranty Expiring</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums ${
                stats.warrantyExpiringCount > 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {stats.warrantyExpiringCount}
            </span>
            <span className="text-xs text-slate-400">items</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Within 30 days or overdue for renewal
          </p>
        </div>
      </div>
    </div>
  );
};
