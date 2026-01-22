import { Box, Button, Card, CardContent, Divider, Stack, Typography, CircularProgress } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function ProfileHome() {
  const { token, user, logout, isHydrating } = useAuth();
  const navigate = useNavigate();

  // No token -> truly logged out
  if (!token) {
    return (
      <Box sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Profile
            </Typography>

            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    Please log in again
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Your session has ended.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        logout();
                        navigate("/login", { replace: true });
                      }}
                    >
                      Go to Login
                    </Button>

                    <Button variant="outlined" component={RouterLink} to="/">
                      Back to Home
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    );
  }

  // Token exists but user not loaded yet -> hydration in progress
  if (!user) {
    return (
      <Box sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Profile
            </Typography>

            <Card>
              <CardContent>
                <Stack spacing={1.25} direction="row" alignItems="center">
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    {isHydrating ? "Loading profile..." : "Loading..."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    );
  }

  const email = user.email;
  const balance = user.balance;

  return (
    <Box sx={{ py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Profile
          </Typography>

          <Card>
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="body2" color="text.secondary">
                  Signed in as
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {email}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" color="text.secondary">
                  Balance
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {typeof balance === "number" ? `$${balance.toFixed(2)}` : "—"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Quick menu</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button component={RouterLink} to="/dashboard" variant="contained">
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/transfer" variant="outlined">
                  Transfer
                </Button>
                <Button component={RouterLink} to="/transactions" variant="outlined">
                  Transactions
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
