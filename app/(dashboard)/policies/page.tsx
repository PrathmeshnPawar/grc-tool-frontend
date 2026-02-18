"use client";
import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetcher } from "@/lib/api-client";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Paper,
} from "@mui/material";
// Added FileText icon for the view button
import { Plus, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Policy {
  id: string;
  title: string;
  version: string;
  status: string;
  description: string;
  content: string;
  isProcessed: boolean;
  lastUpdated: string;
  filePath: string | null;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPolicies = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetcher<Policy[]>("/api/policies");
      if (Array.isArray(data)) {
        setPolicies(data);
      }
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies(true);
  }, [loadPolicies]);

  useEffect(() => {
    const needsPolling = policies.some((p) => p.isProcessed === false);
    if (needsPolling) {
      const interval = setInterval(() => {
        loadPolicies();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [policies, loadPolicies]);

  const columns: GridColDef<Policy>[] = [
    { field: "title", headerName: "Policy Title", width: 250 },
    {
      field: "isProcessed",
      headerName: "OCR Status",
      width: 150,
      renderCell: (params) => {
        const { isProcessed, filePath, content } = params.row;
        if (!filePath) {
          return (
            <Chip
              label="Manual"
              variant="outlined"
              size="small"
              sx={{ color: "text.secondary", borderColor: "divider" }}
            />
          );
        }
        if (isProcessed === true && !content?.startsWith("ERROR")) {
          return (
            <Chip
              icon={<CheckCircle2 size={14} />}
              label="Ready"
              color="success"
              variant="outlined"
              size="small"
            />
          );
        }
        if (content?.startsWith("ERROR")) {
          return (
            <Chip
              icon={<AlertCircle size={14} />}
              label="Failed"
              color="error"
              size="small"
            />
          );
        }
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={14} thickness={5} />
            <Typography
              variant="caption"
              sx={{ fontWeight: "medium", color: "text.secondary" }}
            >
              Processing...
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "status",
      headerName: "Workflow",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value as string}
          color={params.value === "ACTIVE" ? "success" : "default"}
          size="small"
        />
      ),
    },
    { field: "version", headerName: "Ver", width: 80 },
    // --- NEW ACTIONS COLUMN ---
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const { filePath, id } = params.row;

        // Only show button if a file exists on the server
        if (!filePath) return null;

        return (
          <Button
            size="small"
            variant="text"
            startIcon={<FileText size={16} />}
            onClick={() => {
              // Construct the absolute URL to bypass any fetcher-side interceptors
              const baseUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";
              const url = `${baseUrl}/api/policies/${id}/view`;

              // Opening the URL directly in a new tab forces the browser to handle the PDF
              window.open(url, "_blank");
            }}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            View PDF
          </Button>
        );
      },
    },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      width: 180,
      valueFormatter: (value) => value || "Pending...",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={3}
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Policy Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage regulatory documents and internal guidelines.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => router.push("/policies/new")}
          sx={{ borderRadius: 2, px: 3, fontWeight: "bold" }}
        >
          Create Policy
        </Button>
      </Stack>

      <Paper
        sx={{
          height: 650,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <DataGrid<Policy>
          rows={policies}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
