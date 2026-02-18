'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetcher } from '@/lib/api-client';
import { Chip, Box, Typography, Button, Stack, Paper } from '@mui/material';
import { RefreshCw, Plus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// matches your Java record/entity strictly
interface Incident {
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

// Senior Wizard Logic: Map enums to UI priorities
const getSeverityColor = (severity: string): "error" | "warning" | "info" | "success" | "default" => {
  switch (severity) {
    case 'CRITICAL': return 'error';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: string): "success" | "warning" | "info" | "default" => {
  switch (status) {
    case 'RESOLVED':
    case 'CLOSED': return 'success';
    case 'IN_PROGRESS':
    case 'MITIGATED': return 'warning';
    case 'REPORTED':
    case 'OPEN': return 'info';
    default: return 'default';
  }
};

const columns: GridColDef<Incident>[] = [
  { field: 'title', headerName: 'Incident Name', width: 220 },
  { 
    field: 'severity', 
    headerName: 'Severity', 
    width: 120,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        size="small" 
        color={getSeverityColor(params.value)}
        sx={{ fontWeight: 'bold' }}
      />
    )
  },
  { 
    field: 'reportedByName', 
    headerName: 'Name', 
    width: 140,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        variant="outlined"
        size="small" 
        color={getStatusColor(params.value)}
      />
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 140,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        variant="outlined"
        size="small" 
        color={getStatusColor(params.value)}
      />
    )
  },
  { 
    field: 'dateReported', 
    headerName: 'Reported On', 
    width: 150,
    valueGetter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
  },
  { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
];

export default function IncidentsPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      // Points to the correct Incident endpoint [cite: 38]
      const data = await fetcher<Incident[]>('/api/incidents');
      if (Array.isArray(data)) setIncidents(data);
    } catch (error: any) {
      console.error("Failed to load incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertCircle color="#d32f2f" /> Incident Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and resolve compliance breaches and security events. [cite: 7, 8]
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button startIcon={<RefreshCw size={18} />} onClick={loadIncidents} variant="outlined">
            Refresh
          </Button>

          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            onClick={() => router.push('/incidents/new')}
            sx={{ fontWeight: 'bold' }}
          >
            Report Incident
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ height: 600, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <DataGrid
          rows={incidents}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' }
          }}
        />
      </Paper>
    </Box>
  );
}