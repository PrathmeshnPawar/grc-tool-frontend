"use client";
import { Container, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Vendor Name', flex: 1 },
  { field: 'contactEmail', headerName: 'Contact Email', flex: 1 },
  { field: 'tier', headerName: 'Tier', width: 120 },
  { field: 'status', headerName: 'Status', width: 130 },
];

export default function VendorPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Vendors</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={[]} columns={columns} />
      </Paper>
    </Container>
  );
}