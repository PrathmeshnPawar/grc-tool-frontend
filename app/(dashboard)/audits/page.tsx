'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetcher } from '@/lib/api-client';
import { Chip, Box, Typography, Button, Stack } from '@mui/material';
import { RefreshCw, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 1. Interface matches the camelCase backend response payload
interface Audit {
  id: string;
  name: string;
  startDate: string; // Matches Java LocalDate
  endDate: string;   // Matches Java LocalDate
  status: string;
  leadAuditorId: string | null;
  leadAuditorName?: string; // Wizard Tip: Plan for displaying the name
  createdAt: string; // Matches Java LocalDateTime
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Audit Name', width: 250 },
  { 
    field: 'schedule', 
    headerName: 'Schedule', 
    width: 250,
    // Safely unwrap the schedule
    valueGetter: (params, row) => {
      const start = row.startDate || 'TBD';
      const end = row.endDate || 'TBD';
      return `${start} - ${end}`;
    }
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color={params.value === 'COMPLETED' ? 'success' : 'primary'} 
        variant="outlined"
        size="small" 
      />
    )
  },
  // 2. Display Name instead of ID for better UX
  { 
    field: 'leadAuditorName', 
    headerName: 'Lead Auditor', 
    width: 200,
    valueGetter: (params, row) => row.leadAuditorName || row.leadAuditorId || 'Unassigned'
  },
  { 
    field: 'createdAt', 
    headerName: 'Created On', 
    width: 180,
    valueGetter: (params) => {
      if (!params) return 'N/A';
      const date = new Date(params);
      // Handles potential ISO or standard date strings
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    } 
  },
];

export default function AuditsPage() {
  const router = useRouter();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAudits = async () => {
    setLoading(true);
    try {
      // 3. fetcher returns the raw array after your simplified refactor
      const data = await fetcher<Audit[]>('/api/audits');
      setAudits(data);
    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') {
        router.push('/');
      } else {
        console.error("Failed to load audits:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // 4. Ensure path matches your file structure
    router.push('/audits/new'); 
  };

  useEffect(() => {
    loadAudits();
  }, []);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Compliance Audit Register
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<RefreshCw size={18} />} 
            onClick={loadAudits}
            variant="outlined"
          >
            Refresh
          </Button>

          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            onClick={handleCreateNew}
            sx={{ fontWeight: 'bold' }}
          >
            Create Audit
          </Button>
        </Stack>
      </Box>

      <Box sx={{ height: 600, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={audits}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
            border: 'none'
          }}
        />
      </Box>
    </Box>
  );
}