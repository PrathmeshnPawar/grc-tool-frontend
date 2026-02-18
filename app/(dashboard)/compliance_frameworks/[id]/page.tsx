'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api-client';
import { Box, Typography, MenuItem, Select, Paper, Button, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// Added Plus icon for the new trigger
import { ArrowLeft, Plus } from 'lucide-react'; 
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';
import { ComplianceControl } from '@/lib/types';

export default function FrameworkControlsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadControls = async () => {
    setLoading(true);
    try {
      const data = await fetcher<ComplianceControl[]>(`/api/compliance/frameworks/${id}/controls`);
      setControls(data || []);
    } catch (err) {
      console.error("Failed to load controls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadControls(); }, [id]);

  const handleStatusChange = async (controlId: string, newStatus: string) => {
    try {
      await fetcher(`/api/compliance/controls/${controlId}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      loadControls(); 
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'controlCode', headerName: 'Code', width: 120 },
    { field: 'name', headerName: 'Control Name', width: 250 },
    { 
      field: 'status', 
      headerName: 'Enforcement Status', 
      width: 200,
      renderCell: (params) => (
        <Select
          value={params.value || 'NON_COMPLIANT'}
          size="small"
          fullWidth
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          sx={{ 
            bgcolor: params.value === 'COMPLIANT' ? '#e8f5e9' : '#ffebee',
            fontSize: '0.875rem'
          }}
        >
          <MenuItem value="COMPLIANT">Compliant</MenuItem>
          <MenuItem value="NON_COMPLIANT">Non-Compliant</MenuItem>
          <MenuItem value="NOT_APPLICABLE">Not Applicable</MenuItem>
        </Select>
      )
    },
    { field: 'description', headerName: 'Requirements', flex: 1 }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Stack: Groups Navigation, Title, and Actions */}
       <DynamicBreadcrumbs />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button 
            startIcon={<ArrowLeft size={20} />} 
            onClick={() => router.push('/compliance_frameworks')}
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Control Enforcement Matrix
          </Typography>
        </Stack>

        {/* Primary Action: Navigate to the control builder for this specific framework */}
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => router.push(`/compliance_frameworks/${id}/new_control`)}
          sx={{ fontWeight: 'bold' }}
        >
          Add Control
        </Button>
      </Stack>

      <Paper sx={{ height: 650, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid 
          rows={controls} 
          columns={columns} 
          loading={loading}
          getRowId={(row) => row.id}
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
}