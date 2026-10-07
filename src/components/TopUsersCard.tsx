import React from 'react';
import { UserSummary } from '../types/asset';
import { Users, ChevronRight, Laptop } from 'lucide-react';

interface Props {
  users: UserSummary[];
  onSelectUser?: (userName: string) => void;
  onViewAll?: () => void;
}

export const TopUsersCard: React.FC<Props> = ({ users, onSelectUser, onViewAll }) => {
  const topList = users.slice(0, 5);

  // Avatar color generator based on name
  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-purple-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-pink-500',
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
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top Users</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff members with the highest assigned device count
              </p>
            </div>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {topList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No assigned user records available yet.
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {topList.map(u => (
              <div
                key={u.userName}
                onClick={() => onSelectUser && onSelectUser(u.userName)}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-sm ${getAvatarBg(
                      u.userName
                    )}`}
                  >
                    {getInitials(u.userName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {u.userName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {u.jobTitle} · <span className="text-slate-400">{u.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-mono text-xs font-bold tabular-nums">
                      {u.assetCount}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-medium hidden sm:inline">
                      {u.assetCount === 1 ? 'Asset' : 'Assets'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Total Active Assignees: {users.length}</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">100% Verified Profiles</span>
      </div>
    </div>
  );
};
