export type AssetCategory =
  | 'Laptop'
  | 'Desktop'
  | 'Printer'
  | 'Monitor'
  | 'Server'
  | 'Network Device'
  | 'CCTV'
  | 'UPS'
  | 'Other';

export type AssetStatus = 'Active' | 'Assigned' | 'Available' | 'In Repair' | 'Retired';

export interface Asset {
  id: string;
  device: AssetCategory;
  model: string;
  serialNumber: string;
  capacity: string;
  purchaseDate: string; // YYYY-MM-DD
  price: number;
  userName: string;
  jobTitle: string;
  location: string;
  warrantyExpiry: string; // YYYY-MM-DD
  vendor: string;
  status: AssetStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  activeDevices: number;
  activePercentage: number;
  warrantyExpiringCount: number;
  warrantyExpiredCount: number;
  availableDevices: number;
  inRepairDevices: number;
  retiredDevices: number;
}

export interface WarrantyAlertItem {
  asset: Asset;
  daysRemaining: number;
  status: 'expired' | 'expiring-soon' | 'healthy';
}

export interface CategorySummary {
  category: AssetCategory;
  totalAssets: number;
  totalValue: number;
  active: number;
  assigned: number;
  available: number;
  inRepair: number;
  warrantyExpiring: number;
}

export interface UserSummary {
  userName: string;
  jobTitle: string;
  location: string;
  assetCount: number;
  assets: Asset[];
}

export interface LocationSummary {
  location: string;
  totalAssets: number;
  totalValue: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warranty-expired' | 'warranty-warning' | 'new-asset' | 'status-change' | 'import-success';
  timestamp: string;
  assetId?: string;
  read?: boolean;
}
