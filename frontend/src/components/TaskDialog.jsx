// frontend/src/components/TaskDialog.jsx
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";

/**
 * TaskDialog
 * Props:
 *  - open: boolean
 *  - onClose(): called when dialog should close
 *  - onSubmit(data): called with { title, description } and should return a Promise
 *  - initialValues: { id?, title?, description? } (optional - for edit reuse)
 */
export default function TaskDialog({ open, onClose, onSubmit, initialValues = null }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Reset form when dialog opens or when editing a different task (watch id only)
  useEffect(() => {
    reset({
      title: initialValues?.title || "",
      description: initialValues?.description || "",
    });
    // Only depend on open and the task id (not the whole object)
  }, [open, initialValues?.id, reset]);

  async function handleForm(data) {
    if (!onSubmit) {
      onClose?.();
      return;
    }

    try {
      await onSubmit(data);
      // on success, close the dialog
      onClose?.();
    } catch (err) {
      // bubble the error up to the caller (caller will show snackbar)
      throw err;
    }
  }

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues && initialValues.id ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Box component="form" id="task-form" onSubmit={handleSubmit(handleForm)} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 100, message: "Title must be at most 100 characters" },
            })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 500, message: "Description must be at most 500 characters" },
            })}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="task-form" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
