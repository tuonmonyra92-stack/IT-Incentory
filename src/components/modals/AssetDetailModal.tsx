import React from 'react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../services/storage';
import {
  X,
  Laptop,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Shield,
  Building,
  Tag,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface Props {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onStatusChange?: (assetId: string, newStatus: any) => void;
}

export const AssetDetailModal: React.FC<Props> = ({
  asset,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!isOpen || !asset) return null;

  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let daysRemaining: number | null = null;
  let warrantyBadge = null;

  if (asset.warrantyExpiry) {
    const expiry = new Date(asset.warrantyExpiry);
    expiry.setHours(0, 0, 0, 0);
    daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      warrantyBadge = (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-3.5 h-3.5" />
          Expired ({Math.abs(daysRemaining)} days ago)
        </span>
      );
    } else if (daysRemaining <= 30) {
      warrantyBadge = (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
          <Clock className="w-3.5 h-3.5" />
          Expiring Soon ({daysRemaining} days left)
        </span>
      );
    } else {
      warrantyBadge = (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active Coverage ({daysRemaining} days remaining)
        </span>
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {asset.device}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {asset.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {asset.model}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                OEM: {asset.vendor}
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

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Warranty Alert Banner */}
          {warrantyBadge && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Warranty Status:</span>
              </div>
              <div>{warrantyBadge}</div>
            </div>
          )}

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" /> Serial Number
              </span>
              <div className="mt-1 font-mono font-semibold text-xs text-slate-900 dark:text-white truncate">
                {asset.serialNumber}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> Hardware Specs
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-900 dark:text-white truncate">
                {asset.capacity || 'Standard Spec'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Asset Value
              </span>
              <div className="mt-1 font-mono font-bold text-sm text-slate-900 dark:text-white">
                {formatCurrency(asset.price)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Purchase Date
              </span>
              <div className="mt-1 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                {asset.purchaseDate}
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Assignment & Location
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> Assigned Custodian
                </span>
                <p className="font-semibold text-slate-800 dark:text-white mt-0.5">
                  {asset.userName}
                </p>
                <p className="text-[11px] text-slate-500">{asset.jobTitle}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Area / Department
                </span>
                <p className="font-semibold text-slate-800 dark:text-white mt-0.5">
                  {asset.location}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Operational Status:
            </span>
            <div className="flex items-center gap-1.5">
              {(['Active', 'Assigned', 'Available', 'In Repair', 'Retired'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => onStatusChange && onStatusChange(asset.id, st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    asset.status === st
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          {asset.notes && (
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Configuration & Notes:
              </span>
              <p className="mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                {asset.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={() => onDelete(asset)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Asset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(asset)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
