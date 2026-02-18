'use client';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api-client';
import { 
  Paper, Typography, Box, Container, CircularProgress, Divider 
} from '@mui/material';
// Senior Architect Fix: Explicitly use Grid2 for 'size' property support
import Grid from '@mui/material/Grid';   
import { ShieldAlert, FileText, ClipboardCheck, Activity } from 'lucide-react';
import RecentActivity from '@/components/RecentActivities';
import StatCard from '@/components/StatCard';
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';

export default function DashboardPage() {
  const [stats, setStats] = useState({ risks: 0, policies: 0, audits: 0, incidents: 0 });
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    // Concurrent data fetching for optimized demo performance
    Promise.all([
      fetcher<any[]>('/api/risks'),
      fetcher<any[]>('/api/policies'),
      fetcher<any[]>('/api/audits'),
      fetcher<any[]>('/api/incidents'),
      fetcher<any[]>('/api/audits/audit-logs') 
    ]).then(([risks, policies, audits, incidents, logs]) => { 
      setStats({
        risks: risks.length,
        policies: policies.length,
        audits: audits.length,
        incidents: incidents.length
      });
      setRecentLogs(logs); 
    }).catch(err => console.error("Dashboard Load Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      
      {/* 1. Navigational Breadcrumbs */}
      <DynamicBreadcrumbs />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Compliance Overview</Typography>
        <Typography variant="body1" color="text.secondary">Aggregated system metrics.</Typography>
      </Box>

      {/* 2. Top-Level Metric Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Open Risks" value={stats.risks} color="error" icon={<ShieldAlert size={24} />} description="High-priority mitigations" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Policies" value={stats.policies} color="primary" icon={<FileText size={24} />} description="Currently published" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Planned Audits" value={stats.audits} color="success" icon={<ClipboardCheck size={24} />} description="Upcoming assessments" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Recent Incidents" value={stats.incidents} color="warning" icon={<Activity size={24} />} description="Awaiting investigation" />
        </Grid>
      </Grid>

      {/* 3. Operational Widgets */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Risk Concentration</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled', textAlign: 'center' }}>
              Chart: Risk Score Distribution<br/>(Visualizing severity clusters)
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             <Typography variant="h6" gutterBottom>Recent Activities</Typography>
             <Divider sx={{ mb: 2 }} />
             <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <RecentActivity logs={recentLogs} /> 
             </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Policy Review Status</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
              Widget: Stagnant Policies
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}