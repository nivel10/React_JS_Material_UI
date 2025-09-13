import { Box, CircularProgress, Typography } from "@mui/material";

interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = "Loading wait…" }: FullScreenLoaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6" component="p">
        {message}
      </Typography>
    </Box>
  );
}