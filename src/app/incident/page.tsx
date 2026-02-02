"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import api from "@/lib/api";

export default function IncidentPage() {
  const [incidents, setIncidents] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    status: "OPEN",
    reporterEmail: "",
    reporterRole: "USER",
  });

  const columns: GridColDef[] = [
    { field: "title", headerName: "Incident", flex: 1 },
    {
      field: "severity",
      headerName: "Severity",
      width: 120,
      renderCell: (params) => {
        const color =
          params.value === "CRITICAL" || params.value === "HIGH"
            ? "error"
            : "warning";
        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },
    {
      field: "reporterName",
      headerName: "Reporter",
      width: 150,
      valueGetter: (_value, row) => row.reportedBy?.name || "N/A",
    },
    {
      field: "reportedBy",
      headerName: "Reported By (Contact)",
      flex: 1,
      valueGetter: (_value, row) => {
        if (!row.reportedBy) return "Unassigned";
        return `${row.reportedBy.email} (${row.reportedBy.role})`;
      },
    },
    {
      field: "DateReported",
      headerName: "Date Reported",
      width: 150,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "",
    },
    { field: "status", headerName: "Status", width: 120 },
  ];

  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleReport = async () => {
    let payload = {};

    try {
      payload = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: formData.status,
        DateReported: new Date().toISOString().split("T")[0],
        reportedBy: {
          email: formData.reporterEmail,
          role: formData.reporterRole,
        },
      };

      await api.post("/incidents", payload);
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        severity: "MEDIUM",
        status: "OPEN",
        reporterEmail: "",
        reporterRole: "USER",
      });
      fetchIncidents();
    } catch (err: any) {
      console.error("Payload sent:", payload);
      console.error("Error details:", err.response?.data);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Incidents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage security incidents.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Report Incident
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={incidents}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Report New Incident</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            label="Incident Title"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            select
            label="Severity"
            fullWidth
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: e.target.value })
            }
          >
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((sev) => (
              <MenuItem key={sev} value={sev}>
                {sev}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Reporter Email"
            fullWidth
            value={formData.reporterEmail}
            onChange={(e) =>
              setFormData({ ...formData, reporterEmail: e.target.value })
            }
          />

          <TextField
            select
            label="Reporter Role"
            fullWidth
            value={formData.reporterRole}
            onChange={(e) =>
              setFormData({ ...formData, reporterRole: e.target.value })
            }
          >
            {["ADMIN", "USER", "AUDITOR"].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReport}>
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}