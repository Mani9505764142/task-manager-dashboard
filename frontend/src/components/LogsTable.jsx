// frontend/src/components/LogsTable.jsx
import React from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";

/**
 * LogsTable
 * Props:
 *  - logs: array of { id, timestamp, action, taskId, updatedContent, notes }
 *  - total: number
 *  - page: zero-based
 *  - rowsPerPage: number
 *  - loading: boolean (if you want to show spinner externally)
 *  - onPageChange(newZeroBasedPage)
 */
export default function LogsTable({ logs = [], total = 0, page = 0, rowsPerPage = 10, onPageChange }) {
  // map action type to color (MUI color labels)
  const actionColor = (action) => {
    if (!action) return "default";
    const a = action.toLowerCase();
    if (a.includes("create")) return "success";
    if (a.includes("update")) return "warning";
    if (a.includes("delete")) return "error";
    return "default";
  };

  return (
    <Box>
      <Paper sx={{ borderRadius: 2, p: 1.5, boxShadow: "0 8px 24px rgba(2,6,23,0.6)" }}>
        <TableContainer sx={{ p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 160 }}>Timestamp</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Action</TableCell>
                <TableCell sx={{ minWidth: 90 }}>Task ID</TableCell>
                <TableCell>Updated Content / Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    No logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={log.action} color={actionColor(log.action)} size="small" />
                    </TableCell>

                    <TableCell>{log.taskId ?? "-"}</TableCell>

                    <TableCell>
                      {log.updatedContent && Object.keys(log.updatedContent).length ? (
                        <Box component="div">
                          {Object.entries(log.updatedContent).map(([k, v]) => (
                            <Box key={k} sx={{ mb: 0.5 }}>
                              <Typography component="span" sx={{ fontWeight: 600, mr: 1 }}>
                                {k}:
                              </Typography>
                              <Typography component="span">{String(v)}</Typography>
                            </Box>
                          ))}
                          {log.notes ? (
                            <Typography variant="caption" color="text.secondary">
                              Notes: {log.notes}
                            </Typography>
                          ) : null}
                        </Box>
                      ) : log.notes ? (
                        <Typography>{log.notes}</Typography>
                      ) : (
                        <Typography color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => onPageChange && onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Paper>
    </Box>
  );
}
