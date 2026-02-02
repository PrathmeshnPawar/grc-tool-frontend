"use client";
import { Container, Typography, Box, Paper, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Audit Name', flex: 1 },
  { field: 'startDate', headerName: 'Start Date', width: 150 },
  { field: 'endDate', headerName: 'End Date', width: 150 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: (params) => <Chip label={params.value} variant="outlined" />
  },
];

const rows = [
  { id: '1', name: 'Annual Internal Security Audit', startDate: '2026-01-01', endDate: '2026-02-01', status: 'IN_PROGRESS' },
];

export default function AuditPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Audit Management</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={rows} columns={columns} />
      </Paper>
    </Container>
  );
}