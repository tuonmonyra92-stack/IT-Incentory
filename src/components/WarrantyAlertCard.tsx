import React from 'react';
import { Asset, WarrantyAlertItem } from '../types/asset';
import { ShieldAlert, ArrowRight, AlertCircle, Clock, Calendar } from 'lucide-react';

interface Props {
  alerts: WarrantyAlertItem[];
  onViewAll: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const WarrantyAlertCard: React.FC<Props> = ({ alerts, onViewAll, onSelectAsset }) => {
  const displayAlerts = alerts.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Warranty Alert</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assets requiring manufacturer support extension (≤ 30 days)
              </p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View All ({alerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <ShieldAlert className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
            No warranties expiring in the next 30 days. All contracts are healthy.
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {displayAlerts.map(({ asset, daysRemaining, status }) => {
              const isExpired = status === 'expired';
              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="group p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {asset.model}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
                          {asset.device}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">{asset.serialNumber}</span>
                        <span>·</span>
                        <span>{asset.userName}</span>
                        <span>·</span>
                        <span>{asset.location}</span>
                      </div>
                    </div>

                    {/* Expiry Badge */}
                    <div className="shrink-0 text-right">
                      {isExpired ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          <AlertCircle className="w-3 h-3" />
                          <span>Expired ({Math.abs(daysRemaining)}d ago)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                          <Clock className="w-3 h-3" />
                          <span>{daysRemaining} days left</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{asset.warrantyExpiry}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Expired
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> ≤ 30 Days
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Healthy (&gt;30d)
          </span>
        </div>
      </div>
    </div>
  );
};
