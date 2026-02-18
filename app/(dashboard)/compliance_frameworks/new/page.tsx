'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api-client';
import { 
  Box, Typography, TextField, Button, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack 
} from '@mui/material';
// Using the new Grid import as requested
import Grid from '@mui/material/Grid'; 
import { Save, ArrowLeft } from 'lucide-react';

export default function CreateFrameworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    category: 'Information Security',
    regulatoryBody: '',
    referenceLink: '',
    ownerId: ''
  });

  useEffect(() => {
    fetcher<any[]>('/api/users')
      .then(data => setUsers(data || []))
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetcher('/api/compliance/frameworks', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      router.push('/compliance_frameworks');
    } catch (err) {
      console.error("Framework creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, margin: '0 auto' }}>
      <Button startIcon={<ArrowLeft size={20} />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back to Register
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Establish New Compliance Framework
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        {/* The container prop is still used to define the grid context */}
        <Grid container spacing={3}>
          
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary">1. Basic Information</Typography>
          </Grid>

          {/* Using size property for responsive widths */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth label="Framework Name (e.g., ISO 27001)"
              required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth label="Version"
              value={formData.version}
              onChange={(e) => setFormData({...formData, version: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>2. Regulatory Context</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Regulatory Body"
              value={formData.regulatoryBody}
              onChange={(e) => setFormData({...formData, regulatoryBody: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth label="Official Reference Link"
              value={formData.referenceLink}
              onChange={(e) => setFormData({...formData, referenceLink: e.target.value})}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>3. Governance</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Compliance Owner</InputLabel>
              <Select
                value={formData.ownerId}
                label="Compliance Owner"
                onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth multiline rows={4}
              label="Framework Description & Scope"
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
                {loading ? 'Creating...' : 'Establish Framework'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}