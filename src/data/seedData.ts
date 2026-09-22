import { 
  ReliefRequest, 
  ActivityLog, 
  OrganizationUser, 
  NotificationItem,
  DonationRecord,
  DisbursementRecord,
  FieldOfficerStation
} from '../types';

export const initialRequests: ReliefRequest[] = [
  {
    id: 'REQ-1024',
    requester: 'Maria Santos (Verifiable ID)',
    category: 'Typhoon Relief',
    dateSubmitted: '2026-08-12',
    status: 'Approved',
    assignedTo: 'John Doe',
    amountRequested: 500,
    location: 'Cebu Province, Philippines',
    description: 'Emergency shelter material grant and medical supplies needed for 15 displaced families following Typhoon Carina.',
    attachments: ['shelter_assessment.pdf', 'disaster_verification.png'],
    timeline: [
      { title: 'Request Submitted', timestamp: '2026-08-12 08:30 AM', completed: true },
      { title: 'Under Local Review', timestamp: '2026-08-12 10:15 AM', completed: true },
      { title: 'Assigned to Field Manager (John Doe)', timestamp: '2026-08-12 11:00 AM', completed: true },
      { title: 'Approved by Admin Committee', timestamp: '2026-08-12 02:45 PM', completed: true },
      { title: 'Aid Grant Disbursed via Midnight ZK Circuit', timestamp: 'Pending Dispatch', completed: false }
    ]
  },
  {
    id: 'REQ-1025',
    requester: 'Anonymous Resident #482',
    category: 'Food & Shelter',
    dateSubmitted: '2026-08-12',
    status: 'Under Review',
    assignedTo: 'Sarah Jenkins',
    amountRequested: 250,
    location: 'Davao City, Philippines',
    description: 'Community kitchen emergency funding for flood evacuees.',
    attachments: ['food_ration_plan.pdf'],
    timeline: [
      { title: 'Request Submitted', timestamp: '2026-08-12 09:12 AM', completed: true },
      { title: 'Under Local Review', timestamp: '2026-08-12 11:30 AM', completed: true },
      { title: 'Assigned to Staff', timestamp: 'In Progress', completed: false },
      { title: 'Approval Status', timestamp: 'Pending', completed: false }
    ]
  },
  {
    id: 'REQ-1026',
    requester: 'Red Cross Chapter #14',
    category: 'Medical Emergency',
    dateSubmitted: '2026-08-11',
    status: 'Completed',
    assignedTo: 'Alex Rivera',
    amountRequested: 1200,
    location: 'Bicol Region, Philippines',
    description: 'First aid kits, insulin refrigeration, and clean water purification tablets distribution.',
    attachments: ['medical_logistics.pdf', 'field_receipts.pdf'],
    timeline: [
      { title: 'Request Submitted', timestamp: '2026-08-11 07:00 AM', completed: true },
      { title: 'Under Local Review', timestamp: '2026-08-11 08:30 AM', completed: true },
      { title: 'Assigned to Alex Rivera', timestamp: '2026-08-11 09:00 AM', completed: true },
      { title: 'Approved', timestamp: '2026-08-11 11:45 AM', completed: true },
      { title: 'Aid Grant Disbursed', timestamp: '2026-08-11 04:20 PM', completed: true }
    ]
  },
  {
    id: 'REQ-1027',
    requester: 'Barangay Disaster Risk Council',
    category: 'Flood Recovery',
    dateSubmitted: '2026-08-11',
    status: 'Pending',
    assignedTo: 'Unassigned',
    amountRequested: 750,
    location: 'Bulacan Province, Philippines',
    description: 'Water pump fuel and emergency drainage equipment deployment.',
    attachments: ['equipment_quote.pdf'],
    timeline: [
      { title: 'Request Submitted', timestamp: '2026-08-11 03:15 PM', completed: true },
      { title: 'Under Local Review', timestamp: 'Pending', completed: false }
    ]
  },
  {
    id: 'REQ-1028',
    requester: 'Community Leader #91',
    category: 'Earthquake Aid',
    dateSubmitted: '2026-08-10',
    status: 'Rejected',
    assignedTo: 'John Doe',
    amountRequested: 3000,
    location: 'Surigao del Norte, Philippines',
    description: 'Duplicate claim for structural rebuilding already funded under Campaign #88.',
    attachments: ['audit_flag.pdf'],
    timeline: [
      { title: 'Request Submitted', timestamp: '2026-08-10 10:00 AM', completed: true },
      { title: 'Under Local Review', timestamp: '2026-08-10 11:15 AM', completed: true },
      { title: 'Rejected by Audit Committee', timestamp: '2026-08-10 01:30 PM', completed: true }
    ]
  }
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'ACT-1',
    user: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    description: 'Request #REQ-1024 approved for $500 tNIGHT',
    timestamp: '2 minutes ago',
    status: 'Approved'
  },
  {
    id: 'ACT-2',
    user: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    description: 'New request #REQ-1025 submitted under Food & Shelter',
    timestamp: '15 minutes ago',
    status: 'Pending'
  },
  {
    id: 'ACT-3',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    description: 'Disaster Relief Campaign #104 organization profile updated',
    timestamp: '1 hour ago',
    status: 'Updated'
  },
  {
    id: 'ACT-4',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    description: 'Case #REQ-1026 assigned to Alex Rivera',
    timestamp: '3 hours ago',
    status: 'Completed'
  }
];

