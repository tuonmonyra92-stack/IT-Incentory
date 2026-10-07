import React, { useState } from 'react';
import { Asset, AssetCategory } from '../../types/asset';
import { ALL_CATEGORIES, calculateDeviceStatistics, formatCurrency } from '../../services/storage';
import { DeviceStatisticsGrid } from '../DeviceStatisticsGrid';
import { Laptop, Cpu, CheckCircle2, AlertTriangle, Boxes } from 'lucide-react';

interface Props {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
}

export const DevicesView: React.FC<Props> = ({ assets, onViewAsset }) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const deviceStats = calculateDeviceStatistics(assets);

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter(a => a.device === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Device Category Grid */}
      <DeviceStatisticsGrid
        assets={assets}
        onSelectCategory={cat => setSelectedCategory(cat)}
      />

      {/* Equipment Explorer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              Hardware Category Explorer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filtered inventory view for {selectedCategory === 'all' ? 'all categories' : selectedCategory}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({assets.length})
            </button>
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid of Selected Devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => onViewAsset(asset)}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {asset.device}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
                    {asset.model}
                  </h4>
                  <p className="text-xs text-slate-400">{asset.vendor}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                  {formatCurrency(asset.price)}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial No:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{asset.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Custodian:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{asset.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span>{asset.location}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-medium text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {asset.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
