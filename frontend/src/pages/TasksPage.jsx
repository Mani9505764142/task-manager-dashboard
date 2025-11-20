// frontend/src/pages/TasksPage.jsx
import React, { useCallback, useEffect, useState, useRef } from "react";
import TasksTable from "../components/TasksTable";
import TaskDialog from "../components/TaskDialog";
import {
  fetchTasks,
  deleteTask as apiDeleteTask,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
} from "../api/tasks";
import { Snackbar, Alert } from "@mui/material";

const ROWS_PER_PAGE = 5;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageZero, setPageZero] = useState(0); // zero-based
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const debounceRef = useRef(null);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitial, setDialogInitial] = useState(null); // null => create

  const load = useCallback(
    async (opts = {}) => {
      const pageToFetch = opts.page !== undefined ? opts.page : pageZero;
      const query = opts.q !== undefined ? opts.q : q;

      setLoading(true);
      try {
        const resp = await fetchTasks({ page: pageToFetch + 1, limit: ROWS_PER_PAGE, q: query });
        const data = resp.data;
        setTasks(Array.isArray(data.data) ? data.data : []);
        setTotal(data.meta?.total ?? 0);
        setPageZero((data.meta?.page ? data.meta.page - 1 : 0));
      } catch (err) {
        console.error("Failed to load tasks", err);
        setErrorMsg(err?.response?.data?.error || (err.message || "Failed to fetch tasks"));
      } finally {
        setLoading(false);
      }
    },
    [pageZero, q]
  );

  // initial load
  useEffect(() => {
    load({ page: 0, q: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle page change (zero-based)
  const handlePageChange = (newPageZero) => {
    setPageZero(newPageZero);
    load({ page: newPageZero });
  };

  // search debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageZero(0);
      load({ page: 0, q });
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // delete handler
  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task ${task.id} — "${task.title}"?`)) return;
    setLoading(true);
    try {
      await apiDeleteTask(task.id);
      setSuccessMsg("Task deleted successfully");
      // reload current page (server returns newest-first)
      await load({ page: pageZero, q });
    } catch (err) {
      console.error("Delete failed", err);
      setErrorMsg(err?.response?.data?.error || err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // create handler (wired to dialog)
  const handleCreateSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };
      await apiCreateTask(payload);
      setSuccessMsg("Task created successfully");
      // after creating, reload page 0 to show newest item first
      await load({ page: 0, q: "" });
      setQ("");
    } catch (err) {
      console.error("Create failed", err);
      const msg = err?.response?.data?.error || err.message || "Create failed";
      setErrorMsg(msg);
      // rethrow to allow dialog to keep open if needed
      throw err;
    }
  };

  // open create dialog
  const handleCreate = () => {
    setDialogInitial(null);
    setDialogOpen(true);
  };

  // open edit dialog
  const handleEdit = (task) => {
    // Set initial values and open dialog
    setDialogInitial({
      id: task.id,
      title: task.title,
      description: task.description,
    });
    setDialogOpen(true);
  };

  // update handler (wired to dialog for edit)
  const handleEditSubmit = async (formData) => {
    if (!dialogInitial || !dialogInitial.id) {
      // not an edit; fallback to create
      return handleCreateSubmit(formData);
    }
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };
      await apiUpdateTask(dialogInitial.id, payload);
      setSuccessMsg("Task updated successfully");
      // reload current page
      await load({ page: pageZero, q });
    } catch (err) {
      console.error("Update failed", err);
      const msg = err?.response?.data?.error || err.message || "Update failed";
      setErrorMsg(msg);
      throw err;
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <>
      <TasksTable
        tasks={tasks}
        total={total}
        page={pageZero}
        rowsPerPage={ROWS_PER_PAGE}
        loading={loading}
        q={q}
        onQChange={setQ}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={dialogInitial?.id ? handleEditSubmit : handleCreateSubmit}
        initialValues={dialogInitial}
      />

      <Snackbar open={!!errorMsg || !!successMsg} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        {errorMsg ? (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
