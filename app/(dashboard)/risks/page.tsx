// app/(dashboard)/risks/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetcher } from '@/lib/api-client';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Risk Title', width: 250 },
  { field: 'impact', headerName: 'Impact', width: 100 },
  { field: 'likelihood', headerName: 'Likelihood', width: 100 },
  { 
    field: 'score', 
    headerName: 'Score', 
    width: 120,
    renderCell: (params) => {
      const score = params.value;
      const color = score >= 15 ? 'error' : score >= 8 ? 'warning' : 'success';
      return <Chip label={score} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
    }
  },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'createdAt', headerName: 'Identified On', width: 200, 
    valueGetter: (params) => new Date(params).toLocaleString() 
  },
];

interface Risk {
  id: string;
  title: string;
  impact: number;
  likelihood: number;
  score: number;
  status: string;
  createdAt: string;
}

export default function RisksPage() {
  // 2. Add the Generic type to useState
  const [risks, setRisks] = useState<Risk[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Ensure the fetcher matches the state type
    fetcher<Risk[]>('/api/risks')
      .then((data) => setRisks(data)) // Manually passing data is cleaner for debugging
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Risk Register</Typography>
        <Button 
          component={Link} 
          href="/risks/new" 
          variant="contained" 
          startIcon={<Plus size={18} />}
        >
          New Assessment
        </Button>
      </Box>

      <Box sx={{ height: 600, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={risks}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>
    </Box>
  );
}