export const initialUsers: OrganizationUser[] = [
  {
    id: 'USR-1',
    name: 'John Doe',
    email: 'john.doe@reliefshield.org',
    organization: 'ReliefShield Global Operations',
    role: 'Admin',
    status: 'Active',
    dateJoined: '2025-01-15'
  },
  {
    id: 'USR-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@reliefshield.org',
    organization: 'Pacific Disaster Relief Command',
    role: 'Field Manager',
    status: 'Active',
    dateJoined: '2025-03-22'
  },
  {
    id: 'USR-3',
    name: 'Alex Rivera',
    email: 'alex.r@auditnet.org',
    organization: 'Independent ZK Audit Alliance',
    role: 'Auditor',
    status: 'Active',
    dateJoined: '2025-06-10'
  },
  {
    id: 'USR-4',
    name: 'Maria Santos',
    email: 'm.santos@redcross-chapter.org',
    organization: 'Red Cross Emergency Chapter',
    role: 'Coordinator',
    status: 'Active',
    dateJoined: '2025-11-04'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'New disaster relief request #REQ-1025 submitted',
    timestamp: '5 minutes ago',
    read: false,
    type: 'info'
  },
  {
    id: 'NOTIF-2',
    title: 'Request #REQ-1024 approved by Admin Committee',
    timestamp: '1 hour ago',
    read: false,
    type: 'success'
  },
  {
    id: 'NOTIF-3',
    title: 'Monthly Midnight ZK Audit report is ready for export',
    timestamp: 'Yesterday',
    read: true,
    type: 'info'
  }
];

export const initialDonations: DonationRecord[] = [
  {
    id: 'DON-8841',
    campaign: 'Typhoon Relief',
    amount: 500,
    donorType: 'Shielded ZK Donor #0092',
    timestamp: '12 minutes ago',
    txHash: '0x8fd1e88b4ffa0e082a9e02a5c05f78816790118fedbbeefa78032e774aae3bd9',
    status: 'Confirmed On-Chain',
  },
  {
    id: 'DON-8840',
    campaign: 'Medical Emergency',
    amount: 250,
    donorType: 'Global Health Aid Alliance',
    timestamp: '35 minutes ago',
    txHash: '0x788a44d44a02eb7cb6e7cd738d90fe57d022814b8950a0dda74a667b71435ecb',
    status: 'Confirmed On-Chain',
  },
  {
    id: 'DON-8839',
    campaign: 'Food & Shelter',
    amount: 1000,
    donorType: 'Anonymous Crypto Contributor',
    timestamp: '2 hours ago',
    txHash: '0xe4a118b6fc3c81fd979ebb39aafaaef9aead3410dea0a2943a7a62b203ace8e1',
    status: 'Confirmed On-Chain',
  },
  {
    id: 'DON-8838',
    campaign: 'Earthquake Aid',
    amount: 750,
    donorType: 'Pacific Humanitarian Foundation',
    timestamp: '4 hours ago',
    txHash: '0x5e2a1b9c8d7f0e3a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    status: 'Confirmed On-Chain',
  },
  {
    id: 'DON-8837',
    campaign: 'Flood Recovery',
    amount: 350,
    donorType: 'Community Disaster Pool',
    timestamp: '6 hours ago',
    txHash: '0x3a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    status: 'Confirmed On-Chain',
  }
];

