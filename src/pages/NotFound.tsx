import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center"
      }}
    >
      <Typography variant="h1" component="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        It might have been moved or deleted. Please check the URL or return to the homepage.
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          sx={{ mr: 2 }}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;