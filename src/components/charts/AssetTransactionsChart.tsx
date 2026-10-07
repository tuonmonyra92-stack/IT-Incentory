import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './chartSetup';
import { Asset } from '../../types/asset';
import { calculateTransactionsChart } from '../../services/storage';

interface Props {
  assets: Asset[];
  isDark: boolean;
}

export const AssetTransactionsChart: React.FC<Props> = ({ assets, isDark }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const { labels, newAssets, assigned, returned, retired } = calculateTransactionsChart(assets, timeframe);

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const data = {
    labels,
    datasets: [
      {
        label: 'New Assets',
        data: newAssets,
        backgroundColor: '#4f46e5', // indigo-600
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Assigned Assets',
        data: assigned,
        backgroundColor: '#06b6d4', // cyan-500
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Returned Assets',
        data: returned,
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Retired Assets',
        data: retired,
        backgroundColor: '#ef4444', // red-500
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        usePointStyle: true
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
          stepSize: 2,
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
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Asset Transactions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log of incoming acquisitions, reassignments, returns, and lifecycle deprecations
          </p>
        </div>

        {/* Weekly / Monthly / Yearly selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(
            [
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'yearly', label: 'Yearly' }
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => setTimeframe(tab.key)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
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

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-600"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">New Assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-500"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Assigned Assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Returned Assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Retired Assets</span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
