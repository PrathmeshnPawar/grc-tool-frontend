'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetcher } from '@/lib/api-client';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
// Added Plus icon for the create action
import { Shield, RefreshCw, Plus } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadFrameworks = async () => {
    setLoading(true);
    try {
      const data = await fetcher<any[]>('/api/compliance/frameworks');
      setFrameworks(data || []);
    } catch (err) {
      console.error("Failed to load frameworks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFrameworks(); }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Framework Name', width: 250 },
    { field: 'version', headerName: 'Version', width: 120 },
    { field: 'description', headerName: 'Scope Details', flex: 1 },
    {
      field: 'actions',
      headerName: 'Controls',
      width: 150,
      renderCell: (params) => (
        <Button 
          size="small" 
          variant="outlined"
          startIcon={<Shield size={16} />}
          onClick={() => router.push(`/compliance_frameworks/${params.row.id}`)}
        >
          Manage
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Updated Stack to include the Create action */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Compliance Frameworks</Typography>
        
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<RefreshCw size={18} />} 
            onClick={loadFrameworks}
          >
            Refresh
          </Button>

          {/* New Primary Action Button */}
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            onClick={() => router.push('/compliance_frameworks/new')}
            sx={{ fontWeight: 'bold' }}
          >
            Create Framework
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ height: 600, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid 
          rows={frameworks} 
          columns={columns} 
          loading={loading}
          getRowId={(row) => row.id} 
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
}