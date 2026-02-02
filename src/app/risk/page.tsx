"use client";
import { Container, Typography, Box, Button, Paper, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, ReportProblem } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Risk Title', flex: 1, minWidth: 200 },
  { field: 'category', headerName: 'Category', width: 150 },
  { field: 'impact', headerName: 'Impact', width: 100, align: 'center' },
  { field: 'likelihood', headerName: 'Likelihood', width: 120, align: 'center' },
  { 
    field: 'riskScore', 
    headerName: 'Score', 
    width: 100,
    renderCell: (params) => {
      const score = params.value;
      const color = score > 15 ? "error" : score > 8 ? "warning" : "success";
      return <Chip label={score} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
    }
  },
  { field: 'status', headerName: 'Status', width: 130 },
];

const rows = [
  { id: '1', title: 'Data Breach in Vendor Portal', category: 'STRATEGIC', impact: 4, likelihood: 5, riskScore: 20, status: 'OPEN' },
  { id: '2', title: 'Unauthorized System Access', category: 'OPERATIONAL', impact: 5, likelihood: 2, riskScore: 10, status: 'MITIGATED' },
];

export default function RiskPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Risk Register</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Identify Risk</Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
      </Paper>
    </Container>
  );
}