export const initialOfficerStations: FieldOfficerStation[] = [
  {
    id: 'STN-1',
    officerName: 'Sarah Jenkins',
    email: 'sarah.j@reliefshield.org',
    role: 'Field Distribution Manager',
    assignedCategory: 'Food & Shelter',
    stationLocation: 'Evacuation Center Alpha, Cebu',
    currentStock: 184,
    maxCapacity: 300,
    unitLabel: 'Family Food & Water Packs',
  },
  {
    id: 'STN-2',
    officerName: 'Alex Rivera',
    email: 'alex.r@auditnet.org',
    role: 'Medical Response Officer',
    assignedCategory: 'Medical Emergency',
    stationLocation: 'Mobile Clinic Hub 2, Bicol Region',
    currentStock: 95,
    maxCapacity: 150,
    unitLabel: 'First Aid & Insulin Kits',
  },
  {
    id: 'STN-3',
    officerName: 'John Doe',
    email: 'john.doe@reliefshield.org',
    role: 'Shelter Logistics Coordinator',
    assignedCategory: 'Earthquake Aid',
    stationLocation: 'Disaster Staging Camp #4, Surigao',
    currentStock: 62,
    maxCapacity: 100,
    unitLabel: 'Emergency Tent & Lumber Packs',
  },
  {
    id: 'STN-4',
    officerName: 'Maria Santos',
    email: 'm.santos@redcross-chapter.org',
    role: 'Emergency Rapid Response Coordinator',
    assignedCategory: 'Typhoon Relief',
    stationLocation: 'Coastal Disaster Relief Depot, Leyte',
    currentStock: 140,
    maxCapacity: 250,
    unitLabel: 'Typhoon Emergency Survival Kits',
  }
];

export const initialDisbursements: DisbursementRecord[] = [
  {
    id: 'DISB-501',
    tokenId: 'ZK-TOKEN #AID-98425',
    officerName: 'Sarah Jenkins',
    category: 'Food & Shelter',
    itemsDisbursed: '1x Family Food Ration & Clean Water Gallon',
    valueEquivalent: 50,
    timestamp: '18 minutes ago',
    location: 'Evacuation Center Alpha, Cebu',
    status: 'Disbursed',
  },
  {
    id: 'DISB-500',
    tokenId: 'ZK-TOKEN #AID-98421',
    officerName: 'Alex Rivera',
    category: 'Medical Emergency',
    itemsDisbursed: '2x Emergency Trauma & Wound Dressing Kits',
    valueEquivalent: 150,
    timestamp: '45 minutes ago',
    location: 'Mobile Clinic Hub 2, Bicol Region',
    status: 'Disbursed',
  },
  {
    id: 'DISB-499',
    tokenId: 'ZK-TOKEN #AID-98418',
    officerName: 'John Doe',
    category: 'Earthquake Aid',
    itemsDisbursed: '1x Heavy Duty Waterproof Shelter Tarp & Poles',
    valueEquivalent: 100,
    timestamp: '2 hours ago',
    location: 'Disaster Staging Camp #4, Surigao',
    status: 'Disbursed',
  }
];

export const initialChartData = [
  { name: 'Mon', Requests: 45, Completed: 32, Pending: 13 },
  { name: 'Tue', Requests: 52, Completed: 40, Pending: 12 },
  { name: 'Wed', Requests: 61, Completed: 48, Pending: 13 },
  { name: 'Thu', Requests: 78, Completed: 55, Pending: 23 },
  { name: 'Fri', Requests: 94, Completed: 72, Pending: 22 },
  { name: 'Sat', Requests: 110, Completed: 88, Pending: 22 },
  { name: 'Sun', Requests: 125, Completed: 104, Pending: 21 },
];

// Compatibility aliases
export const mockRequests = initialRequests;
export const mockActivities = initialActivities;
export const mockUsers = initialUsers;
export const mockNotifications = initialNotifications;
export const mockChartData = initialChartData;
