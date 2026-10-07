import React, { useState } from 'react';
import { Asset, UserSummary } from '../../types/asset';
import { calculateUserStatistics, formatCurrency } from '../../services/storage';
import { Users, Search, Laptop, MapPin, ChevronRight, Mail, ShieldCheck } from 'lucide-react';

interface Props {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onFilterUserInAssets: (userName: string) => void;
}

export const UsersView: React.FC<Props> = ({ assets, onViewAsset, onFilterUserInAssets }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const userStats = calculateUserStatistics(assets);

  const filteredUsers = userStats.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.userName.toLowerCase().includes(q) ||
      u.jobTitle.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q)
    );
  });

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-indigo-600',
      'bg-cyan-600',
      'bg-purple-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-blue-600'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Custodian & User Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Staff members with assigned enterprise hardware and peripheral kits
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search team member, title, area..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(user => {
          const totalVal = user.assets.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

          return (
            <div
              key={user.userName}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${getAvatarBg(
                        user.userName
                      )}`}
                    >
                      {getInitials(user.userName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.userName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.jobTitle}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                    {user.assetCount} {user.assetCount === 1 ? 'Device' : 'Devices'}
                  </span>
                </div>

                {/* Assigned Gear Mini List */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Assigned Equipment:
                  </div>
                  {user.assets.slice(0, 3).map(asset => (
                    <div
                      key={asset.id}
                      onClick={() => onViewAsset(asset)}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/60 text-xs flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-800 dark:text-white truncate block">
                          {asset.model}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {asset.serialNumber}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                        {asset.device}
                      </span>
                    </div>
                  ))}
                  {user.assets.length > 3 && (
                    <div className="text-[11px] text-slate-400 text-center">
                      +{user.assets.length - 3} more assigned units
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with Valuation & Filter Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Gear Value</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">
                    {formatCurrency(totalVal)}
                  </span>
                </div>

                <button
                  onClick={() => onFilterUserInAssets(user.userName)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  <span>Filter Assets</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
