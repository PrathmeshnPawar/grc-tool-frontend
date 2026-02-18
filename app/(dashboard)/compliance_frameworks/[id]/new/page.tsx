'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api-client';
import { 
  Box, Typography, TextField, Button, Paper, Stack 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using modern Grid2 as per your standard
import { Save, ArrowLeft, ClipboardCheck } from 'lucide-react';
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';

export default function CreateControlPage() {
  const { id: frameworkId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    controlCode: '',
    description: '',
    frameworkId: frameworkId as string // Pre-populated from URL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Targets ComplianceControlController.createControl
      await fetcher('/api/compliance/controls', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Redirect back to the Control Matrix for this framework
      router.push(`/compliance_frameworks/${frameworkId}`);
    } catch (err) {
      console.error("Control creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
         <DynamicBreadcrumbs />
      <Button 
        startIcon={<ArrowLeft size={20} />} 
        onClick={() => router.back()} 
        sx={{ mb: 2 }}
      >
        Back to Matrix
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Define New Compliance Control
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create a specific requirement mapped to this framework&apos;s compliance posture.
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Control Code"
              placeholder="e.g., AC-1"
              required
              value={formData.controlCode}
              onChange={(e) => setFormData({...formData, controlCode: e.target.value})}
              helperText="Unique identifier from the standard"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Control Name"
              placeholder="e.g., Access Control Policy"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Implementation Description"
              placeholder="Describe how this control is enforced within the organization..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button onClick={() => router.back()}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={<Save size={20} />}
              >
                {loading ? 'Saving...' : 'Save Control'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}