import React from 'react';
import { Asset } from '../../types/asset';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onConfirm: (assetId: string) => void;
}

export const DeleteConfirmModal: React.FC<Props> = ({ isOpen, asset, onClose, onConfirm }) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Delete IT Asset?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{asset.model}</strong> ({asset.serialNumber})? This will remove this hardware entry from LocalStorage and recalculate all metrics.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Custodian:</span>
            <span className="font-semibold text-slate-800 dark:text-white">{asset.userName}</span>
          </div>
          <div className="flex justify-between text-slate-500 mt-1">
            <span>Location:</span>
            <span className="font-semibold text-slate-800 dark:text-white">{asset.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(asset.id)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
