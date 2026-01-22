import { Route, Routes } from "react-router-dom";

import RootLayout from "./RootLayout";
import RequireAuth from "../auth/RequireAuth";
import BrandShell from "../layout/brand/BrandShell";

// public pages
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import VerifyOtp from "../pages/public/VerifyOtp";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";

// app pages
import ProfileHome from "../pages/app/ProfileHome";
import Dashboard from "../pages/app/Dashboard";
import Transfer from "../pages/app/Transfer";
import Transactions from "../pages/app/Transactions";

import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public area*/}
        <Route
          path="/"
          element={
            <BrandShell>
              <Landing />
            </BrandShell>
          }
        />
        <Route
          path="/login"
          element={
            <BrandShell>
              <Login />
            </BrandShell>
          }
        />
        <Route
          path="/register"
          element={
            <BrandShell>
              <Register />
            </BrandShell>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <BrandShell>
              <VerifyOtp />
            </BrandShell>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <BrandShell>
              <ForgotPassword />
            </BrandShell>
          }
        />
        <Route
          path="/reset-password"
          element={
            <BrandShell>
              <ResetPassword />
            </BrandShell>
          }
        />

        {/* Protected app area */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfileHome />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/transfer"
          element={
            <RequireAuth>
              <Transfer />
            </RequireAuth>
          }
        />
        <Route
          path="/transactions"
          element={
            <RequireAuth>
              <Transactions />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
