"use client";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetcher } from "@/lib/api-client";
import { Box, Typography, Button, Chip, Paper, Stack } from "@mui/material";
import { Plus, ShieldAlert, RefreshCw } from "lucide-react";
import Link from "next/link";
// 1. Import breadcrumbs for professional navigation context
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import { Risk } from "@/lib/types";

const columns: GridColDef[] = [
  { field: "title", headerName: "Risk Title", width: 250 },
  { field: "impact", headerName: "Impact", width: 100 },
  { field: "likelihood", headerName: "Likelihood", width: 100 },
  {
    field: "riskScore", // Must match the backend JSON key (e.g., 'score' or 'riskScore')
    headerName: "Risk Score",
    width: 120,
    type: "number", // Enables proper numeric sorting and right-alignment
    renderCell: (params) => {
      // Use the value from the backend; default to 0 if null/undefined
      const score = params.value ?? 0;

      // Define severity colors based on the numeric value
      const color = score >= 15 ? "error" : score >= 8 ? "warning" : "success";

      return (
        <Chip
          label={score}
          color={color}
          size="small"
          sx={{
            fontWeight: "bold",
            minWidth: 45,
            fontSize: "0.75rem",
          }}
        />
      );
    },
  },
  { field: "status", headerName: "Status", width: 150 },
  {
    field: "createdAt",
    headerName: "Identified On",
    width: 200,
    valueGetter: (value) =>
      value ? new Date(value).toLocaleDateString() : "N/A",
  },
];



export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRisks = async () => {
    setLoading(true);
    try {
      const data = await fetcher<Risk[]>("/api/risks");
      setRisks(data || []);
    } catch (err) {
      console.error("Risk Fetch Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* 2. Added Breadcrumbs at the top level */}
      <DynamicBreadcrumbs />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Risk Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Management and tracking of identified organizational risks.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button startIcon={<RefreshCw size={18} />} onClick={loadRisks}>
            Refresh
          </Button>
          <Button
            component={Link}
            href="/risks/new"
            variant="contained"
            startIcon={<Plus size={18} />}
          >
            New Assessment
          </Button>
        </Stack>
      </Box>

      {/* 3. Handle Empty State Professionally (P0 requirement) */}
      {!loading && risks.length === 0 ? (
        <Paper
          sx={{
            p: 10,
            textAlign: "center",
            bgcolor: "transparent",
            border: "1px dashed grey",
          }}
        >
          <ShieldAlert size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography variant="h6">No Risks Identified</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by performing your first risk assessment.
          </Typography>
          <Button
            component={Link}
            href="/risks/new"
            variant="outlined"
            startIcon={<Plus size={18} />}
          >
            Create First Risk
          </Button>
        </Paper>
      ) : (
        <Paper
          sx={{
            height: 600,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={risks}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25]}
            getRowId={(row) => row.id} // Essential for UUIDs
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{ border: "none" }}
          />
        </Paper>
      )}
    </Box>
  );
}
