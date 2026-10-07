import React, { useState, useRef } from 'react';
import { Asset } from '../../types/asset';
import {
  parseCSV,
  downloadCSV,
  downloadTemplateCSV,
  saveAssets,
  formatCurrency
} from '../../services/storage';
import {
  FileSpreadsheet,
  Upload,
  Download,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  assets: Asset[];
  onDataUpdated: (newAssets: Asset[], message: string) => void;
}

export const ImportExportView: React.FC<Props> = ({ assets, onDataUpdated }) => {
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [parsedPreview, setParsedPreview] = useState<Asset[] | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (text) {
        const { validAssets, errors } = parseCSV(text);
        setParsedPreview(validAssets);
        setParseErrors(errors);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleCommitImport = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;

    let finalAssets: Asset[] = [];
    if (importMode === 'merge') {
      finalAssets = [...assets, ...parsedPreview];
    } else {
      finalAssets = [...parsedPreview];
    }

    saveAssets(finalAssets);
    onDataUpdated(
      finalAssets,
      `Successfully imported ${parsedPreview.length} assets (${importMode === 'merge' ? 'Merged' : 'Replaced'}).`
    );
    setParsedPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
            CSV Data Import & Export Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bulk hardware ingestion, inventory migration, and RFC-4180 compliant spreadsheet exports
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadTemplateCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Download CSV Template</span>
          </button>

          <button
            onClick={() => downloadCSV(assets)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export All ({assets.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Import Dropzone */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Import Assets from CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select or drag-and-drop a CSV spreadsheet containing device records.
            </p>

            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-indigo-500 mb-3 opacity-90" />
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {fileName ? fileName : 'Click to browse or drop CSV here'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports RFC-4180 CSV with UTF-8 encoding
              </p>
            </div>

            {/* Import Mode: Merge vs Replace */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Import Behavior Strategy:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    importMode === 'merge'
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Merge Records</span>
                    {importMode === 'merge' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] font-normal text-slate-400 block mt-0.5">
                    Append new items to current ({assets.length} existing)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    importMode === 'replace'
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Replace Entirely</span>
                    {importMode === 'replace' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] font-normal text-slate-400 block mt-0.5">
                    Overwrite database with new CSV file
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          {parsedPreview && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {parsedPreview.length} valid rows ready for import
              </span>

              <button
                onClick={handleCommitImport}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all shadow-indigo-600/25"
              >
                <span>Commit {importMode === 'merge' ? 'Merge' : 'Replace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Format Documentation Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supported CSV Schema
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ensure your CSV file contains these header columns (case-insensitive):
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              Device, Model, Serial Number, Capacity, Purchase Date, Price, User Name, Job Title, Area / Location, Warranty Expiry, Vendor, Status
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>
                <strong className="text-slate-800 dark:text-white">Device:</strong> Laptop, Desktop, Printer, Monitor, Server, Network Device, CCTV, UPS, Other
              </li>
              <li>
                <strong className="text-slate-800 dark:text-white">Serial Number:</strong> Unique alphanumeric hardware serial
              </li>
              <li>
                <strong className="text-slate-800 dark:text-white">Dates:</strong> Standard ISO YYYY-MM-DD format (e.g. 2024-03-15)
              </li>
              <li>
                <strong className="text-slate-800 dark:text-white">Status:</strong> Active, Assigned, Available, In Repair, Retired
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Import Preview Table */}
      {parsedPreview && parsedPreview.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              CSV Parsing Preview ({parsedPreview.length} Assets)
            </h3>
            <span className="text-xs text-slate-400">Review before committing</span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="pb-2 pr-3">Model</th>
                  <th className="pb-2 px-3">Device</th>
                  <th className="pb-2 px-3">Serial Number</th>
                  <th className="pb-2 px-3">User</th>
                  <th className="pb-2 px-3">Location</th>
                  <th className="pb-2 px-3 text-right">Price</th>
                  <th className="pb-2 px-3">Warranty</th>
                  <th className="pb-2 pl-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parsedPreview.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-white">{item.model}</td>
                    <td className="py-2 px-3">{item.device}</td>
                    <td className="py-2 px-3 font-mono">{item.serialNumber}</td>
                    <td className="py-2 px-3">{item.userName}</td>
                    <td className="py-2 px-3">{item.location}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-3 font-mono">{item.warrantyExpiry || '—'}</td>
                    <td className="py-2 pl-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
