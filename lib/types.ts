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

export interface AuditLog {
  id: string;
  entityName: string;
  action: string;
  changeDetails: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
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