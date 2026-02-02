"use client";
import { Container, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Full Name', flex: 1 },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', width: 150 },
];

export default function UserPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Users & Roles</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={[]} columns={columns} />
      </Paper>
    </Container>
  );
}