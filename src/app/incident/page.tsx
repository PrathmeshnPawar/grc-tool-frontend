"use client";
import { Container, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Incident', flex: 1 },
  { field: 'severity', headerName: 'Severity', width: 130 },
  { field: 'DateReported', headerName: 'Reported Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 130 },
];

export default function IncidentPage() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Incidents</Typography>
      <Paper sx={{ height: 600 }}>
        <DataGrid rows={[]} columns={columns} />
      </Paper>
    </Container>
  );
}