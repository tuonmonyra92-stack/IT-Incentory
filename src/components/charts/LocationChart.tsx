import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chartSetup';
import { Asset } from '../../types/asset';
import { calculateLocationStatistics, formatCurrency } from '../../services/storage';
import { Building2, MapPin } from 'lucide-react';

interface Props {
  assets: Asset[];
  isDark: boolean;
}

export const LocationChart: React.FC<Props> = ({ assets, isDark }) => {
  const locationStats = calculateLocationStatistics(assets);

  const labels = locationStats.map(l => l.location);
  const counts = locationStats.map(l => l.totalAssets);

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const data = {
    labels,
    datasets: [
      {
        label: 'Assets',
        data: counts,
        backgroundColor: '#6366f1', // indigo-500
        hoverBackgroundColor: '#4f46e5',
        borderRadius: 6,
        barThickness: 18
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
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
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          afterLabel: (context: any) => {
            const loc = locationStats[context.dataIndex];
            return loc ? `Total Value: ${formatCurrency(loc.totalValue)}` : '';
          }
        }
      }
    },
    scales: {
      x: {
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
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 500,
            family: "'Plus Jakarta Sans', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Assets by Location
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic and department distribution across enterprise sites
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {locationStats.length} Sites
        </span>
      </div>

      <div className="h-56 w-full">
        <Bar data={data} options={options} />
      </div>

      {/* Quick Location Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {locationStats.slice(0, 4).map(loc => (
          <div key={loc.location} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate font-medium">{loc.location}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">
                {loc.totalAssets}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {formatCurrency(loc.totalValue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
