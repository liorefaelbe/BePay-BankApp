import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Box sx={{ maxWidth: 520, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The page you requested does not exist.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Go home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
