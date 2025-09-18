import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff, Edit, Check, Close, } from "@mui/icons-material";
import { useAuth } from "../auth/userAuth";
import { useNotification } from "../components/useNotification";
import { userService } from "../api/userService";
import type { IResult } from "../interfaces/ICommons";
import type { IUserLogin } from "../interfaces/IAuth";
import { useLoading } from "../components/useLoading";
import axios from "axios";
import httpClient from '../api/httpClient';

const User: React.FC = () => {
  const { user, logout, userUpdate, } = useAuth();
  const { notify, } = useNotification();
  const { openLoading, closeLoading, } = useLoading();

  // Editable fields state
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);

  // Delete account dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSaveFirstName = () => {
    if (!firstName || firstName?.trim() === '') {
      setFirstName(user?.first_name || '');
    }
    setIsEditingFirstName(false);
  };

  const handleSaveLastName = () => {
    if (!lastName || lastName?.trim() === '') {
      setLastName(user?.last_name || '');
    }
    setIsEditingLastName(false);
  };

  const handleSaveAllChanges = async () => {
    const userLogin: IUserLogin = { id: '', first_name: '', last_name: '', email: '', is_deleted: false, created_at: 0, updated_at: 0, };
    let response: IResult<IUserLogin> = { success: true, message: '', data: userLogin, };
    try {
      setIsEditingFirstName(false);
      setIsEditingLastName(false);

      openLoading();
      const dataUpdate = { first_name: !firstName ? user?.first_name : firstName, last_name: !lastName ? user?.last_name : lastName, email: user?.email, };
      const updatedUser = await userService.userPut(user?.id, dataUpdate);
      response.data = updatedUser;
      response = userUpdate(response.data);
      if (!response.success) {
        closeLoading();
        notify(response.message, 'error', 4000);
      }

      notify('Changes saved successfully', 'success', 4000);
      closeLoading();
    } catch (ex) {
      let msgText = '';
      if (axios.isAxiosError(ex)) {
        msgText = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
      } else if (ex instanceof Error) {
        msgText = ex?.message;
      } else {
        msgText = String(ex);
      }
      closeLoading();
      console.log(ex);
      notify(msgText, 'error', 4000);
    }
  };

  const handleOpenDelete = () => {
    setPassword("");
    setError("");
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      setError('');
      setShowPassword(false);
      openLoading();

      await httpClient.delete(
        `/users/${user?.id}`,
        {
          headers: {
            'User-Password': password?.trim(),
          }
        }
      );

      handleCloseDelete();
      logout();
      closeLoading();
    } catch (ex) {
      let msgText = '';
      if (axios.isAxiosError(ex)) {
        msgText = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
      } else if (ex instanceof Error) {
        msgText = ex?.message;
      } else {
        msgText = String(ex);
      }
      setError(`An error occurred while deleting the account. ${msgText}`);
    }
    closeLoading();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Profile (Private)
        </Typography>

        {user ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>ID:</strong> {user.id}
            </Typography>

            {/* First Name */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {isEditingFirstName ? (
                <>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAllChanges(); }}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton color="success" onClick={handleSaveFirstName}>
                    <Check />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => {
                    setFirstName(user?.first_name);
                    setIsEditingFirstName(false)
                  }}>
                    <Close />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    <strong>First Name:</strong> {firstName}
                  </Typography>
                  <IconButton color="primary" onClick={() => setIsEditingFirstName(true)}>
                    <Edit />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Last Name */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {isEditingLastName ? (
                <>
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAllChanges(); }}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton color="success" onClick={handleSaveLastName}>
                    <Check />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => {
                    setLastName(user?.last_name);
                    setIsEditingLastName(false);
                  }}>
                    <Close />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    <strong>Last Name:</strong> {lastName}
                  </Typography>
                  <IconButton color="primary" onClick={() => setIsEditingLastName(true)}>
                    <Edit />
                  </IconButton>
                </>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Created:</strong>{" "}
              {new Date(user.created_at * 1000).toLocaleDateString("en-EU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllChanges}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDelete}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No user data available.</Typography>
        )}
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your password to confirm you want to delete your
            account. This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => { setError('') }}
            onKeyDown={(e) => {
              if (e?.key === 'Enter') {
                handleConfirmDelete();
              }
            }}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default User;