import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, IconButton, Snackbar, Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createNewUser,
  deleteAccount,
  getUsers,
  updateAccount,
  updateUserPrivilege,
} from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { PasswordRounded } from "@mui/icons-material";
import UpdateUserPassword from "../dashboard/UpdateUserPassword";
import UpdateUser from "../dashboard/UpdateUser";
import AddNewUser from "../dashboard/AddNewUser";

interface UserRow {
  id: string;
  name: string;
  email: string;
  voucher: string;
  sex: string;
  admin: boolean;
  phonenumber: string;
  isActive: boolean;
}

interface UserPassword {
  id: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRowPassword {
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

const Users: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpdatePassword, setOpenUpdatePassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [selectedUserPassword, setSelectedUserPassword] =
    useState<UserPassword | null>(null);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const displaySnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    console.log(message);
  };

  // close snackbar/toast
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpenUpdate = (row: UserRow) => {
    setLoading(true);
    setSelectedUser(null);

    setTimeout(() => {
      setSelectedUser(row);
      setLoading(false);
    }, 0);
  };

  const handleClickOpenUpdatePassword = (row: UserPassword) => {
    setLoading(true);
    setSelectedUserPassword(null);

    setTimeout(() => {
      setSelectedUserPassword(row);
      setLoading(false);
    }, 0);
  };

  useEffect(() => {
    if (selectedUser && Object.keys(selectedUser).length > 0) {
      setOpenUpdate(true);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUserPassword && Object.keys(selectedUserPassword).length > 0) {
      setOpenUpdatePassword(true);
    }
  }, [selectedUserPassword]);

  const handleCloseUpdate = () => {
    setOpenAdd(false);
    setOpenUpdate(false);
    setOpenUpdatePassword(false);
    setSelectedUser(null);
    setSelectedUserPassword(null);
  };

  const handleAddUserInfo = (newUser: UserRowPassword) => {
    createNewUser(newUser).then((response) => {
      if (response.status === 201) {
        displaySnackbar("User created successfully");
        console.log("FULL RESPONSE: ", response);
        updateRows();
      } else {
        displaySnackbar("User creation failed: " + response.message);
        updateRows();
      }
    });
  };

  const handleUpdateUserInfo = (updatedUser: UserRow) => {
    handleCloseUpdate();
    setSelectedUser(updatedUser);

    // update admin privileges of user in backend
    updateUserPrivilege(updatedUser.id, updatedUser.admin).then((response) => {
      if (response.status === 200) {
        displaySnackbar("User permissions change successful");
      } else {
        displaySnackbar("User permissions change failed: " + response.message);
      }
    });

    // update user in backend
    updateAccount({
      id: updatedUser.id,
      username: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phonenumber,
      voucher: updatedUser.voucher,
      gender: updatedUser.sex,
      isActive: updatedUser.isActive,
    }).then((response) => {
      if (response.status === 200) {
        displaySnackbar("User update successful");
      } else {
        displaySnackbar("User update failed: " + response.message);
      }
    });
  };

  const handleUpdateUserInfoPassword = (updatedUser: UserPassword) => {
    handleCloseUpdate();
    setSelectedUserPassword(updatedUser);

    // update user password in backend
    updateAccount({
      id: updatedUser.id,
      newPassword: updatedUser.newPassword,
    }).then((response) => {
      if (response.status === 200) {
        displaySnackbar("User update successful");
      } else {
        displaySnackbar("User update failed: " + response.message);
      }
    });
  };

  const handleClickOpenDelete = (id: string) => {
    console.log("Delete user with id:", id);

    deleteAccount(id).then((response) => {
      if (response.status === 200) {
        displaySnackbar("User deletion successful");
      } else {
        displaySnackbar("User deletion failed");
      }
      updateRows();
    });
  };

  const [rows, setRows] = useState<UserRow[]>([]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", editable: false, width: 150 },
    { field: "email", headerName: "Email", editable: false, width: 300 },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      editable: false,
      width: 150,
    },
    { field: "voucher", headerName: "Voucher", editable: false, width: 120 },
    { field: "admin", headerName: "Admin", editable: false, width: 70 },
    { field: "sex", headerName: "Gender", editable: false, width: 70 },
    { field: "isActive", headerName: "Active", editable: false, width: 70 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="edit"
            onClick={() => handleClickOpenUpdate(params.row as UserRow)}
          >
            <EditIcon fontSize="small" sx={{ color: "blue" }} />
          </IconButton>
          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="edit"
            onClick={() =>
              handleClickOpenUpdatePassword({
                id: params.row.id,
                newPassword: "",
                confirmPassword: "",
              })
            }
          >
            <PasswordRounded fontSize="small" sx={{ color: "green" }} />
          </IconButton>
          {auth.id !== params.id ? (
            <IconButton
              sx={{
                border: "none",
                borderRadius: "50%",
              }}
              aria-label="delete"
              onClick={() => handleClickOpenDelete((params.row as UserRow).id)}
            >
              <DeleteIcon fontSize="small" sx={{ color: "red" }} />
            </IconButton>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];

  const updateRows = () => {
    getUsers().then((response) => {
      if (response.status === 200) {
        setRows(
          response.data.map((row: any) => {
            return {
              id: row._id,
              name: row.username,
              email: row.email,
              voucher: row.voucher,
              phonenumber: row.phoneNumber,
              sex: row.gender,
              admin: row.isAdmin,
              isActive: row.isActive,
            } as UserRow;
          })
        );
      } else {
        console.error("Could not fetch users!");
        setRows([]);
      }
    });
  };

  // get users from database
  useEffect(updateRows, [openUpdate, openUpdatePassword]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Stack direction="row" display="flex" alignItems="center" sx={{ mb: 2 }}>
        <Typography flexGrow="1" component="h2" variant="h6">
          Manage Users
        </Typography>
        <Button variant="outlined" onClick={() => setOpenAdd(true)}>
          Add New User
        </Button>
      </Stack>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params: GridRowClassNameParams) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
      />
      <AddNewUser
        open={openAdd}
        handleClose={handleCloseUpdate}
        handleUpdateUserInfo={handleAddUserInfo}
        selectedUser={null}
      />
      {selectedUser && (
        <UpdateUser
          open={openUpdate}
          handleClose={handleCloseUpdate}
          handleUpdateUserInfo={handleUpdateUserInfo}
          selectedUser={selectedUser}
        />
      )}
      {selectedUserPassword && (
        <UpdateUserPassword
          open={openUpdatePassword}
          handleClose={handleCloseUpdate}
          handleUpdateUserInfo={handleUpdateUserInfoPassword}
          selectedUser={selectedUserPassword}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Users;
