import React from 'react';
import { Asset, DashboardStats } from '../../types/asset';
import { calculateLocationStatistics, formatCurrency, downloadCSV } from '../../services/storage';
import { BarChart3, Download, FileText, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

interface Props {
  assets: Asset[];
  stats: DashboardStats;
}

export const ReportsView: React.FC<Props> = ({ assets, stats }) => {
  const locations = calculateLocationStatistics(assets);

  // Calculate annual estimated depreciation (standard 25% straight line for IT hardware)
  const annualDepreciation = stats.totalValue * 0.25;
  const netBookValue = Math.max(0, stats.totalValue - annualDepreciation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Executive IT Asset & Financial Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit trail summary, book valuation, depreciation estimate, and departmental allocations
          </p>
        </div>

        <button
          onClick={() => downloadCSV(assets, 'executive_it_report.csv')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Gross Hardware CapEx (Purchase Cost)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatCurrency(stats.totalValue)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Historical procurement capital across {stats.totalAssets} registered units
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Est. Annual Depreciation (25% Straight Line)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {formatCurrency(annualDepreciation)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Calculated straight-line enterprise IT amortization schedule
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Estimated Current Net Book Value
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatCurrency(netBookValue)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Current balance sheet tangible IT asset valuation
          </p>
        </div>
      </div>

      {/* Departmental Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Capital Allocation by Site & Branch
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="pb-3 pr-4 font-semibold">Location / Department</th>
                <th className="pb-3 px-4 font-semibold text-right">Equipment Count</th>
                <th className="pb-3 px-4 font-semibold text-right">Total Valuation</th>
                <th className="pb-3 pl-4 font-semibold text-right">Portfolio Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {locations.map(loc => {
                const share = stats.totalValue > 0 ? Math.round((loc.totalValue / stats.totalValue) * 100) : 0;
                return (
                  <tr key={loc.location} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-white">
                      {loc.location}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      {loc.totalAssets} units
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(loc.totalValue)}
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
