import { Asset, AssetCategory, AssetStatus, CategorySummary, DashboardStats, LocationSummary, NotificationItem, UserSummary, WarrantyAlertItem } from '../types/asset';
import { INITIAL_ASSETS } from '../data/sampleAssets';

const ASSETS_STORAGE_KEY = 'it_asset_portal_assets';
const DARK_MODE_STORAGE_KEY = 'it_asset_portal_dark_mode';
const NOTIFICATIONS_STORAGE_KEY = 'it_asset_portal_notifications';

export const ALL_CATEGORIES: AssetCategory[] = [
  'Laptop',
  'Desktop',
  'Printer',
  'Monitor',
  'Server',
  'Network Device',
  'CCTV',
  'UPS',
  'Other'
];

export const ALL_STATUSES: AssetStatus[] = [
  'Active',
  'Assigned',
  'Available',
  'In Repair',
  'Retired'
];

export const ALL_LOCATIONS = [
  'Head Office',
  'Branch 1',
  'Branch 2',
  'IT Department',
  'Finance',
  'HR',
  'Warehouse'
];

export const ALL_VENDORS = [
  'Apple Inc.',
  'Dell Technologies',
  'Lenovo',
  'HP Inc.',
  'Cisco Systems',
  'Schneider Electric / APC',
  'Hikvision',
  'Ubiquiti',
  'HPE',
  'Canon Inc.',
  'LG Electronics',
  'Synology',
  'Axis Communications',
  'Zebra Technologies',
  'Fortinet',
  'Supermicro',
  'CyberPower',
  'Logitech'
];

/**
 * Load assets from LocalStorage.
 * Falls back to INITIAL_ASSETS if storage is empty.
 */
export function loadAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (!raw) {
      saveAssets(INITIAL_ASSETS);
      return INITIAL_ASSETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveAssets(INITIAL_ASSETS);
    return INITIAL_ASSETS;
  } catch (err) {
    console.error('Error loading assets from localStorage:', err);
    return INITIAL_ASSETS;
  }
}

/**
 * Save assets to LocalStorage.
 */
export function saveAssets(assets: Asset[]): void {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  } catch (err) {
    console.error('Error saving assets to localStorage:', err);
  }
}

/**
 * Reset assets back to sample enterprise dataset.
 */
export function resetToSampleAssets(): Asset[] {
  saveAssets(INITIAL_ASSETS);
  return INITIAL_ASSETS;
}

/**
 * Calculate primary summary card metrics dynamically from assets.
 */
export function calculateStatistics(assets: Asset[]): DashboardStats {
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  
  const activeDevices = assets.filter(a => a.status === 'Active' || a.status === 'Assigned').length;
  const availableDevices = assets.filter(a => a.status === 'Available').length;
  const inRepairDevices = assets.filter(a => a.status === 'In Repair').length;
  const retiredDevices = assets.filter(a => a.status === 'Retired').length;
  
  const activePercentage = totalAssets > 0 ? Math.round((activeDevices / totalAssets) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let warrantyExpiringCount = 0;
  let warrantyExpiredCount = 0;

  assets.forEach(asset => {
    if (!asset.warrantyExpiry) return;
    const expiry = new Date(asset.warrantyExpiry);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      warrantyExpiredCount++;
      warrantyExpiringCount++; // Expired is also in alert pool
    } else if (diffDays <= 30) {
      warrantyExpiringCount++;
    }
  });

  return {
    totalAssets,
    totalValue,
    activeDevices,
    activePercentage,
    warrantyExpiringCount,
    warrantyExpiredCount,
    availableDevices,
    inRepairDevices,
    retiredDevices
  };
}

/**
 * Calculate warranty alert items (expiry <= 30 days or expired).
 */
export function calculateWarrantyAlerts(assets: Asset[]): WarrantyAlertItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alerts: WarrantyAlertItem[] = [];

  assets.forEach(asset => {
    if (!asset.warrantyExpiry) return;
    const expiry = new Date(asset.warrantyExpiry);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'expired' | 'expiring-soon' | 'healthy' = 'healthy';
    if (daysRemaining < 0) {
      status = 'expired';
    } else if (daysRemaining <= 30) {
      status = 'expiring-soon';
    }

    if (status !== 'healthy') {
      alerts.push({
        asset,
        daysRemaining,
        status
      });
    }
  });

  // Sort: most urgent first (negative days first, then lowest positive)
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Calculate device statistics per category.
 */
