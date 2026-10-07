import React, { useState } from 'react';
import { Asset, WarrantyAlertItem } from '../../types/asset';
import { calculateWarrantyAlerts, formatCurrency } from '../../services/storage';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Eye,
  Edit2
} from 'lucide-react';

interface Props {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
}

export const WarrantyView: React.FC<Props> = ({ assets, onViewAsset, onEditAsset }) => {
  const [filterTab, setFilterTab] = useState<'all' | 'expired' | '30d' | '90d' | 'healthy'>('all');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const items = assets.map(asset => {
    let daysRemaining = 9999;
    let status: 'expired' | '30d' | '90d' | 'healthy' = 'healthy';

    if (asset.warrantyExpiry) {
      const exp = new Date(asset.warrantyExpiry);
      exp.setHours(0, 0, 0, 0);
      daysRemaining = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysRemaining < 0) {
        status = 'expired';
      } else if (daysRemaining <= 30) {
        status = '30d';
      } else if (daysRemaining <= 90) {
        status = '90d';
      } else {
        status = 'healthy';
      }
    }

    return { asset, daysRemaining, status };
  });

  const expiredCount = items.filter(i => i.status === 'expired').length;
  const thirtyDayCount = items.filter(i => i.status === '30d').length;
  const ninetyDayCount = items.filter(i => i.status === '90d').length;
  const healthyCount = items.filter(i => i.status === 'healthy').length;

  const filteredItems = items.filter(item => {
    if (filterTab === 'all') return true;
    return item.status === filterTab;
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="space-y-6">
      {/* Top Banner / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expired */}
        <div
          onClick={() => setFilterTab('expired')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterTab === 'expired'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Expired Warranties
            </span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-2">
            {expiredCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate renewal or retirement</p>
        </div>

        {/* 30 Days */}
        <div
          onClick={() => setFilterTab('30d')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterTab === '30d'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Expiring ≤ 30 Days
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2">
            {thirtyDayCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending vendor quotes & approvals</p>
        </div>

        {/* 31-90 Days */}
        <div
          onClick={() => setFilterTab('90d')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterTab === '90d'
              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Expiring in 31–90 Days
            </span>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            {ninetyDayCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Schedule budget allocation</p>
        </div>

        {/* Healthy >90 Days */}
        <div
          onClick={() => setFilterTab('healthy')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterTab === 'healthy'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Healthy Coverage (&gt;90d)
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {healthyCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Fully protected by OEM agreements</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Warranty Lifecycle Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed SLA expiration schedule and support terms
            </p>
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
            {(
              [
                { key: 'all', label: 'All Equipment' },
                { key: 'expired', label: `Expired (${expiredCount})` },
                { key: '30d', label: `≤ 30d (${thirtyDayCount})` },
                { key: '90d', label: `31-90d (${ninetyDayCount})` },
                { key: 'healthy', label: `Healthy (${healthyCount})` }
              ] as const
            ).map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filterTab === tab.key
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4 font-semibold">Asset Model</th>
                <th className="py-3 px-3 font-semibold">Serial Number</th>
                <th className="py-3 px-3 font-semibold">Vendor</th>
                <th className="py-3 px-3 font-semibold">Custodian</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Expiry Date</th>
                <th className="py-3 px-3 font-semibold">Days Remaining</th>
                <th className="py-3 pr-4 pl-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map(({ asset, daysRemaining, status }) => (
                <tr
                  key={asset.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {asset.model}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">{asset.device}</span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {asset.serialNumber}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {asset.vendor}
                  </td>

                  <td className="py-3.5 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {asset.userName}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    {asset.location}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {asset.warrantyExpiry || 'No contract recorded'}
                  </td>

                  <td className="py-3.5 px-3">
                    {status === 'expired' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        <AlertCircle className="w-3 h-3" />
                        Expired ({Math.abs(daysRemaining)}d ago)
                      </span>
                    ) : status === '30d' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                        <Clock className="w-3 h-3" />
                        {daysRemaining} days left
                      </span>
                    ) : status === '90d' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                        {daysRemaining} days left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-3 h-3" />
                        Healthy ({daysRemaining}d)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pr-4 pl-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewAsset(asset)}
                        title="View Asset Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditAsset(asset)}
                        title="Update Warranty"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
