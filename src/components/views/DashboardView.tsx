import React from 'react';
import { Asset, CategorySummary, DashboardStats, UserSummary, WarrantyAlertItem } from '../../types/asset';
import { SummaryCards } from '../SummaryCards';
import { AssetOverviewChart } from '../charts/AssetOverviewChart';
import { AssetDistributionChart } from '../charts/AssetDistributionChart';
import { AssetTransactionsChart } from '../charts/AssetTransactionsChart';
import { LocationChart } from '../charts/LocationChart';
import { WarrantyAlertCard } from '../WarrantyAlertCard';
import { TopUsersCard } from '../TopUsersCard';
import { InventoryOverviewTable } from '../InventoryOverviewTable';
import { DeviceStatisticsGrid } from '../DeviceStatisticsGrid';
import { RecentAssetsTable } from '../RecentAssetsTable';

interface Props {
  assets: Asset[];
  stats: DashboardStats;
  alerts: WarrantyAlertItem[];
  inventory: CategorySummary[];
  topUsers: UserSummary[];
  isDark: boolean;
  onNavigateToTab: (tab: any) => void;
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  onSelectUserFilter?: (userName: string) => void;
  onSelectCategoryFilter?: (category: any) => void;
}

export const DashboardView: React.FC<Props> = ({
  assets,
  stats,
  alerts,
  inventory,
  topUsers,
  isDark,
  onNavigateToTab,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  onSelectUserFilter,
  onSelectCategoryFilter
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Summary Cards (4 Cards) */}
      <SummaryCards
        stats={stats}
        onWarrantyCardClick={() => onNavigateToTab('warranty')}
        onActiveCardClick={() => onNavigateToTab('assets')}
      />

      {/* 2. Asset Analytics (Two Column: Asset Overview + Asset Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetOverviewChart assets={assets} isDark={isDark} />
        </div>
        <div className="lg:col-span-1">
          <AssetDistributionChart assets={assets} isDark={isDark} />
        </div>
      </div>

      {/* 3. Asset Transactions Bar Chart */}
      <AssetTransactionsChart assets={assets} isDark={isDark} />

      {/* 4. Warranty Alert & Top Users (2 Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WarrantyAlertCard
          alerts={alerts}
          onViewAll={() => onNavigateToTab('warranty')}
          onSelectAsset={onViewAsset}
        />
        <TopUsersCard
          users={topUsers}
          onSelectUser={onSelectUserFilter}
          onViewAll={() => onNavigateToTab('users')}
        />
      </div>

      {/* 5. Inventory Overview Table */}
      <InventoryOverviewTable
        inventory={inventory}
        onSelectCategory={onSelectCategoryFilter}
      />

      {/* 6. Device Statistics Grid */}
      <DeviceStatisticsGrid
        assets={assets}
        onSelectCategory={onSelectCategoryFilter}
      />

      {/* 7. Location / Area Analytics & Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LocationChart assets={assets} isDark={isDark} />
        </div>
        <div className="lg:col-span-2">
          <RecentAssetsTable
            assets={assets}
            onViewAll={() => onNavigateToTab('assets')}
            onViewAsset={onViewAsset}
            onEditAsset={onEditAsset}
            onDeleteAsset={onDeleteAsset}
          />
        </div>
      </div>
    </div>
  );
};
