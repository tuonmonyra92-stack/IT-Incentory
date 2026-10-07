import React from 'react';
import { Asset } from '../../types/asset';
import { ALL_VENDORS, formatCurrency } from '../../services/storage';
import { Building, Laptop, DollarSign, ChevronRight } from 'lucide-react';

interface Props {
  assets: Asset[];
  onFilterVendorInAssets: (vendor: string) => void;
}

export const VendorsView: React.FC<Props> = ({ assets, onFilterVendorInAssets }) => {
  // Aggregate vendors from assets
  const vendorMap = new Map<string, { count: number; value: number; devices: Set<string> }>();

  assets.forEach(a => {
    const v = a.vendor || 'Generic';
    const cur = vendorMap.get(v) || { count: 0, value: 0, devices: new Set() };
    cur.count += 1;
    cur.value += Number(a.price) || 0;
    cur.devices.add(a.device);
    vendorMap.set(v, cur);
  });

  const vendorsList = Array.from(vendorMap.entries()).map(([vendor, data]) => ({
    vendor,
    count: data.count,
    value: data.value,
    categories: Array.from(data.devices)
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-500" />
          Hardware OEM & Vendor Directory
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manufacturer portfolio, cumulative procurement spend, and contract equipment distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendorsList.map(v => (
          <div
            key={v.vendor}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {v.vendor}
                    </h3>
                    <p className="text-xs text-slate-400">{v.categories.join(', ')}</p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {v.count} Units
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Total Procurement Spend:
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(v.value)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Primary Tier Vendor</span>
              <button
                onClick={() => onFilterVendorInAssets(v.vendor)}
                className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
              >
                <span>View Equipment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
