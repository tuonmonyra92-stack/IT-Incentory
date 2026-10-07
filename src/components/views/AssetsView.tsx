import React, { useState, useMemo } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../../types/asset';
import {
  ALL_CATEGORIES,
  ALL_STATUSES,
  ALL_LOCATIONS,
  formatCurrency,
  downloadCSV
} from '../../services/storage';
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X
} from 'lucide-react';

interface Props {
  assets: Asset[];
  onOpenAddModal: () => void;
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  initialCategoryFilter?: AssetCategory | null;
  initialUserFilter?: string | null;
}

export const AssetsView: React.FC<Props> = ({
  assets,
  onOpenAddModal,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  initialCategoryFilter,
  initialUserFilter
}) => {
  const [searchQuery, setSearchQuery] = useState(initialUserFilter || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortField, setSortField] = useState<'model' | 'price' | 'purchaseDate' | 'warrantyExpiry'>('purchaseDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter & Sort Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter(asset => {
        if (selectedCategory !== 'all' && asset.device !== selectedCategory) return false;
        if (selectedStatus !== 'all' && asset.status !== selectedStatus) return false;
        if (selectedLocation !== 'all' && asset.location !== selectedLocation) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            asset.model.toLowerCase().includes(q) ||
            asset.serialNumber.toLowerCase().includes(q) ||
            asset.userName.toLowerCase().includes(q) ||
            asset.jobTitle.toLowerCase().includes(q) ||
            asset.location.toLowerCase().includes(q) ||
            asset.vendor.toLowerCase().includes(q) ||
            asset.capacity.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'price') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        } else {
          valA = String(valA || '').toLowerCase();
          valB = String(valB || '').toLowerCase();
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [assets, searchQuery, selectedCategory, selectedStatus, selectedLocation, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredAssets.length / pageSize) || 1;
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'model' | 'price' | 'purchaseDate' | 'warrantyExpiry') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Assigned
          </span>
        );
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Available
          </span>
        );
      case 'In Repair':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            In Repair
          </span>
        );
      case 'Retired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Retired
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card with Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              IT Assets Inventory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive hardware registry with serial tracking, assignment records, and warranty lifecycles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => downloadCSV(filteredAssets)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV ({filteredAssets.length})</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Asset</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search assets, users, S/N..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Device Categories</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <select
              value={selectedLocation}
              onChange={e => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Locations</option>
              {ALL_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th
                  onClick={() => toggleSort('model')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Model / Asset</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Serial Number</th>
                <th className="py-3 px-3 font-semibold">Hardware Capacity</th>
                <th className="py-3 px-3 font-semibold">Assigned User</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th
                  onClick={() => toggleSort('purchaseDate')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Purchase Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('warrantyExpiry')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Warranty</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 pr-4 pl-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    No IT assets matched your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map(asset => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Model */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewAsset(asset)}
                        className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        {asset.model}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {asset.vendor}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {asset.device}
                      </span>
                    </td>

                    {/* Serial Number */}
                    <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {asset.serialNumber}
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 max-w-44 truncate">
                      {asset.capacity || '—'}
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {asset.userName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {asset.jobTitle}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {asset.location}
                    </td>

                    {/* Purchase Date */}
                    <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {asset.purchaseDate || '—'}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(asset.price)}
                    </td>

                    {/* Warranty Expiry */}
                    <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {asset.warrantyExpiry || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      {getStatusBadge(asset.status)}
                    </td>

                    {/* Actions */}
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
                          title="Edit Asset"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAsset(asset)}
                          title="Delete Asset"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-800 dark:text-white">
              {filteredAssets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800 dark:text-white">
              {Math.min(currentPage * pageSize, filteredAssets.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800 dark:text-white">
              {filteredAssets.length}
            </span>{' '}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
