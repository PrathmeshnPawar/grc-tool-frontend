'use client';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api-client';
import { 
  Paper, Typography, Box, Container, CircularProgress, Divider 
} from '@mui/material';
// Senior Tip: Use Grid2 for the 'size' prop (MUI v6)
import Grid from '@mui/material/Grid';   
import { ShieldAlert, FileText, ClipboardCheck, Activity } from 'lucide-react';
import RecentActivity from '@/components/RecentActivities';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({ risks: 0, policies: 0, audits: 0, incidents: 0 });
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    // 1. Correct the API paths to use '/api/' instead of '/dashboard/'
    Promise.all([
      fetcher<any[]>('/api/risks'),
      fetcher<any[]>('/api/policies'),
      fetcher<any[]>('/api/audits'),
      fetcher<any[]>('/api/incidents'),
      fetcher<any[]>('/api/audits/audit-logs') 
    ]).then(([risks, policies, audits, incidents, logs]) => { // 2. Fixed destructuring (5 items)
      setStats({
        risks: risks.length,
        policies: policies.length,
        audits: audits.length,
        incidents: incidents.length
      });
      // 3. Populate the logs state correctly
      setRecentLogs(logs); 
    }).catch(err => console.error("Dashboard Load Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Compliance Overview</Typography>
        <Typography variant="body1" color="text.secondary">Aggregated system metrics.</Typography>
      </Box>

      {/* Metric Cards */}
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

      {/* Secondary Widgets Row */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Risk Concentration</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
              Chart: Risk Score Distribution (Coming Soon)
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'auto' }}>
            <RecentActivity logs={recentLogs} /> 
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