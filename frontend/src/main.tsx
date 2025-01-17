import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "./components/login/LoginPage";
import SignupPage from "./components/signup/SignupPage";
import Dashboard from "./Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./components/pages/home";
import Invetory from "./components/pages/Inventory";
import AuditLogsPage from "./components/pages/AuditLogsPage";
import ReportsPage from "./components/pages/ReportsPage";
import ManageRequests from "./components/pages/ManageRequests";
import Products from "./components/pages/Products";
import Transactions from "./components/pages/Transactions";
import VoucherTask from "./components/pages/VoucherTask";
import VoucherApprovalReject from "./components/pages/VoucherApprovalReject";
import Users from "./components/pages/Users";
import Tasks from "./components/pages/Tasks";
import "bootstrap/dist/css/bootstrap.min.css";
import ManageTasks from "./components/pages/ManageTasks";
import MyTransactions from "./components/pages/MyTransactions";

const root = document.getElementById("root");

/**
 * A wrapper around routes that should only be accessed by logged-in users.
 * If a user is not logged in, automatically navigates to `/login`.
 *
 * Usage:
 * ```
 * <PrivateRoute>
 *   <QuestionList />
 * </PrivateRoute>
 * ```
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();

  return auth.isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
}

/**
 * A wrapper around routes that should only be accessed by not logged-in users.
 * If a user is logged in, automatically navigates to `/`.
 *
 * Usage:
 * ```
 * <PublicRoute>
 *   <SignupPage />
 * </PublicRoute>
 * ```
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();

  return !auth.isLoggedIn ? <>{children}</> : <Navigate to="/" />;
}

/**
 * A wrapper around routes that should only be accessed by admins. Admin routes
 * implicitly contain the `PrivateRoute` component, so you do not have to further
 * wrap the route around the `PrivateRoute` component.
 *
 * If a user is an admin, navigates to the component represented by prop `adminRoute`.
 *
 * If a user is not an admin, navigates to the component represented by prop `nonAdminRoute`.
 *
 * Usage:
 * ```
 * <AdminRoute
 *   adminRoute={ <EditQuestionPage /> }
 *   nonAdminRoute={ <ViewQuestionPage /> }
 * />
 * ```
 */
function AdminRoute({
  adminRoute,
  nonAdminRoute,
}: {
  adminRoute: React.ReactNode;
  nonAdminRoute: React.ReactNode;
}) {
  const { auth } = useAuth();

  return auth.isAdmin ? (
    <PrivateRoute>{adminRoute}</PrivateRoute>
  ) : (
    <PrivateRoute>{nonAdminRoute}</PrivateRoute>
  );
}

ReactDOM.createRoot(root!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="voucher-task" element={<VoucherTask />} />
          <Route path="voucher-approval" element={<VoucherApprovalReject />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="my-transactions" element={<MyTransactions />} />
          <Route
            path="manage-users"
            element={
              <AdminRoute
                adminRoute={<Users />}
                nonAdminRoute={<Navigate to="/" />}
              />
            }
          />
          <Route path="transactions" element={
            <AdminRoute
                adminRoute={<Transactions />}
                nonAdminRoute={<Navigate to="/" />}
            />
          } />
          <Route
            path="inventory"
            element={
              <AdminRoute
                adminRoute={<Invetory />}
                nonAdminRoute={<Navigate to="/" />}
              />
            }
          />
          <Route
            path="manage-tasks"
            element={
              <AdminRoute
                adminRoute={<ManageTasks />}
                nonAdminRoute={<Navigate to="/" />}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
