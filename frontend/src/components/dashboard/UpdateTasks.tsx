import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";

interface TaskRow {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  points: number;
  slots: number;
}

interface UpdateTasksProps {
  open: boolean;
  handleClose: () => void;
  handleUpdateTaskInfo: (updatedTask: TaskRow) => void;
  taskToEdit: TaskRow | null;
}

interface FormData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  points: number;
  slots: number;
}

interface ErrorState {
  [key: string]: { error: boolean; message: string };
}

const UpdateTasks: React.FC<UpdateTasksProps> = ({
  open,
  handleClose,
  handleUpdateTaskInfo,
  taskToEdit,
}) => {
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [errorState, setErrorState] = useState<ErrorState>({
    title: { error: false, message: "" },
    subtitle: { error: false, message: "" },
    description: { error: false, message: "" },
    points: { error: false, message: "" },
    slots: { error: false, message: "" },
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  }, [taskToEdit]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateInputs()) {
      handleUpdateTaskInfo(formData as TaskRow);
    }
  };

  const setError = (field: string, error: boolean, message: string) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = (): boolean => {
    const title = document.getElementById("title") as HTMLInputElement;
    const subtitle = document.getElementById("subtitle") as HTMLInputElement;
    const description = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const points = document.getElementById("points") as HTMLInputElement;
    const slots = document.getElementById("slots") as HTMLInputElement;
    let isValid = true;

    if (!title.value || title.value.length < 1) {
      setError("title", true, "Title is required.");
      isValid = false;
    } else {
      setError("title", false, "");
    }
    if (!subtitle.value || subtitle.value.length < 1) {
      setError("subtitle", true, "Subtitle is required.");
      isValid = false;
    } else {
      setError("subtitle", false, "");
    }
    if (!description.value || description.value.length < 1) {
      setError("description", true, "Description is required.");
      isValid = false;
    } else {
      setError("description", false, "");
    }
    if (!points.value || points.value.length < 1) {
      setError("points", true, "Points is required.");
      isValid = false;
    } else {
      setError("points", false, "");
    }
    if (!slots.value || slots.value.length < 1) {
      setError("slots", true, "Slots is required.");
      isValid = false;
    } else {
      setError("slots", false, "");
    }

    return isValid;
  };

  const formFieldsLeft = [
    {
      id: "title",
      label: "Title",
      value: formData.title,
      error: errorState.title.error,
      helperText: errorState.title.message,
    },
    {
      id: "subtitle",
      label: "Subtitle",
      value: formData.subtitle,
      error: errorState.subtitle.error,
      helperText: errorState.subtitle.message,
    },

    {
      id: "description",
      label: "Description",
      value: formData.description,
      error: errorState.description.error,
      helperText: errorState.description.message,
    },
    {
      id: "points",
      label: "points",
      type: "number",
      value: formData.points,

      error: errorState.points.error,
      helperText: errorState.points.message,
    },
    {
      id: "slots",
      label: "Slots",
      value: formData.slots,
      type: "number",
      error: errorState.slots.error,
      helperText: errorState.slots.message,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose();
      }}
      aria-labelledby="update-task-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="user-dialog-title">Task Details</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {formFieldsLeft.map((field) => (
            <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
              <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
              <TextField
                autoComplete={field.id}
                name={field.id}
                id={field.id}
                fullWidth
                variant="outlined"
                value={field.value}
                type={field.type}
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
                error={field.error}
                helperText={field.helperText}
                color={field.error ? "error" : "primary"}
              />
            </FormControl>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateTasks.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleUpdateTaskInfo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  taskToEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    slots: PropTypes.number.isRequired,
    acceptedBy: PropTypes.arrayOf(PropTypes.any).isRequired,
    userStatuses: PropTypes.arrayOf(PropTypes.any).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }),
};

export default UpdateTasks;