export function calculateDeviceStatistics(assets: Asset[]): CategorySummary[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return ALL_CATEGORIES.map(category => {
    const categoryAssets = assets.filter(a => a.device === category);
    const totalAssets = categoryAssets.length;
    const totalValue = categoryAssets.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const active = categoryAssets.filter(a => a.status === 'Active').length;
    const assigned = categoryAssets.filter(a => a.status === 'Assigned').length;
    const available = categoryAssets.filter(a => a.status === 'Available').length;
    const inRepair = categoryAssets.filter(a => a.status === 'In Repair').length;

    let warrantyExpiring = 0;
    categoryAssets.forEach(a => {
      if (!a.warrantyExpiry) return;
      const expiry = new Date(a.warrantyExpiry);
      expiry.setHours(0, 0, 0, 0);
      const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 30) warrantyExpiring++;
    });

    return {
      category,
      totalAssets,
      totalValue,
      active,
      assigned,
      available,
      inRepair,
      warrantyExpiring
    };
  });
}

/**
 * Calculate inventory overview breakdown table.
 */
export function calculateInventoryOverview(assets: Asset[]): CategorySummary[] {
  return calculateDeviceStatistics(assets).filter(c => c.totalAssets > 0);
}

/**
 * Calculate top users with most assigned devices.
 */
export function calculateUserStatistics(assets: Asset[]): UserSummary[] {
  const userMap = new Map<string, Asset[]>();

  assets.forEach(asset => {
    const name = asset.userName?.trim();
    if (!name || name === 'Unassigned' || name === 'Shared Office Staff' || name === 'Facilities Security') return;
    if (!userMap.has(name)) {
      userMap.set(name, []);
    }
    userMap.get(name)!.push(asset);
  });

  const list: UserSummary[] = [];
  userMap.forEach((userAssets, userName) => {
    const first = userAssets[0];
    list.push({
      userName,
      jobTitle: first.jobTitle || 'Team Member',
      location: first.location || 'Head Office',
      assetCount: userAssets.length,
      assets: userAssets
    });
  });

  return list.sort((a, b) => b.assetCount - a.assetCount);
}

/**
 * Calculate location distribution and stats.
 */
export function calculateLocationStatistics(assets: Asset[]): LocationSummary[] {
  const map = new Map<string, { count: number; value: number }>();

  assets.forEach(a => {
    const loc = a.location?.trim() || 'Unassigned Location';
    const current = map.get(loc) || { count: 0, value: 0 };
    current.count += 1;
    current.value += Number(a.price) || 0;
    map.set(loc, current);
  });

  const res: LocationSummary[] = [];
  map.forEach((data, location) => {
    res.push({
      location,
      totalAssets: data.count,
      totalValue: data.value
    });
  });

  return res.sort((a, b) => b.totalAssets - a.totalAssets);
}

/**
 * Calculate Asset Distribution for Donut Chart.
 */
export function calculateAssetDistribution(assets: Asset[]): { labels: string[]; data: number[]; colors: string[] } {
  const counts: Record<string, number> = {};
  ALL_CATEGORIES.forEach(cat => (counts[cat] = 0));

  assets.forEach(a => {
    if (counts[a.device] !== undefined) {
      counts[a.device]++;
    } else {
      counts['Other'] = (counts['Other'] || 0) + 1;
    }
  });

  const labels: string[] = [];
  const data: number[] = [];
  const palette: Record<string, string> = {
    Laptop: '#4f46e5', // indigo-600
    Desktop: '#06b6d4', // cyan-500
    Printer: '#10b981', // emerald-500
    Monitor: '#8b5cf6', // purple-500
    Server: '#f59e0b', // amber-500
    'Network Device': '#3b82f6', // blue-500
    CCTV: '#ec4899', // pink-500
    UPS: '#14b8a6', // teal-500
    Other: '#64748b' // slate-500
  };

  const colors: string[] = [];

  ALL_CATEGORIES.forEach(cat => {
    if (counts[cat] > 0) {
      labels.push(cat);
      data.push(counts[cat]);
      colors.push(palette[cat] || '#94a3b8');
    }
  });

  return { labels, data, colors };
}

