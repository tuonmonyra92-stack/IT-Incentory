import React from 'react';
import { Asset, AssetStatus } from '../types/asset';
import { formatCurrency } from '../services/storage';
import { Clock, ArrowRight, Eye, Edit2, Trash2 } from 'lucide-react';

interface Props {
  assets: Asset[];
  onViewAll: () => void;
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
}

export const RecentAssetsTable: React.FC<Props> = ({
  assets,
  onViewAll,
  onViewAsset,
  onEditAsset,
  onDeleteAsset
}) => {
  // Sort by purchaseDate descending or id
  const recentAssets = [...assets]
    .sort((a, b) => (b.purchaseDate || '').localeCompare(a.purchaseDate || ''))
    .slice(0, 8);

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Assigned
          </span>
        );
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Available
          </span>
        );
      case 'In Repair':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            In Repair
          </span>
        );
      case 'Retired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Retired
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Assets</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest additions, deployed hardware, and maintenance updates
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors self-start sm:self-auto"
        >
          <span>View All ({assets.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <th className="pb-3 pr-4 font-semibold">Asset / Model</th>
              <th className="pb-3 px-3 font-semibold">Category</th>
              <th className="pb-3 px-3 font-semibold">Serial Number</th>
              <th className="pb-3 px-3 font-semibold">User</th>
              <th className="pb-3 px-3 font-semibold">Location</th>
              <th className="pb-3 px-3 font-semibold">Purchase Date</th>
              <th className="pb-3 px-3 font-semibold text-right">Price</th>
              <th className="pb-3 px-3 font-semibold">Warranty</th>
              <th className="pb-3 px-3 font-semibold text-center">Status</th>
              <th className="pb-3 pl-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentAssets.map(asset => (
              <tr
                key={asset.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Model */}
                <td className="py-3.5 pr-4">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {asset.model}
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    {asset.vendor}
                  </div>
                </td>

                {/* Device */}
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {asset.device}
                  </span>
                </td>

                {/* Serial Number */}
                <td className="py-3.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                  {asset.serialNumber}
                </td>

                {/* User */}
                <td className="py-3.5 px-3">
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    {asset.userName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {asset.jobTitle}
                  </div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                  {asset.location}
                </td>

                {/* Purchase Date */}
                <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                  {asset.purchaseDate || '—'}
                </td>

                {/* Price */}
                <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-white tabular-nums">
                  {formatCurrency(asset.price)}
                </td>

                {/* Warranty */}
                <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                  {asset.warrantyExpiry || 'N/A'}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 text-center">
                  {getStatusBadge(asset.status)}
                </td>

                {/* Action buttons */}
                <td className="py-3.5 pl-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => onViewAsset(asset)}
                      title="View Details"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditAsset(asset)}
                      title="Edit Asset"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAsset(asset)}
                      title="Delete Asset"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
