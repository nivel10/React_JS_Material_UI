import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/UserAuth";
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
  ListItemButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" }
  ];

  const privateLinks = [
    { label: "Home", to: "/" },
    { label: "Task", to: "/task" },
    // { label: "User", to: "/user" }
  ];

   const privateLinksMobile = [
    { label: "Home", to: "/" },
    { label: "Task", to: "/task" },
    { label: "User", to: "/user" }
  ];

  const linksToShow = isAuthenticated ? privateLinks : publicLinks;
  const linksToShowMovil = isAuthenticated ? privateLinksMobile : publicLinks;

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent", color: "inherit" }}
      >
        <Toolbar>
          {/* Logo / título */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            Mi App
          </Typography>

          {/* desktop */}
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
                {/* <Typography variant="body2" sx={{ alignSelf: "center" }}>
                 {`${user?.first_name}, ${user?.last_name}`}
                </Typography> */}
                <Link component={RouterLink}
                  to={'/user'}
                  underline="none"
                  color="primary"> {`${user?.first_name}, ${user?.last_name}`}</Link>
                <Button
                  variant="contained"
                  //color="inherit"
                  endIcon={<LogoutIcon />}
                  onClick={logout}
                >
                  Salir
                </Button>
              </>
            )}
          </Box>

          {/* Botón hamburguesa en móvil */}
          <IconButton
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* mobile */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {linksToShowMovil.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton component={RouterLink} to={link.to}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton onClick={logout}>
                  <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                  <ListItemText primary="Salir" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;