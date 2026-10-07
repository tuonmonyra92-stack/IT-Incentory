import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup';
import { Asset } from '../../types/asset';
import { calculateAssetOverviewChart } from '../../services/storage';

interface Props {
  assets: Asset[];
  isDark: boolean;
}

export const AssetOverviewChart: React.FC<Props> = ({ assets, isDark }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m' | '1y'>('6m');

  const { labels, total, purchased, retired } = calculateAssetOverviewChart(assets, timeframe);

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Assets',
        data: total,
        borderColor: '#4f46e5', // indigo-600
        backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Purchased Assets',
        data: purchased,
        borderColor: '#06b6d4', // cyan-500
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#06b6d4'
      },
      {
        label: 'Retired Assets',
        data: retired,
        borderColor: '#ef4444', // red-500
        backgroundColor: 'transparent',
        borderDash: [3, 3],
        tension: 0.3,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#ef4444'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 10,
        boxPadding: 6,
        usePointStyle: true,
        borderColor: isDark ? '#334155' : '#475569',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
            family: "'Plus Jakarta Sans', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor,
          stepSize: 5,
          font: {
            size: 11,
            family: "'Plus Jakarta Sans', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Asset Overview</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Asset growth, newly commissioned hardware, and lifecycle retirements
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(
            [
              { key: '7d', label: 'Last 7 Days' },
              { key: '30d', label: 'Last 30 Days' },
              { key: '6m', label: 'Last 6 Months' },
              { key: '1y', label: 'This Year' }
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => setTimeframe(tab.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                timeframe === tab.key
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Total Assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-cyan-500 border-b-2 border-dashed border-cyan-500"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Purchased</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-500 border-b-2 border-dashed border-red-500"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Retired</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
