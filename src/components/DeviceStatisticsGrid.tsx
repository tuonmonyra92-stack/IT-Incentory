import React from 'react';
import { Asset, AssetCategory } from '../types/asset';
import { calculateDeviceStatistics } from '../services/storage';
import { Laptop, Monitor, Printer, Server, Network, Camera, BatteryCharging, Box, Cpu } from 'lucide-react';

interface Props {
  assets: Asset[];
  onSelectCategory?: (category: AssetCategory) => void;
}

export const DeviceStatisticsGrid: React.FC<Props> = ({ assets, onSelectCategory }) => {
  const deviceStats = calculateDeviceStatistics(assets);

  const getCategoryDetails = (category: AssetCategory) => {
    switch (category) {
      case 'Laptop':
        return {
          icon: <Laptop className="w-5 h-5" />,
          color: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-950/60'
        };
      case 'Desktop':
        return {
          icon: <Monitor className="w-5 h-5" />,
          color: 'text-cyan-600 dark:text-cyan-400',
          bg: 'bg-cyan-50 dark:bg-cyan-950/60'
        };
      case 'Printer':
        return {
          icon: <Printer className="w-5 h-5" />,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/60'
        };
      case 'Monitor':
        return {
          icon: <Monitor className="w-5 h-5" />,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-950/60'
        };
      case 'Server':
        return {
          icon: <Server className="w-5 h-5" />,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/60'
        };
      case 'Network Device':
        return {
          icon: <Network className="w-5 h-5" />,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-950/60'
        };
      case 'CCTV':
        return {
          icon: <Camera className="w-5 h-5" />,
          color: 'text-pink-600 dark:text-pink-400',
          bg: 'bg-pink-50 dark:bg-pink-950/60'
        };
      case 'UPS':
        return {
          icon: <BatteryCharging className="w-5 h-5" />,
          color: 'text-teal-600 dark:text-teal-400',
          bg: 'bg-teal-50 dark:bg-teal-950/60'
        };
      default:
        return {
          icon: <Box className="w-5 h-5" />,
          color: 'text-slate-600 dark:text-slate-400',
          bg: 'bg-slate-100 dark:bg-slate-800'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Device Statistics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operational breakdown across all hardware tiers
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
          9 Device Classes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {deviceStats.map(stat => {
          const { icon, color, bg } = getCategoryDetails(stat.category);

          return (
            <div
              key={stat.category}
              onClick={() => onSelectCategory && onSelectCategory(stat.category)}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {stat.category}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {stat.totalAssets} total
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {stat.totalAssets}
                  </span>
                </div>
              </div>

              {/* Status Breakdown Mini Bar */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                <div className="bg-white dark:bg-slate-900/60 py-1 px-1 rounded border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Active</div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {stat.active}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/60 py-1 px-1 rounded border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Assigned</div>
                  <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                    {stat.assigned}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/60 py-1 px-1 rounded border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Available</div>
                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {stat.available}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/60 py-1 px-1 rounded border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Repair</div>
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {stat.inRepair}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
