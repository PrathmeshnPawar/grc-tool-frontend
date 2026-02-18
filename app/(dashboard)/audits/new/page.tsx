"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Container,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV2";
import { ClipboardCheck, ArrowLeft } from "lucide-react";
import { fetcher } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import { ApiResponse, Audit, Risk, User ,} from "@/lib/types";


export default function NewAuditPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leadAuditorId, setLeadAuditorId] = useState("");
  const [selectedRiskId, setSelectedRiskId] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);
  const [users, setUsers] = useState<User[]>([]); // New state for Auditors
  const [submitting, setSubmitting] = useState(false);

  // Load Risks and Users on mount
  useEffect(() => {
    Promise.all([fetcher<Risk[]>("/api/risks"), fetcher<User[]>("/api/users")])
      .then(([riskData, userData]) => {
        // Your fetcher now returns the raw array directly
        // If it's an array, we set it. No more .success check
        if (Array.isArray(riskData)) setRisks(riskData);
        if (Array.isArray(userData)) setUsers(userData);
      })
      .catch((err) => console.error("Loading failed:", err));
  }, []);

 const handleSubmit = async () => {
  // 1. Initial Guard: Block empty submissions
  if (!name || !startDate || !endDate) return;

  setSubmitting(true);
  try {
    // 2. Wizard Move: Pass the ApiResponse wrapper to the fetcher
    // Note: I renamed 'start_date' to 'startDate' to match standard Java DTOs
    const result = await fetcher<ApiResponse<Audit>>("/api/audits", {
      method: "POST",
      body: JSON.stringify({
        name,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        status: "PLANNED",
        leadAuditorId: leadAuditorId || null, 
        riskId: selectedRiskId || null,
      }),
    });

    // 3. Logic handling based on the Result Wrapper
    if (result.success) {
      router.push("/audits");
    } else if (result.error === "UNAUTHORIZED") {
      router.push("/");
    } else {
      // Provide a fallback for the error message to prevent blank alerts
      alert("Creation failed: " + (result.error || "Server-side error occurred"));
    }
  } catch (error) {
    console.error("Critical API Error:", error);
    alert("Network error: Unable to reach the GRC backend.");
  } finally {
    // 4. Always reset loading state, even on catch
    setSubmitting(false);
  }
};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DynamicBreadcrumbs />
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            href="/audits"
            startIcon={<ArrowLeft size={20} />}
            sx={{ minWidth: 0, p: 1 }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Schedule New Audit
            </Typography>
            <Typography color="text.secondary">
              Select an auditor and a risk to link this review.
            </Typography>
          </Box>
        </Box>

        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={4}>
            <TextField
              fullWidth
              label="Audit Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Auditor Selection Dropdown */}
            <TextField
              select
              fullWidth
              label="Lead Auditor"
              value={leadAuditorId}
              onChange={(e) => setLeadAuditorId(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>Select an Auditor</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {/* Changed user.fullName to user.name to match your JSON */}
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Associated Risk"
              value={selectedRiskId}
              onChange={(e) => setSelectedRiskId(e.target.value)}
            >
              <MenuItem value="">
                <em>None / General Audit</em>
              </MenuItem>
              {risks.map((risk) => (
                <MenuItem key={risk.id} value={risk.id}>
                  {risk.title || risk.title}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 3 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                sx={{ flex: 1 }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                sx={{ flex: 1 }}
                minDate={startDate || undefined}
              />
            </Box>

            <Divider />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={
                submitting || !name || !startDate || !endDate || !leadAuditorId
              }
              startIcon={<ClipboardCheck size={20} />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}
            >
              {submitting ? "Scheduling..." : "Create Audit Schedule"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