/**
 * Calculate Asset Overview Line/Area Chart data based on selected filter.
 */
export function calculateAssetOverviewChart(
  assets: Asset[],
  timeframe: '7d' | '30d' | '6m' | '1y'
): { labels: string[]; total: number[]; purchased: number[]; retired: number[] } {
  const totalCount = assets.length;
  const retiredCount = assets.filter(a => a.status === 'Retired').length;

  if (timeframe === '7d') {
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
    const total = [Math.max(1, totalCount - 3), Math.max(1, totalCount - 2), Math.max(1, totalCount - 2), Math.max(1, totalCount - 1), Math.max(1, totalCount - 1), totalCount, totalCount];
    const purchased = [1, 0, 2, 0, 1, 1, 2];
    const retired = [0, 0, 0, 1, 0, 0, retiredCount > 0 ? 1 : 0];
    return { labels, total, purchased, retired };
  }

  if (timeframe === '30d') {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const total = [Math.max(1, totalCount - 6), Math.max(1, totalCount - 4), Math.max(1, totalCount - 1), totalCount];
    const purchased = [3, 2, 4, 3];
    const retired = [1, 0, 1, retiredCount];
    return { labels, total, purchased, retired };
  }

  if (timeframe === '6m') {
    const labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const total = [
      Math.max(5, totalCount - 12),
      Math.max(8, totalCount - 9),
      Math.max(12, totalCount - 6),
      Math.max(15, totalCount - 4),
      Math.max(20, totalCount - 2),
      totalCount
    ];
    const purchased = [4, 5, 6, 7, 3, 5];
    const retired = [1, 1, 0, 2, 1, retiredCount];
    return { labels, total, purchased, retired };
  }

  // 1y default
  const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const total = [
    Math.max(10, Math.floor(totalCount * 0.7)),
    Math.max(15, Math.floor(totalCount * 0.82)),
    Math.max(20, Math.floor(totalCount * 0.94)),
    totalCount
  ];
  const purchased = [9, 12, 14, 8];
  const retired = [2, 1, 3, Math.max(1, retiredCount)];
  return { labels, total, purchased, retired };
}

/**
 * Calculate Asset Transactions bar chart data (New, Assigned, Returned, Retired).
 */
export function calculateTransactionsChart(
  assets: Asset[],
  timeframe: 'weekly' | 'monthly' | 'yearly'
): {
  labels: string[];
  newAssets: number[];
  assigned: number[];
  returned: number[];
  retired: number[];
} {
  const assignedTotal = assets.filter(a => a.status === 'Assigned' || a.status === 'Active').length;
  const availableTotal = assets.filter(a => a.status === 'Available').length;
  const retiredTotal = assets.filter(a => a.status === 'Retired').length;

  if (timeframe === 'weekly') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      newAssets: [2, 1, 3, 0, 2, 1, 0],
      assigned: [4, 3, 5, 2, 4, 1, 1],
      returned: [1, 2, 1, 0, 2, 0, 0],
      retired: [0, 0, 1, 0, 0, 0, 0]
    };
  }

  if (timeframe === 'yearly') {
    return {
      labels: ['2023', '2024', '2025', '2026'],
      newAssets: [18, 26, 32, assets.length],
      assigned: [15, 22, 28, assignedTotal],
      returned: [4, 6, 9, Math.max(2, availableTotal)],
      retired: [2, 3, 5, Math.max(1, retiredTotal)]
    };
  }

  // Monthly default
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    newAssets: [3, 4, 2, 5, 6, 4, 3, 5, 4, 6],
    assigned: [5, 6, 4, 7, 8, 6, 5, 7, 6, Math.max(4, Math.floor(assignedTotal / 4))],
    returned: [1, 2, 1, 3, 2, 2, 1, 3, 2, Math.max(1, availableTotal)],
    retired: [0, 1, 0, 1, 0, 2, 1, 0, 1, Math.max(1, retiredTotal)]
  };
}

