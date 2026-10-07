import React from 'react';
import { AssetCategory, CategorySummary } from '../types/asset';
import { formatCurrency } from '../services/storage';
import { Layers, ArrowRight, Laptop, Monitor, Printer, Server, Network, Camera, BatteryCharging, Box } from 'lucide-react';

interface Props {
  inventory: CategorySummary[];
  onSelectCategory?: (category: AssetCategory) => void;
}

export const InventoryOverviewTable: React.FC<Props> = ({ inventory, onSelectCategory }) => {
  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-indigo-500" />;
      case 'Desktop':
        return <Monitor className="w-4 h-4 text-cyan-500" />;
      case 'Printer':
        return <Printer className="w-4 h-4 text-emerald-500" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4 text-purple-500" />;
      case 'Server':
        return <Server className="w-4 h-4 text-amber-500" />;
      case 'Network Device':
        return <Network className="w-4 h-4 text-blue-500" />;
      case 'CCTV':
        return <Camera className="w-4 h-4 text-pink-500" />;
      case 'UPS':
        return <BatteryCharging className="w-4 h-4 text-teal-500" />;
      default:
        return <Box className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Inventory Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Departmental stock balances, availability index, and capital value
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 self-start sm:self-auto">
          {inventory.length} Categories Tracked
        </span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <th className="pb-3 pr-4 font-semibold">Asset Category</th>
              <th className="pb-3 px-4 font-semibold text-right">Total Value</th>
              <th className="pb-3 px-4 font-semibold text-right">Total Assets</th>
              <th className="pb-3 px-4 font-semibold text-right">Active</th>
              <th className="pb-3 px-4 font-semibold text-right">Assigned</th>
              <th className="pb-3 px-4 font-semibold text-right">Available</th>
              <th className="pb-3 px-4 font-semibold text-right">Expiring</th>
              <th className="pb-3 pl-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {inventory.map(item => (
              <tr
                key={item.category}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.category}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                  {formatCurrency(item.totalValue)}
                </td>

                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {item.totalAssets}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    {item.active}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-medium tabular-nums">
                    {item.assigned}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                    {item.available}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  {item.warrantyExpiring > 0 ? (
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                      {item.warrantyExpiring}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">0</span>
                  )}
                </td>

                <td className="py-3.5 pl-4 text-right">
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(item.category)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1 px-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    <span>Filter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
