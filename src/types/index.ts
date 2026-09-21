export type RequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Completed' | 'Rejected';

export interface ReliefRequest {
  id: string;
  requester: string;
  category: 'Typhoon Relief' | 'Earthquake Aid' | 'Medical Emergency' | 'Flood Recovery' | 'Food & Shelter';
  dateSubmitted: string;
  status: RequestStatus;
  assignedTo: string;
  amountRequested: number;
  location: string;
  description: string;
  attachments?: string[];
  timeline: {
    title: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  description: string;
  timestamp: string;
  status: 'Approved' | 'Pending' | 'Completed' | 'Updated';
}

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'Admin' | 'Field Manager' | 'Auditor' | 'Coordinator';
  status: 'Active' | 'Inactive';
  dateJoined: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export type CampaignType = 
  | 'Typhoon Relief'
  | 'Earthquake Aid'
  | 'Flood Recovery'
  | 'Medical Emergency'
  | 'Food & Shelter';

export interface DonationRecord {
  id: string;
  campaign: CampaignType;
  amount: number;
  donorType: string;
  timestamp: string;
  txHash: string;
  status: 'Confirmed On-Chain';
}

export interface DisbursementRecord {
  id: string;
  tokenId: string;
  officerName: string;
  category: CampaignType;
  itemsDisbursed: string;
  valueEquivalent: number;
  timestamp: string;
  location: string;
  status: 'Disbursed';
}

export interface FieldOfficerStation {
  id: string;
  officerName: string;
  email: string;
  role: string;
  assignedCategory: CampaignType;
  stationLocation: string;
  currentStock: number;
  maxCapacity: number;
  unitLabel: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'requests'
  | 'request-detail'
  | 'field-portal'
  | 'organizations'
  | 'reports'
  | 'notifications'
  | 'settings';