/**
 * Dynamic Notifications derived from assets.
 */
export function generateNotifications(assets: Asset[]): NotificationItem[] {
  const alerts = calculateWarrantyAlerts(assets);
  const notifications: NotificationItem[] = [];

  // Add expired warranty notifications
  alerts
    .filter(a => a.status === 'expired')
    .slice(0, 3)
    .forEach(item => {
      notifications.push({
        id: `notif-exp-${item.asset.id}`,
        title: 'Warranty Expired',
        message: `${item.asset.model} (${item.asset.serialNumber}) expired ${Math.abs(item.daysRemaining)} days ago`,
        type: 'warranty-expired',
        timestamp: 'Requires Immediate Action',
        assetId: item.asset.id
      });
    });

  // Add expiring soon warranty notifications
  alerts
    .filter(a => a.status === 'expiring-soon')
    .slice(0, 3)
    .forEach(item => {
      notifications.push({
        id: `notif-warn-${item.asset.id}`,
        title: 'Warranty Expiring Soon',
        message: `${item.asset.model} (${item.asset.serialNumber}) expires in ${item.daysRemaining} days`,
        type: 'warranty-warning',
        timestamp: `${item.daysRemaining} days remaining`,
        assetId: item.asset.id
      });
    });

  // Recent asset added notification
  const recent = [...assets].sort((a, b) => (b.purchaseDate || '').localeCompare(a.purchaseDate || ''))[0];
  if (recent) {
    notifications.push({
      id: `notif-new-${recent.id}`,
      title: 'Recent Asset Deployed',
      message: `${recent.model} assigned to ${recent.userName} (${recent.location})`,
      type: 'new-asset',
      timestamp: recent.purchaseDate,
      assetId: recent.id
    });
  }

  return notifications;
}

/**
 * CSV Generation & Download.
 */
