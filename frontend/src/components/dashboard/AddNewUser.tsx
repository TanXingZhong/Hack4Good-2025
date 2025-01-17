import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";

interface UserRowPassword {
  id: string;
  name: string;
  email: string;
  voucher: string;
  sex: string;
  admin: boolean;
  phonenumber: string;
  isActive: boolean;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateUserProps {
  open: boolean;
  handleClose: () => void;
  handleUpdateUserInfo: (updatedUser: UserRowPassword) => void;
  selectedUser: UserRowPassword | null;
}

interface FormData {
  id: string;
  name: string;
  email: string;
  voucher: string;
  sex: string;
  admin: boolean;
  phonenumber: string;
  isActive: boolean;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorState {
  [key: string]: { error: boolean; message: string };
}

const AddNewUser: React.FC<UpdateUserProps> = ({
  open,
  handleClose,
  handleUpdateUserInfo,
  selectedUser,
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    email: "",
    voucher: "",
    sex: "",
    admin: false,
    phonenumber: "",
    isActive: false,
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setFormData({
      id: "",
      name: "",
      email: "",
      voucher: "",
      sex: "Male",
      admin: false,
      phonenumber: "",
      isActive: true,
      newPassword: "",
      confirmPassword: "",
    });
  }, [open]);
  const [errorState, setErrorState] = useState<ErrorState>({
    name: { error: false, message: "" },
    email: { error: false, message: "" },
    voucher: { error: false, message: "" },
    admin: { error: false, message: "" },
    sex: { error: false, message: "" },
    phonenumber: { error: false, message: "" },
    isActive: { error: false, message: "" },
    newPassword: { error: false, message: "" },
    confirmPassword: { error: false, message: "" },
  });

  useEffect(() => {
    if (selectedUser) {
      console.log(selectedUser);
      setFormData(selectedUser);
    }
  }, [selectedUser]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateInputs()) {
      handleUpdateUserInfo(formData as UserRowPassword);
      handleClose();
    }
  };

  const setError = (field: string, error: boolean, message: string) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = (): boolean => {
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const phonenumber = document.getElementById(
      "phonenumber"
    ) as HTMLInputElement;
    let isValid = true;

    if (!name.value || name.value.length < 1) {
      setError("name", true, "Name is required.");
      isValid = false;
    } else {
      setError("name", false, "");
    }

    if (phonenumber.value && !/^\d+$/.test(phonenumber.value)) {
      setError("phonenumber", true, "Phone Number must be a valid number.");
      isValid = false;
    } else {
      setError("phonenumber", false, "");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setError("email", true, "Please enter a valid email address.");
      isValid = false;
    } else {
      setError("email", false, "");
    }

    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;
    const newPassword = document.getElementById(
      "newPassword"
    ) as HTMLInputElement;

    if (newPassword.value && newPassword.value.length < 8) {
      setError(
        "newPassword",
        true,
        "Password must be at least 8 characters long."
      );
      isValid = false;
    } else {
      setError("newPassword", false, "");
    }

    if (confirmPassword.value && confirmPassword.value !== newPassword.value) {
      setError("confirmPassword", true, "Passwords must match.");
      isValid = false;
    } else {
      setError("confirmPassword", false, "");
    }

    return isValid;
  };

  const formFieldsLeft = [
    {
      id: "name",
      label: "Full name",
      placeholder: "John Tan",
      value: formData.name,
      error: errorState.name.error,
      helperText: errorState.name.message,
    },
    {
      id: "email",
      label: "Email",
      value: formData.email,
      placeholder: "john.tan@example.com",
      error: errorState.email.error,
      helperText: errorState.email.message,
    },
    {
      id: "phonenumber",
      label: "Phone Number",
      value: formData.phonenumber,
      placeholder: "91234567",
      error: errorState.phonenumber.error,
      helperText: errorState.phonenumber.message,
    },
    {
      id: "sex",
      label: "Sex",
      type: "select",
      value: formData.sex,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      error: false,
      helperText: "",
    },
  ];

  const formFieldsRight = [
    {
      id: "newPassword",
      label: "New Password",
      placeholder: "●●●●●●●●",
      type: "password",
      value: formData.newPassword,
      error: errorState.newPassword.error,
      helperText: errorState.newPassword.message,
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      placeholder: "●●●●●●●●",
      type: "password",
      value: formData.confirmPassword,
      error: errorState.confirmPassword.error,
      helperText: errorState.confirmPassword.message,
    },
  ];

  const actionsData = [
    { id: "admin", name: "admin", label: "Admin", checked: false },
    { id: "isActive", name: "isActive", label: "Active", checked: true },
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
      aria-labelledby="update-user-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="user-dialog-title">New User Details</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type === "select" ? (
                  <TextField
                    required
                    id={field.id}
                    name={field.id}
                    select
                    value={field.value}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    fullWidth
                  >
                    {field.options &&
                      field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <TextField
                    autoComplete={field.id}
                    name={field.id}
                    id={field.id}
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    error={field.error}
                    helperText={field.helperText}
                    color={field.error ? "error" : "primary"}
                  />
                )}
              </FormControl>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid sx={{ display: "flex", flexDirection: "column" }}>
              <FormLabel>Actions</FormLabel>
              {actionsData.map((action) => (
                <FormControlLabel
                  key={action.name}
                  control={
                    <Switch
                      name={action.name}
                      id={action.name}
                      checked={Boolean(formData[action.name as keyof FormData])}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [action.name]: e.target.checked ? 1 : 0,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={action.label}
                  sx={{ marginBottom: 2 }}
                />
              ))}
            </Grid>
            {formFieldsRight.map((field) => (
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
                  placeholder={field.placeholder}
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
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddNewUser.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleUpdateUserInfo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    voucher: PropTypes.string.isRequired,
    admin: PropTypes.bool.isRequired,
    phonenumber: PropTypes.string.isRequired,
    sex: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    newPassword: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }),
};

export default AddNewUser;
