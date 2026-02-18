'use client';
import { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Stack, TextField, 
  MenuItem, Button, Box, Divider, Tab, Tabs 
} from "@mui/material";
import { Save, ArrowLeft, UploadCloud, FileText } from "lucide-react";
import { fetcher } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DynamicBreadcrumbs from '@/components/DynamicBreadcrumbs';
import { ComplianceFramework, Policy, User } from '@/lib/types';

export default function NewPolicyPage() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("1.0"); // Added state for version
  const [ownerId, setOwnerId] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetcher<User[]>('/api/users'),
      fetcher<[]>('/api/compliance/frameworks')
    ]).then(([userData, frameworkData]) => {
      if (Array.isArray(userData)) setUsers(userData);
      if (Array.isArray(frameworkData)) setFrameworks(frameworkData);
    });
  }, []);

  const handleSubmit = async () => {
    if (!ownerId || !frameworkId) {
      alert("Please select an owner and a framework.");
      return;
    }

    setSubmitting(true);

    try {
      if (tabIndex === 0) {
        // --- Manual JSON Path ---
        const result = await fetcher<Policy[]>('/api/policies', {
          method: 'POST',
          body: JSON.stringify({
            title, description, content, version,
            owner_id: ownerId, 
            framework_id: frameworkId,
            status: 'DRAFT'
          })
        });
        if (result) router.push('/policies');
      } else {
        // --- OCR / File Upload Path ---
        if (!file) {
          alert("Please select a BSE/NSE document.");
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('owner_id', ownerId);
        formData.append('framework_id', frameworkId);
        formData.append('version', version); // Added to FormData
        formData.append('description', description); // Added to FormData

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/policies/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          router.push('/policies');
        } else {
          const errData = await response.json();
          alert(`Upload failed: ${errData.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
       <DynamicBreadcrumbs />
      <Box sx={{ mb: 3 }}>
        <Button component={Link} href="/policies" startIcon={<ArrowLeft size={20} />} sx={{ mb: 2 }}>
          Back to Register
        </Button>
        <Typography variant="h4" fontWeight="bold">Create New Policy</Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<FileText size={18} />} label="Manual Entry" iconPosition="start" />
          <Tab icon={<UploadCloud size={18} />} label="Upload BSE/NSE PDF" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Common Fields: Owner & Framework */}
            <Stack direction="row" spacing={2}>
              <TextField select label="Policy Owner" fullWidth required value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                {users.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
              </TextField>

              <TextField select label="Compliance Framework" fullWidth required value={frameworkId} onChange={e => setFrameworkId(e.target.value)}>
                {frameworks.map(f => <MenuItem key={f.id} value={f.id}>{f.name || f.name}</MenuItem>)}
              </TextField>
            </Stack>

            {/* Version and Description now appear in both modes to ensure metadata is captured */}
            <Stack direction="row" spacing={2}>
               <TextField label="Version" placeholder="e.g. 1.0" sx={{ width: '30%' }} value={version} onChange={e => setVersion(e.target.value)} />
               <TextField label="Short Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
            </Stack>

            {tabIndex === 0 ? (
              // --- MANUAL MODE UI ---
              <>
                <TextField label="Policy Title" fullWidth required value={title} onChange={e => setTitle(e.target.value)} />
                <TextField label="Full Policy Content" multiline rows={8} fullWidth required value={content} onChange={e => setContent(e.target.value)} />
              </>
            ) : (
              // --- UPLOAD MODE UI ---
              <Box sx={{ 
                border: '2px dashed', borderColor: 'divider', p: 5, textAlign: 'center', borderRadius: 2,
                bgcolor: 'grey.50', transition: '0.3s', '&:hover': { bgcolor: 'grey.100' }
              }}>
                <UploadCloud size={48} style={{ marginBottom: 16, color: '#666' }} />
                <Typography variant="h6" gutterBottom>Upload Document</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Upload BSE/NSE Circulars (PDF or DOC). Our OCR will extract the text.
                </Typography>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ margin: '0 auto' }}
                />
                {file && (
                  <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main' }}>
                    Selected: {file.name}
                  </Typography>
                )}
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Button 
              variant="contained" size="large" fullWidth startIcon={<Save size={20} />}
              disabled={submitting} onClick={handleSubmit} sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              {submitting ? "Processing..." : tabIndex === 0 ? "Create Policy" : "Upload & Process OCR"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}