// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../auth/UserAuth";
// import { Button } from "@mui/material";
// import LogoutIcon from '@mui/icons-material/Logout';

// const Navbar: React.FC = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   return (
//     <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
//       <Link to="/">Home</Link>
//       {isAuthenticated ? (
//         <>
//           <Link to="/task">Task</Link>
//           <Link to="/user">User</Link>
//           <span style={{ marginLeft: "auto" }}>{user?.email}</span>
//           <Button endIcon={<LogoutIcon />} variant="contained" onClick={logout}/>
//         </>
//       ) : (
//         <>
//           <Link to="/login">Login</Link>
//           <Link to="/loginNew">Login new</Link>
//           <Link to="/loginNew"></Link>
//           <Link to="/register">Register</Link>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

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
    { label: "User", to: "/user" }
  ];

  const linksToShow = isAuthenticated ? privateLinks : publicLinks;

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

          {/* Menú en escritorio */}
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
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  {user?.email}
                </Typography>
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

      {/* Drawer lateral para móvil */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          {/* <List>
            {linksToShow.map((link) => (
              <ListItem
                button
                key={link.to}
                component={RouterLink}
                to={link.to}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {isAuthenticated && (
              <ListItem button onClick={logout}>
                <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                <ListItemText primary="Salir" />
              </ListItem>
            )}
          </List> */}

          <List>
            {linksToShow.map((link) => (
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