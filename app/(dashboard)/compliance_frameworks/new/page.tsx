'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api-client';
import { 
  Box, Typography, TextField, Button, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Optimized Grid2 import
import { Save, ArrowLeft, X } from 'lucide-react';
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';
import { ComplianceFramework, User } from '@/lib/types'; // Using established interfaces

export default function CreateFrameworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // Strict typing for users
  
  const [formData, setFormData] = useState<ComplianceFramework>({
    name: '',
    version: '',
    description: '',
    category: 'Information Security', 
    regulatoryBody: '',
    referenceLink: '',
    ownerId: ''
  });

  /**
   * Senior Architect Move: Centralized Change Handler.
   * This reduces JSX clutter and handles state updates in a single location.
   */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // Populate the 'Compliance Owner' dropdown from your user management module
    fetcher<User[]>('/api/users')
      .then(data => setUsers(data || []))
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Maps directly to your Spring Boot @PostMapping
      await fetcher('/api/compliance/frameworks', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      router.push('/compliance_frameworks');
    } catch (err) {
      console.error("Framework creation failed:", err);
      // P1 Checklist: Add error feedback here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, margin: '0 auto' }}>
      <DynamicBreadcrumbs />
      
      <Button 
        startIcon={<ArrowLeft size={20} />} 
        onClick={() => router.back()} 
        sx={{ mb: 2 }}
      >
        Back to Register
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Establish New Compliance Framework
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary" sx={{ borderBottom: '1px solid', pb: 1, mb: 1 }}>
              1. Basic Information
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth 
              label="Framework Name (e.g., NIST CSF)"
              required 
              name="name" // Matches interface key
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth 
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary" sx={{ mt: 2, borderBottom: '1px solid', pb: 1, mb: 1 }}>
              2. Regulatory Context
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth 
              label="Regulatory Body"
              name="regulatoryBody"
              value={formData.regulatoryBody}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="Information Security">Information Security</MenuItem>
                <MenuItem value="Privacy">Privacy</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="Operational">Operational</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth 
              label="Official Reference Link"
              name="referenceLink"
              value={formData.referenceLink}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="primary" sx={{ mt: 2, borderBottom: '1px solid', pb: 1, mb: 1 }}>
              3. Governance
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Compliance Owner</InputLabel>
              <Select
                name="ownerId"
                value={formData.ownerId}
                label="Compliance Owner"
                onChange={handleChange}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth 
              multiline 
              rows={4}
              label="Framework Description & Scope"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button 
                startIcon={<X size={18} />} 
                onClick={() => router.push('/compliance_frameworks')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={<Save size={20} />}
                sx={{ px: 4, fontWeight: 'bold' }}
              >
                {loading ? 'Processing...' : 'Establish Framework'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}