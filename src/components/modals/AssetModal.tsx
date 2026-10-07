import React, { useState, useEffect } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../../types/asset';
import { ALL_CATEGORIES, ALL_STATUSES, ALL_LOCATIONS, ALL_VENDORS } from '../../services/storage';
import { X, Save, Plus, Laptop, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  initialAsset?: Asset | null;
}

export const AssetModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialAsset }) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    device: 'Laptop',
    model: '',
    serialNumber: '',
    capacity: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    price: 1200,
    userName: '',
    jobTitle: '',
    location: 'Head Office',
    warrantyExpiry: '',
    vendor: 'Dell Technologies',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialAsset) {
      setFormData({ ...initialAsset });
    } else {
      setFormData({
        device: 'Laptop',
        model: '',
        serialNumber: `SN-AST-${Date.now().toString(36).toUpperCase()}`,
        capacity: '32GB RAM / 1TB SSD',
        purchaseDate: new Date().toISOString().split('T')[0],
        price: 1499,
        userName: '',
        jobTitle: '',
        location: 'Head Office',
        warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vendor: 'Dell Technologies',
        status: 'Active',
        notes: ''
      });
    }
    setErrors({});
  }, [initialAsset, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.model?.trim()) err.model = 'Model name is required';
    if (!formData.serialNumber?.trim()) err.serialNumber = 'Serial number is required';
    if (formData.price === undefined || formData.price < 0) err.price = 'Valid price is required';
    if (!formData.purchaseDate) err.purchaseDate = 'Purchase date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedAsset: Asset = {
      id: initialAsset?.id || `ast-${Date.now()}`,
      device: (formData.device as AssetCategory) || 'Laptop',
      model: formData.model?.trim() || '',
      serialNumber: formData.serialNumber?.trim() || '',
      capacity: formData.capacity?.trim() || '',
      purchaseDate: formData.purchaseDate || '',
      price: Number(formData.price) || 0,
      userName: formData.userName?.trim() || 'Unassigned',
      jobTitle: formData.jobTitle?.trim() || 'Staff',
      location: formData.location || 'Head Office',
      warrantyExpiry: formData.warrantyExpiry || '',
      vendor: formData.vendor || 'Generic',
      status: (formData.status as AssetStatus) || 'Active',
      notes: formData.notes?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    onSave(savedAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {initialAsset ? <Laptop className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {initialAsset ? 'Edit IT Asset' : 'Add New IT Asset'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {initialAsset ? 'Update asset records and assignments' : 'Register a new equipment unit into the portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Device & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Device Category *
              </label>
              <select
                value={formData.device}
                onChange={e => setFormData({ ...formData, device: e.target.value as AssetCategory })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={formData.model || ''}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. MacBook Pro 16 M3 Max, Dell PowerEdge R750"
                className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.model ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.model && <p className="text-[11px] text-rose-500 mt-1">{errors.model}</p>}
            </div>
          </div>

          {/* Row 2: Serial Number & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Serial Number *
              </label>
              <input
                type="text"
                value={formData.serialNumber || ''}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g. SN-LNV-430912"
                className={`w-full text-xs font-mono rounded-xl border px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.serialNumber ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.serialNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.serialNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hardware Capacity / Specs
              </label>
              <input
                type="text"
                value={formData.capacity || ''}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="e.g. 64GB RAM / 1TB SSD, 48-Port PoE+"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Purchase Date & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Date *
              </label>
              <input
                type="date"
                value={formData.purchaseDate || ''}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {errors.purchaseDate && <p className="text-[11px] text-rose-500 mt-1">{errors.purchaseDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Price ($ USD) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.price ?? ''}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 2150"
                className="w-full text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Row 4: User Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned User Name
              </label>
              <input
                type="text"
                value={formData.userName || ''}
                onChange={e => setFormData({ ...formData, userName: e.target.value })}
                placeholder="e.g. Sarah Wilson (or 'Unassigned')"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Department
              </label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Senior DevOps, Product Design"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Row 5: Location & Warranty Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Area / Location *
              </label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {ALL_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Warranty Expiry Date</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="date"
                value={formData.warrantyExpiry || ''}
                onChange={e => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Row 6: Vendor & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Manufacturer
              </label>
              <input
                type="text"
                list="vendor-list"
                value={formData.vendor || ''}
                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="e.g. Dell Technologies, Apple, Cisco"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <datalist id="vendor-list">
                {ALL_VENDORS.map(v => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Status *
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {ALL_STATUSES.map(stat => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 7: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Configuration / Maintenance Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Dual monitor adapter, encrypted BitLocker volume, offsite backup target..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" />
              <span>{initialAsset ? 'Save Changes' : 'Create Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
