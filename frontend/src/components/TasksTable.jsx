// frontend/src/components/TasksTable.jsx
import React from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Guaranteed TasksTable: always shows columns ID, Title, Description, Created At, Actions.
 *
 * Props:
 *  - tasks: array
 *  - total: number
 *  - page: zero-based
 *  - rowsPerPage: number
 *  - loading: boolean
 *  - q: search string
 *  - onQChange, onPageChange, onEdit, onDelete, onCreate
 */
export default function TasksTable({
  tasks = [],
  total = 0,
  page = 0,
  rowsPerPage = 5,
  loading = false,
  q = "",
  onQChange,
  onPageChange,
  onEdit,
  onDelete,
  onCreate,
}) {
  // ensure tasks is array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Typography variant="h5">Tasks</Typography>
        <Box sx={{ flex: 1 }} />
        <TextField
          size="small"
          placeholder="Search title or description"
          value={q}
          onChange={(e) => onQChange && onQChange(e.target.value)}
        />
        <Button variant="contained" sx={{ ml: 1 }} onClick={() => (onCreate ? onCreate() : null)}>
          Add Task
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, p: 1.5, boxShadow: "0 8px 24px rgba(2,6,23,0.6)" }}>
        <TableContainer  sx={{ p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* FORCE the five header columns */}
                <TableCell sx={{ minWidth: 80 }}>ID</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Title</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Description</TableCell>
                <TableCell sx={{ minWidth: 160 }}>Created At</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : safeTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                safeTasks.map((task) => (
                  <TableRow key={String(task.id) || Math.random()} hover>
                    {/* ID */}
                    <TableCell>{task.id ?? "-"}</TableCell>

                    {/* Title */}
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {task.title ? String(task.title) : "-"}
                      </Typography>
                    </TableCell>

                    {/* Description */}
                    <TableCell sx={{ maxWidth: 600 }}>
                      <Typography
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {task.description ? String(task.description) : "-"}
                      </Typography>
                    </TableCell>

                    {/* Created At (show readable or fallback) */}
                    <TableCell>
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleString()
                        : task.created_at // in case backend uses different key
                        ? new Date(task.created_at).toLocaleString()
                        : "-"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => (onEdit ? onEdit(task) : null)}
                          aria-label={`edit-${task.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => (onDelete ? onDelete(task) : null)}
                          aria-label={`delete-${task.id}`}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
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
