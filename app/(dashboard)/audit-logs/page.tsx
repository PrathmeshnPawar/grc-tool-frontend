'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetcher } from '@/lib/api-client';
import { AuditLog } from '@/lib/types';
import { Chip, Box, Typography } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'createdAt', headerName: 'Timestamp', width: 200, 
    valueGetter: (params) => new Date(params).toLocaleString() 
  },
  { field: 'action', headerName: 'Action', width: 150,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color={params.value.includes('FAILURE') ? 'error' : 'success'} 
        size="small" 
      />
    )
  },
  { field: 'entityName', headerName: 'Entity', width: 130 },
  { field: 'ipAddress', headerName: 'IP Address', width: 130 },
  { field: 'userAgent', headerName: 'Device/Agent', width: 300 },
  { field: 'changeDetails', headerName: 'Details', flex: 1 },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher<AuditLog[]>('/api/audits/audit-logs')
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  const refreshLogs = () => {
  setLoading(true);
  fetcher<AuditLog[]>('/api/audit-logs')
    .then(setLogs)
    .finally(() => setLoading(false));
};

  return (
    <Box sx={{ height: 600, width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        System Audit Logs
      </Typography>
      <DataGrid
        rows={logs}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          backgroundColor: 'white',
          '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
        }}
      />
      <button onClick={refreshLogs} className="btn-secondary">
        Refresh Feed
      </button>
    </Box>
  );
}