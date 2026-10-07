import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Asset, AssetCategory, AssetStatus, DashboardStats } from './types/asset';
import {
  loadAssets,
  saveAssets,
  resetToSampleAssets,
  calculateStatistics,
  calculateWarrantyAlerts,
  calculateDeviceStatistics,
  calculateLocationStatistics,
  calculateUserStatistics,
  calculateInventoryOverview,
  generateNotifications,
  getStoredDarkMode,
  setStoredDarkMode
} from './services/storage';

// Components
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { AssetsView } from './components/views/AssetsView';
import { DevicesView } from './components/views/DevicesView';
import { UsersView } from './components/views/UsersView';
import { VendorsView } from './components/views/VendorsView';
import { WarrantyView } from './components/views/WarrantyView';
import { ReportsView } from './components/views/ReportsView';
import { ImportExportView } from './components/views/ImportExportView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { AssetModal } from './components/modals/AssetModal';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Primary State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial filters for navigation jumping
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<AssetCategory | null>(null);
  const [initialUserFilter, setInitialUserFilter] = useState<string | null>(null);

  // Load Initial Assets and Dark Mode
  useEffect(() => {
    const loaded = loadAssets();
    setAssets(loaded);

    const dark = getStoredDarkMode();
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Dark Mode Toggle
  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      setStoredDarkMode(next);
      return next;
    });
  }, []);

  // Central recalculations: triggered whenever assets state updates!
  const stats = useMemo<DashboardStats>(() => calculateStatistics(assets), [assets]);
  const alerts = useMemo(() => calculateWarrantyAlerts(assets), [assets]);
  const inventory = useMemo(() => calculateInventoryOverview(assets), [assets]);
  const topUsers = useMemo(() => calculateUserStatistics(assets), [assets]);
  const notifications = useMemo(() => generateNotifications(assets), [assets]);

  // CRUD Handlers
  const handleSaveAsset = (savedAsset: Asset) => {
    let updated: Asset[];
    const exists = assets.some(a => a.id === savedAsset.id);

    if (exists) {
      updated = assets.map(a => (a.id === savedAsset.id ? savedAsset : a));
      showToast(`Asset "${savedAsset.model}" updated successfully.`);
    } else {
      updated = [savedAsset, ...assets];
      showToast(`Asset "${savedAsset.model}" added successfully.`);
    }

    setAssets(updated);
    saveAssets(updated);
    setIsAddEditModalOpen(false);
    setEditingAsset(null);

    // If detail modal is open for this asset, refresh it
    if (viewingAsset && viewingAsset.id === savedAsset.id) {
      setViewingAsset(savedAsset);
    }
  };

  const handleDeleteAssetConfirm = (assetId: string) => {
    const target = assets.find(a => a.id === assetId);
    const updated = assets.filter(a => a.id !== assetId);
    setAssets(updated);
    saveAssets(updated);
    setIsDeleteModalOpen(false);
    setDeletingAsset(null);
    setIsDetailModalOpen(false);
    setViewingAsset(null);
    showToast(`Asset "${target?.model || assetId}" deleted successfully.`);
  };

  const handleQuickStatusChange = (assetId: string, newStatus: AssetStatus) => {
    const updated = assets.map(a => (a.id === assetId ? { ...a, status: newStatus } : a));
    setAssets(updated);
    saveAssets(updated);
    if (viewingAsset && viewingAsset.id === assetId) {
      setViewingAsset({ ...viewingAsset, status: newStatus });
    }
    showToast(`Status updated to ${newStatus}.`);
  };

  const handleResetSampleData = () => {
    const reset = resetToSampleAssets();
    setAssets(reset);
    showToast('Reset database to sample enterprise assets.');
  };

  const handleClearAllData = () => {
    setAssets([]);
    saveAssets([]);
    showToast('All local asset records purged.');
  };

  const handleDataUpdated = (newAssets: Asset[], message: string) => {
    setAssets(newAssets);
    showToast(message);
  };

  // Cross-Navigation Helpers
  const handleSelectUserFilter = (userName: string) => {
    setInitialUserFilter(userName);
    setActiveTab('assets');
  };

  const handleSelectCategoryFilter = (category: AssetCategory) => {
    setInitialCategoryFilter(category);
    setActiveTab('assets');
  };

  const handleFilterVendorInAssets = (vendor: string) => {
    setInitialUserFilter(vendor); // passes search term
    setActiveTab('assets');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'IT Asset Management';
      case 'assets':
        return 'Assets Registry';
      case 'devices':
        return 'Device Statistics';
      case 'users':
        return 'User & Custodian Directory';
      case 'vendors':
        return 'Vendor Portfolio';
      case 'warranty':
        return 'Warranty Alert Center';
      case 'reports':
        return 'Financial & Audit Reports';
      case 'import-export':
        return 'CSV Import & Export';
      case 'settings':
        return 'System Settings';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          // reset transient filters if manual switch
          if (tab !== 'assets') {
            setInitialCategoryFilter(null);
            setInitialUserFilter(null);
          }
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        warrantyAlertCount={stats.warrantyExpiringCount}
        totalAssetsCount={stats.totalAssets}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <Header
          onToggleMobileNav={() => setIsMobileOpen(!isMobileOpen)}
          pageTitle={getPageTitle()}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          assets={assets}
          notifications={notifications}
          onOpenAddModal={() => {
            setEditingAsset(null);
            setIsAddEditModalOpen(true);
          }}
          onSelectAsset={asset => {
            setViewingAsset(asset);
            setIsDetailModalOpen(true);
          }}
        />

        {/* View Content Port */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              assets={assets}
              stats={stats}
              alerts={alerts}
              inventory={inventory}
              topUsers={topUsers}
              isDark={isDark}
              onNavigateToTab={tab => setActiveTab(tab)}
              onViewAsset={asset => {
                setViewingAsset(asset);
                setIsDetailModalOpen(true);
              }}
              onEditAsset={asset => {
                setEditingAsset(asset);
                setIsAddEditModalOpen(true);
              }}
              onDeleteAsset={asset => {
                setDeletingAsset(asset);
                setIsDeleteModalOpen(true);
              }}
              onSelectUserFilter={handleSelectUserFilter}
              onSelectCategoryFilter={handleSelectCategoryFilter}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView
              assets={assets}
              onOpenAddModal={() => {
                setEditingAsset(null);
                setIsAddEditModalOpen(true);
              }}
              onViewAsset={asset => {
                setViewingAsset(asset);
                setIsDetailModalOpen(true);
              }}
              onEditAsset={asset => {
                setEditingAsset(asset);
                setIsAddEditModalOpen(true);
              }}
              onDeleteAsset={asset => {
                setDeletingAsset(asset);
                setIsDeleteModalOpen(true);
              }}
              initialCategoryFilter={initialCategoryFilter}
              initialUserFilter={initialUserFilter}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesView
              assets={assets}
              onViewAsset={asset => {
                setViewingAsset(asset);
                setIsDetailModalOpen(true);
              }}
              onEditAsset={asset => {
                setEditingAsset(asset);
                setIsAddEditModalOpen(true);
              }}
              onDeleteAsset={asset => {
                setDeletingAsset(asset);
                setIsDeleteModalOpen(true);
              }}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              assets={assets}
              onViewAsset={asset => {
                setViewingAsset(asset);
                setIsDetailModalOpen(true);
              }}
              onFilterUserInAssets={handleSelectUserFilter}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsView
              assets={assets}
              onFilterVendorInAssets={handleFilterVendorInAssets}
            />
          )}

          {activeTab === 'warranty' && (
            <WarrantyView
              assets={assets}
              onViewAsset={asset => {
                setViewingAsset(asset);
                setIsDetailModalOpen(true);
              }}
              onEditAsset={asset => {
                setEditingAsset(asset);
                setIsAddEditModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView assets={assets} stats={stats} />
          )}

          {activeTab === 'import-export' && (
            <ImportExportView
              assets={assets}
              onDataUpdated={handleDataUpdated}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isDark={isDark}
              toggleDarkMode={toggleDarkMode}
              onResetSampleData={handleResetSampleData}
              onClearAllData={handleClearAllData}
              totalAssetsCount={assets.length}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Asset Modal */}
      <AssetModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        initialAsset={editingAsset}
      />

      {/* Asset Detail View Modal */}
      <AssetDetailModal
        asset={viewingAsset}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingAsset(null);
        }}
        onEdit={asset => {
          setIsDetailModalOpen(false);
          setEditingAsset(asset);
          setIsAddEditModalOpen(true);
        }}
        onDelete={asset => {
          setIsDetailModalOpen(false);
          setDeletingAsset(asset);
          setIsDeleteModalOpen(true);
        }}
        onStatusChange={handleQuickStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        asset={deletingAsset}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAsset(null);
        }}
        onConfirm={handleDeleteAssetConfirm}
      />
    </div>
  );
}
