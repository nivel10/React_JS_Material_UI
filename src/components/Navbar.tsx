import React, { useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/userAuth";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
    if (!state && menuButtonRef.current) {
      // Return focus to the menu button when closing
      menuButtonRef.current.focus();
    }
  };

  const handleOpenConfirm = () => {
    // Remove focus from the button that opened the dialog to avoid aria-hidden warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleConfirmLogout = () => {
    setOpenConfirm(false);
    logout();
  };

  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" }
  ];

  const privateLinks = [
    { label: "Home", to: "/" },
    { label: "Tasks", to: "/tasks" },
  ];

  const privateLinksMobile = [
    { label: "Home", to: "/" },
    { label: "Tasks", to: "/tasks" },
    { label: "User", to: "/user" }
  ];

  const linksToShow = isAuthenticated ? privateLinks : publicLinks;
  const linksToShowMobile = isAuthenticated ? privateLinksMobile : publicLinks;

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent", color: "inherit" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            My App
          </Typography>

          {/* Desktop */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {linksToShow.map((link) => (
              <Link
                key={link.to}
                component={RouterLink}
                to={link.to}
                underline="none"
                color="inherit"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  component={RouterLink}
                  to={'/user'}
                  underline="none"
                  color="primary"
                >
                  {`${user?.first_name}, ${user?.last_name}`}
                </Link>
                <Button
                  variant="contained"
                  endIcon={<LogoutIcon />}
                  onClick={handleOpenConfirm}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile burger menu */}
          <IconButton
            ref={menuButtonRef}
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {linksToShowMobile.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton component={RouterLink} to={link.to}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleOpenConfirm}>
                  <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Logout confirmation dialog */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of the application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            No
          </Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;