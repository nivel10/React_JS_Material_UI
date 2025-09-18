// src/pages/Home.tsx
import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Fade
} from "@mui/material";
import { Login, TaskAlt } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/userAuth";

const Home: React.FC = () => {
  const { user, } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Fade in={show} timeout={800}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 2,
            textAlign: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main"
            }}
          >
            Public Home
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Welcome. Please log in to manage your tasks and access your
            personalized profile.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            {!user?.id ?
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Login />}
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
              : <></>
            }

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<TaskAlt />}
              onClick={() => navigate("/tasks")}
            >
              View Public Tasks
            </Button>
          </Stack>
        </Paper>
      </Fade>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Your Company (My app). All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;