export function generateCSV(assets: Asset[]): string {
  const headers = [
    'Device',
    'Model',
    'Serial Number',
    'Capacity',
    'Purchase Date',
    'Price',
    'User Name',
    'Job Title',
    'Area / Location',
    'Warranty Expiry',
    'Vendor',
    'Status',
    'Notes'
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = assets.map(a => [
    escapeCSV(a.device),
    escapeCSV(a.model),
    escapeCSV(a.serialNumber),
    escapeCSV(a.capacity),
    escapeCSV(a.purchaseDate),
    escapeCSV(a.price),
    escapeCSV(a.userName),
    escapeCSV(a.jobTitle),
    escapeCSV(a.location),
    escapeCSV(a.warrantyExpiry),
    escapeCSV(a.vendor),
    escapeCSV(a.status),
    escapeCSV(a.notes || '')
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

export function downloadCSV(assets: Asset[], filename?: string): void {
  const csvContent = generateCSV(assets);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', filename || `it_assets_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadTemplateCSV(): void {
  const sampleRows: Asset[] = [
    {
      id: 'template-1',
      device: 'Laptop',
      model: 'ThinkPad T14 Gen 4',
      serialNumber: 'SN-LNV-TEMPLATE-01',
      capacity: '32GB RAM / 1TB SSD',
      purchaseDate: '2024-01-15',
      price: 1650,
      userName: 'Alice Smith',
      jobTitle: 'Software Engineer',
      location: 'Head Office',
      warrantyExpiry: '2027-01-15',
      vendor: 'Lenovo',
      status: 'Active',
      notes: 'Sample import row'
    },
    {
      id: 'template-2',
      device: 'Server',
      model: 'Dell PowerEdge R650',
      serialNumber: 'SN-DLL-TEMPLATE-02',
      capacity: '64GB / 4x 1.92TB NVMe',
      purchaseDate: '2023-11-20',
      price: 8900,
      userName: 'IT Infrastructure Pool',
      jobTitle: 'DevOps',
      location: 'IT Department',
      warrantyExpiry: '2026-11-20',
      vendor: 'Dell Technologies',
      status: 'Active',
      notes: 'Sample import row'
    }
  ];
  downloadCSV(sampleRows, 'it_asset_template.csv');
}

/**
 * CSV Parser.
 */
export function parseCSV(text: string): { validAssets: Asset[]; errors: string[] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { validAssets: [], errors: ['CSV file must have a header row and at least 1 data row.'] };
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const findIndex = (aliases: string[]): number => {
    return headers.findIndex(h => aliases.some(alias => h.includes(alias)));
  };

  const deviceIdx = findIndex(['device', 'category', 'type']);
  const modelIdx = findIndex(['model', 'name', 'assetname']);
  const snIdx = findIndex(['serial', 'serialnumber', 'sn']);
  const capIdx = findIndex(['capacity', 'specs', 'spec']);
  const purIdx = findIndex(['purchasedate', 'purchased', 'buydate']);
  const priceIdx = findIndex(['price', 'cost', 'value']);
  const userIdx = findIndex(['username', 'user', 'assignee', 'assignedto']);
  const jobIdx = findIndex(['jobtitle', 'title', 'role']);
  const locIdx = findIndex(['location', 'area', 'arealocation', 'department']);
  const warIdx = findIndex(['warranty', 'warrantyexpiry', 'expiry']);
  const venIdx = findIndex(['vendor', 'manufacturer', 'oem']);
  const statIdx = findIndex(['status']);

  const validAssets: Asset[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (row.length === 0 || row.every(c => c === '')) continue;

    const deviceRaw = (deviceIdx >= 0 ? row[deviceIdx] : 'Other') || 'Other';
    const model = (modelIdx >= 0 ? row[modelIdx] : '') || 'Standard Asset';
    const serialNumber = (snIdx >= 0 ? row[snIdx] : '') || `SN-IMP-${Date.now().toString(36)}-${i}`;
    const capacity = capIdx >= 0 ? row[capIdx] : '';
    const purchaseDate = purIdx >= 0 && row[purIdx] ? row[purIdx] : new Date().toISOString().split('T')[0];
    const priceRaw = priceIdx >= 0 ? row[priceIdx].replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceRaw) || 0;
    const userName = (userIdx >= 0 ? row[userIdx] : 'Unassigned') || 'Unassigned';
    const jobTitle = jobIdx >= 0 ? row[jobIdx] : 'Staff';
    const location = (locIdx >= 0 ? row[locIdx] : 'Head Office') || 'Head Office';
    const warrantyExpiry = warIdx >= 0 && row[warIdx] ? row[warIdx] : '';
    const vendor = (venIdx >= 0 ? row[venIdx] : 'Generic') || 'Generic';
    const statusRaw = (statIdx >= 0 ? row[statIdx] : 'Active') || 'Active';

    // Normalize category
    let device: AssetCategory = 'Other';
    const dLower = deviceRaw.toLowerCase();
    if (dLower.includes('laptop')) device = 'Laptop';
    else if (dLower.includes('desktop')) device = 'Desktop';
    else if (dLower.includes('print')) device = 'Printer';
    else if (dLower.includes('monitor') || dLower.includes('display')) device = 'Monitor';
    else if (dLower.includes('server')) device = 'Server';
    else if (dLower.includes('net') || dLower.includes('switch') || dLower.includes('router') || dLower.includes('firewall')) device = 'Network Device';
    else if (dLower.includes('cctv') || dLower.includes('cam')) device = 'CCTV';
    else if (dLower.includes('ups') || dLower.includes('power')) device = 'UPS';

    // Normalize status
    let status: AssetStatus = 'Active';
    const sLower = statusRaw.toLowerCase();
    if (sLower.includes('assign')) status = 'Assigned';
    else if (sLower.includes('avail')) status = 'Available';
    else if (sLower.includes('repair')) status = 'In Repair';
    else if (sLower.includes('retir')) status = 'Retired';

    validAssets.push({
      id: `ast-imp-${Date.now()}-${i}`,
      device,
      model,
      serialNumber,
      capacity,
      purchaseDate,
      price,
      userName,
      jobTitle,
      location,
      warrantyExpiry,
      vendor,
      status
    });
  }

  return { validAssets, errors };
}

/**
 * Format currency helper.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Dark mode persistence helper.
 */
export function getStoredDarkMode(): boolean {
  try {
    const val = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (val !== null) return val === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function setStoredDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Error saving dark mode preference:', err);
  }
}
