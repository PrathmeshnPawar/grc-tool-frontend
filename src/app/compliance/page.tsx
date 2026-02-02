"use client";
import { Container, Typography, Box, Paper, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Framework Name', flex: 1 },
  { field: 'version', headerName: 'Version', width: 120 },
  { 
    field: 'progress', 
    headerName: 'Readiness', 
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        <LinearProgress variant="determinate" value={params.value} sx={{ flex: 1, height: 8, borderRadius: 5 }} />
        <Typography variant="body2">{params.value}%</Typography>
      </Box>
    )
  },
  { field: 'description', headerName: 'Description', flex: 1.5 },
];

const rows = [
  { id: '1', name: 'ISO 27001', version: '2022', progress: 75, description: 'Information Security Management System' },
  { id: '2', name: 'SOC 2', version: 'Type II', progress: 40, description: 'Security, Availability, Processing Integrity' },
];

export default function CompliancePage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Compliance Frameworks</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={rows} columns={columns} />
      </Paper>
    </Container>
  );
}