// lib/types.ts
export type Role = 'ADMIN' | 'RISK_OWNER' | 'AUDITOR' | 'EMPLOYEE' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  picture?: string; // Captures the Google photo URL
}

export interface Audit {
  id: string; // UUID from PostgreSQL
  name: string;
  startDate: string; // Matches Java LocalDate (ISO string: YYYY-MM-DD)
  endDate: string;   
  
  // Use a String Literal Type for Status to prevent invalid states
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; 
  
  leadAuditorId: string | null;
  leadAuditorName?: string; // Wizard Tip: Set this in your Java Mapper
  
  // Link to Risk: Keep the ID for navigation
  riskId: string | null; 
  
  createdAt: string; // Matches Java LocalDateTime
}

// lib/types.ts
export interface AuditLog {
  id: string;
  entityName: string;
  action: string;
  changeDetails: string;
  ipAddress: string;
  userAgent: string;
  performedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Risk {
  id: string;
  title: string;
  impact: number;
  likelihood: number;
  score: number;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;        // This would be your 'Audit' object
  error?: string;  // e.g., "UNAUTHORIZED", "VALIDATION_FAILED"
}

export interface Incident {
  id: string;
  title: string;
  description: string; 
  severity: string;   
  status: string;
  dateReported: string | null;
  reportedById?: string; 
  reportedBy: string;
  riskIds: string; 
}


export interface Policy {
  id: string;
  title: string;
  version: string;
  status: string;
  description: string;
  content: string;
  isProcessed: boolean;
  lastUpdated: string;
  filePath: string | null;
}

export const RISK_CATEGORIES = [
  'STRATEGIC',
  'OPERATIONAL',
  'FINANCIAL',
  'COMPLIANCE',
 
];

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Standard type for Lucide or MUI icons
  description?: string;  // Optional, as seen in your Dashboard
  // Limit color to valid MUI Palette colors for consistency
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface ComplianceControl {
  id: string; // UUID from PostgreSQL
  controlCode: string; // e.g., "AC-1", "ISO-27001-5.1"
  name: string;
  description: string; // Mapped to 'Requirements' in your grid
  
  // Professional Tip: Use String Literal Types for fixed statuses
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
  
  frameworkId: string; // Links this control back to the parent framework
  createdAt?: string; // ISO Date string for audit tracking
}

export interface ComplianceFramework {
  id?: string; // Optional for new creations, UUID string for existing ones
  name: string;
  version: string; // e.g., "2022", "v1.1"
  description: string;
  
  // Professional Tip: Use String Literal Types for common categories
  category: 'Information Security' | 'Privacy' | 'Financial' | 'Operational'; 
  
  regulatoryBody: string; // e.g., "RBI", "ISO", "SEBI"
  referenceLink: string; // URL to official documentation
  ownerId: string; // Links to the User ID who manages this framework
  
  // Wizard Tip: Plan for metadata in your Java backend
  createdAt?: string; 
  updatedAt?: string;
}