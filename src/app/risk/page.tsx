"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import api from "@/lib/api";

export default function RiskPage() {
  const [risks, setRisks] = useState([]);
  const categories = ['STRATEGIC', 'OPERATIONAL', 'FINANCIAL', 'COMPLIANCE'];
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    impact: 1,
    likelihood: 1,
    category: "OPERATIONAL",
    date: new Date().toISOString().split('T')[0],
  });

  const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'riskScore', headerName: 'Score', width: 90 },
  { field: 'status', headerName: 'Status', width: 120 },
// src/app/risk/page.tsx

{ 
  field: 'createdAt', 
  headerName: 'Date Created', 
  width: 180,
  // In newer MUI versions, the first argument is the value itself
  valueFormatter: (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
  }
},
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    renderCell: (params) => (
      <IconButton onClick={() => handleOpenEdit(params.row)}>
        <EditIcon fontSize="small" />
      </IconButton>
    ),
  },
];

  const fetchRisks = () => {
    api
      .get("/risks")
      .then((res) => setRisks(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleOpenEdit = (risk: any) => {
    setEditingId(risk.id);
    setFormData({
      title: risk.title,
      description: risk.description,
      impact: risk.impact,
      likelihood: risk.likelihood,
      category: risk.category,
      date: risk.date,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Calls @PutMapping("/{riskId}") in RiskController.java
        await api.put(`/risks/${editingId}`, formData);
      } else {
        // Calls @PostMapping
        await api.post("/risks", formData);
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        impact: 1,
        likelihood: 1,
        category: "OPERATIONAL",
        date: new Date().toISOString().split('T')[0],
      });
      fetchRisks();
    } catch (error) {
      console.error("Save error", error);
    }
  };

  return (
<Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>Risk Register</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Identify New Risk
        </Button>
      </Box>

      <Paper 
        sx={{ 
          height: 600, 
          width: '100%',
          borderRadius: 2, // Matches theme.shape.borderRadius
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider', // Matches theme.palette.divider (#E2E8F0)
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' 
        }}
      >
        <DataGrid 
          rows={risks} 
          columns={columns} 
          getRowId={(row) => row.id} 
          sx={{
            border: 'none', // Remove default internal DataGrid border
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#F8FAFC', // Matches theme.background.default
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid',
              borderColor: 'divider',
            },
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Edit Risk" : "Identify New Risk"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            label="Risk Title"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              label="Impact"
              fullWidth
              value={formData.impact}
              onChange={(e) =>
                setFormData({ ...formData, impact: Number(e.target.value) })
              }
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Likelihood"
              fullWidth
              value={formData.likelihood}
              onChange={(e) =>
                setFormData({ ...formData, likelihood: Number(e.target.value) })
              }
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
