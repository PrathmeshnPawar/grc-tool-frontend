'use client';
import { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Slider, TextField, Button, 
  Stack, Divider, Alert, Container, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { fetcher } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';
import { RISK_CATEGORIES } from '@/lib/types';

// Wizard Tip: These should match your backend RiskCategory Enum exactly


export default function NewRiskPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for Category
  const [impact, setImpact] = useState(3);
  const [likelihood, setLikelihood] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const score = useMemo(() => impact * likelihood, [impact, likelihood]);

  const riskInfo = useMemo(() => {
    if (score >= 20) return { label: 'CRITICAL', color: 'error.main' };
    if (score >= 12) return { label: 'HIGH', color: 'warning.main' };
    if (score >= 6) return { label: 'MEDIUM', color: 'info.main' };
    return { label: 'LOW', color: 'success.main' };
  }, [score]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Payload now matches RiskCreateDTO strictly
      await fetcher('/api/risks', {
        method: 'POST',
        body: JSON.stringify({ 
          title, 
          description, 
          category, // Added category
          impact, 
          likelihood,
          ownerId: null, // Optional in DTO
          incidentId: null // Optional in DTO
        })
      });
      router.push('/dashboard');
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
       <DynamicBreadcrumbs />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Perform Risk Assessment</Typography>
        <Typography color="text.secondary">Quantify the potential impact and likelihood of this threat.</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={4}>
          <TextField 
            fullWidth label="Risk Title" 
            value={title} onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* New Category Selection */}
          <FormControl fullWidth required>
            <InputLabel>Risk Category</InputLabel>
            <Select
              value={category}
              label="Risk Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {RISK_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField 
            fullWidth multiline rows={3} label="Description" 
            value={description} onChange={(e) => setDescription(e.target.value)}
          />

          <Divider />

          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography gutterBottom fontWeight="600">Impact (1-5)</Typography>
              <Slider 
                value={impact} min={1} max={5} step={1} marks 
                onChange={(_, val) => setImpact(val as number)}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography gutterBottom fontWeight="600">Likelihood (1-5)</Typography>
              <Slider 
                value={likelihood} min={1} max={5} step={1} marks 
                onChange={(_, val) => setLikelihood(val as number)}
                color="secondary"
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>

          <Box sx={{ 
            p: 3, borderRadius: 2, bgcolor: 'grey.50', 
            border: '1px dashed', borderColor: 'divider',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="h6">Calculated Risk Score: <strong>{score}</strong></Typography>
              <Typography variant="subtitle2" sx={{ color: riskInfo.color }}>
                Category: {riskInfo.label}
              </Typography>
            </Box>
            {score >= 12 ? <AlertTriangle color="#d32f2f" size={32} /> : <ShieldCheck color="#2e7d32" size={32} />}
          </Box>

          <Button 
            variant="contained" size="large" fullWidth 
            onClick={handleSubmit} 
            // Disable if Title or Category is missing
            disabled={submitting || !title || !category}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          >
            {submitting ? 'Saving to Ledger...' : 'Submit Assessment'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}