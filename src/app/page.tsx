"use client";
import { Container, Typography, Paper, Box, Button, LinearProgress, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Shield, Warning, AssignmentTurnedIn, Gavel } from '@mui/icons-material';
import StatCard from '../components/StatCard';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Framework', flex: 1, minWidth: 200, // From ComplianceFramework
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
        <Shield sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="body2" fontWeight={600}>{params.value}</Typography>
      </Box>
    )
  },
  { field: 'version', headerName: 'Version', width: 120 }, //
  { field: 'progress', headerName: 'Readiness', flex: 1, minWidth: 150,
    renderCell: (params) => (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
        <LinearProgress 
          variant="determinate" 
          value={params.value} 
          sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }} 
        />
        <Typography variant="caption" fontWeight={700}>{params.value}%</Typography>
      </Box>
    )
  },
  { field: 'status', headerName: 'Status', width: 150,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        size="small"
        color={params.value === 'ACTIVE' ? "success" : "warning"}
        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
      />
    )
  },
];

const rows = [
  { id: '550e8400-e29b-41d4-a716-446655440000', name: 'ISO 27001', version: '2022', progress: 85, status: 'ACTIVE' },
  { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'SOC 2', version: 'v2', progress: 40, status: 'IN_REVIEW' },
];

export default function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ mt: 2, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Compliance Overview</Typography>
          <Typography variant="body1" color="text.secondary">Real-time GRC Posture</Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>New Assessment</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12, sm:6, md:3}}><StatCard title="Overall Readiness" value="62%" trend={2.5} icon={<Shield />} color="primary" /></Grid>
        <Grid size={{xs:12, sm:6, md:3}}><StatCard title="Active Risks" value="12" trend={-5.0} icon={<Warning />} color="error" /></Grid>
        <Grid size={{xs:12, sm:6, md:3}}><StatCard title="Audit Progress" value="67%" trend={10.2} icon={<AssignmentTurnedIn />} color="info" /></Grid>
        <Grid size={{xs:12, sm:6, md:3}}><StatCard title="Policies Active" value="24" trend={0} icon={<Gavel />} color="success" /></Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Framework Readiness</Typography>
      <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick />
      </Paper>
    </Container>
  );
}