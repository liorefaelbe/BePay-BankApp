import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useAuth } from "../auth/AuthContext";
import ChatWidget from "../components/ChatWidget";

/**
 * Single root layout for the whole site:
 * - One TopBar everywhere (by requirement)
 * - Main content via <Outlet />
 * - ChatWidget only for authenticated users
 */
export default function RootLayout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar />

      <Box component="main" sx={{ mt: isAuthenticated ? 2 : 0 }}>
        <Outlet />
      </Box>

      {isAuthenticated ? <ChatWidget isAuthenticated userEmail={user?.email} /> : null}
    </Box>
  );
}
