import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartSetup';
import { Asset } from '../../types/asset';
import { calculateAssetDistribution } from '../../services/storage';

interface Props {
  assets: Asset[];
  isDark: boolean;
}

export const AssetDistributionChart: React.FC<Props> = ({ assets, isDark }) => {
  const { labels, data: chartValues, colors } = calculateAssetDistribution(assets);
  const totalCount = chartValues.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: colors,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const val = context.raw || 0;
            const pct = totalCount > 0 ? Math.round((val / totalCount) * 100) : 0;
            return ` ${context.label}: ${val} units (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Asset Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown by equipment hardware category
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {totalCount} Total Units
          </span>
        </div>

        {/* Donut Chart with Centered Metric */}
        <div className="relative h-48 sm:h-52 w-full my-2 flex items-center justify-center">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Total Assets
            </span>
          </div>
        </div>
      </div>

      {/* Clean Category Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {labels.slice(0, 8).map((label, index) => {
          const val = chartValues[index] || 0;
          const pct = totalCount > 0 ? Math.round((val / totalCount) * 100) : 0;
          return (
            <div key={label} className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <span className="text-slate-700 dark:text-slate-300 truncate font-medium">{label}</span>
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                {val} <span className="text-[10px] text-slate-400 dark:text-slate-500">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
