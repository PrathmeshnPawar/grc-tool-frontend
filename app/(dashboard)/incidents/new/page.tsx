'use client';
import { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Stack, TextField, 
  MenuItem, Button, Box, Divider, Alert 
} from "@mui/material";
import { Save, ArrowLeft, AlertCircle, User as UserIcon } from "lucide-react";
import { fetcher } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewIncidentPage() {
  const router = useRouter();
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [reportedById, setReportedById] = useState(""); // Fixes the "id must not be null" error
  const [riskIds, setRiskIds] = useState<string[]>([]); 
  
  // Data for Selects
  const [risks, setRisks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // To select reporter by name
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch both Risks and Users to populate the dropdowns
    Promise.all([
      fetcher<any[]>('/api/risks'),
      fetcher<any[]>('/api/users')
    ]).then(([riskData, userData]) => {
      if (Array.isArray(riskData)) setRisks(riskData);
      if (Array.isArray(userData)) setUsers(userData);
    }).catch(err => console.error("Data load failed:", err));
  }, []);

  const handleSubmit = async () => {
   // Senior Tip: Domain validation before hitting the API [cite: 12]
    if (!title || !description || !reportedById) {
      setError("Incident Name, Description, and Reporter are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await fetcher<any>('/api/incidents', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          severity,
          status: 'REPORTED', 
          reportedById, // This ensures the User relationship is mapped
          riskIds, 
          dateReported: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD for LocalDate
        })
      });

      if (result) router.push('/incidents');
    } catch (err: any) {
      setError(err.message || "Failed to report incident.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button component={Link} href="/incidents" startIcon={<ArrowLeft size={20} />} sx={{ mb: 2 }}>
          Back to Register
        </Button>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AlertCircle color="#d32f2f" size={32} /> Report New Incident
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Stack spacing={3}>
          <TextField 
            label="Incident Title" 
            fullWidth required 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />

          <Stack direction="row" spacing={2}>
            {/* Reported By - UI shows Name, Payload sends ID */}
            <TextField 
              select label="Reported By" 
              fullWidth required 
              value={reportedById} 
              onChange={e => setReportedById(e.target.value)}
              helperText="Who discovered the breach?"
            >
              {users.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </TextField>

            <TextField 
              select label="Severity" 
              sx={{ width: '40%' }} required 
              value={severity} 
              onChange={e => setSeverity(e.target.value)}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
            </TextField>
          </Stack>

          <TextField 
            select label="Associated Risks" 
            fullWidth SelectProps={{ multiple: true }}
            value={riskIds} 
            onChange={e => setRiskIds(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
          >
            {risks.map(r => (
              <MenuItem key={r.id} value={r.id}>{r.title}</MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Incident Description" 
            multiline rows={5} fullWidth required 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />

          <Divider />

          <Button 
            variant="contained" size="large" fullWidth 
            startIcon={<Save size={20} />}
            disabled={submitting} 
            onClick={handleSubmit} 
            sx={{ py: 1.5, fontWeight: 'bold', bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            {submitting ? "Processing..." : "Submit Incident Report"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}