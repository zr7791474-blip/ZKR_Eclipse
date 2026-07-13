import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PrivateRoute from "../components/routing/PrivateRoute";
import PublicRoute from "../components/routing/PublicRoute";
import PageLoader from "../components/layout/PageLoader";

const Landing = lazy(() => import("../pages/landing/Landing"));
const DashboardHome = lazy(() => import("../pages/DashboardHome"));
const Reports = lazy(() => import("../pages/Reports"));
const Projects = lazy(() => import("../pages/Projects"));
const Workspace = lazy(() => import("../pages/Workspace"));
const Users = lazy(() => import("../pages/Users"));
const Products = lazy(() => import("../pages/Products"));
const Orders = lazy(() => import("../pages/Orders"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<PublicRoute>{withSuspense(<Landing />)}</PublicRoute>}
      />
      <Route
        path="/login"
        element={<PublicRoute>{withSuspense(<Login />)}</PublicRoute>}
      />
      <Route
        path="/register"
        element={<PublicRoute>{withSuspense(<Register />)}</PublicRoute>}
      />
      <Route
        path="/forgot-password"
        element={<PublicRoute>{withSuspense(<ForgotPassword />)}</PublicRoute>}
      />
      <Route
        path="/reset-password"
        element={<PublicRoute>{withSuspense(<ResetPassword />)}</PublicRoute>}
      />

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={withSuspense(<DashboardHome />)} />
        <Route path="/reports" element={withSuspense(<Reports />)} />
        <Route path="/projects" element={withSuspense(<Projects />)} />
        <Route path="/workspace" element={withSuspense(<Workspace />)} />
        <Route path="/users" element={withSuspense(<Users />)} />
        <Route path="/products" element={withSuspense(<Products />)} />
        <Route path="/orders" element={withSuspense(<Orders />)} />
        <Route path="/settings" element={withSuspense(<Settings />)} />
      </Route>

      <Route path="*" element={withSuspense(<NotFound />)} />
    </Routes>
  );
}

export default AppRouter;
