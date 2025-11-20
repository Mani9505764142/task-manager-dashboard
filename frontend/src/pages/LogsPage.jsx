// frontend/src/pages/LogsPage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, TextField, MenuItem, Button, Stack, Snackbar, Alert, Typography } from "@mui/material";
import LogsTable from "../components/LogsTable";
import { fetchLogs } from "../api/logs";

const ROWS_PER_PAGE = 10;
const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "Create Task", label: "Create Task" },
  { value: "Update Task", label: "Update Task" },
  { value: "Delete Task", label: "Delete Task" },
];

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageZero, setPageZero] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [taskIdFilter, setTaskIdFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const debounceRef = useRef(null);

  const load = useCallback(
    async (opts = {}) => {
      const pageToFetch = opts.page !== undefined ? opts.page : pageZero;
      const action = opts.action !== undefined ? opts.action : actionFilter;
      const taskId = opts.taskId !== undefined ? opts.taskId : taskIdFilter;

      setLoading(true);
      try {
        const params = { page: pageToFetch + 1, limit: ROWS_PER_PAGE };
        if (action) params.action = action;
        if (taskId) params.taskId = taskId;

        const resp = await fetchLogs(params);
        const data = resp.data;
        setLogs(Array.isArray(data.data) ? data.data : []);
        setTotal(data.meta?.total ?? 0);
        setPageZero((data.meta?.page ? data.meta.page - 1 : 0));
      } catch (err) {
        console.error("Failed to load logs", err);
        setErrorMsg(err?.response?.data?.error || err.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    },
    [pageZero, actionFilter, taskIdFilter]
  );

  // initial load
  useEffect(() => {
    load({ page: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle page change
  const handlePageChange = (newPageZero) => {
    setPageZero(newPageZero);
    load({ page: newPageZero });
  };

  // debounce filters
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageZero(0);
      load({ page: 0, action: actionFilter, taskId: taskIdFilter });
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, taskIdFilter]);

  const handleClearFilters = () => {
    setActionFilter("");
    setTaskIdFilter("");
    setPageZero(0);
    load({ page: 0, action: "", taskId: "" });
  };

  const handleCloseSnackbar = () => setErrorMsg(null);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Audit Logs
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="Action"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {ACTION_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Task ID"
          placeholder="Filter by task ID"
          size="small"
          value={taskIdFilter}
          onChange={(e) => setTaskIdFilter(e.target.value)}
          sx={{ width: 160 }}
        />

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" onClick={handleClearFilters}>
          Clear
        </Button>
      </Stack>

      <LogsTable
        logs={logs}
        total={total}
        page={pageZero}
        rowsPerPage={ROWS_PER_PAGE}
        loading={loading}
        onPageChange={handlePageChange}
      />

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
