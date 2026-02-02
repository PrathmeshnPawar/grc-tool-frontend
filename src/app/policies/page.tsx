"use client";
import { Container, Typography, Box, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Policy Title', flex: 1 },
  { field: 'version', headerName: 'Version', width: 120 },
  { field: 'status', headerName: 'Status', width: 150 },
];

export default function PolicyPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Policies</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={[]} columns={columns} localeText={{ noRowsLabel: 'No Policies Found' }} />
      </Paper>
    </Container>
  );
}