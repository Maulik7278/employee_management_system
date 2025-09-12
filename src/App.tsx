import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Branches from "./pages/Branches";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const RoleBasedDashboard = () => {
  const { state } = useAuth();
  return state.user?.role === 'admin' ? <Dashboard /> : <EmployeeDashboard />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  {/* Dynamic dashboard based on role */}
                  <Route index element={<RoleBasedDashboard />} />
                  
                  {/* Admin-only routes */}
                  <Route path="branches" element={
                    <ProtectedRoute requiredRole="admin">
                      <Branches />
                    </ProtectedRoute>
                  } />
                  <Route path="employees" element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="p-6"><h1 className="text-2xl font-bold">Employees - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="salary" element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="p-6"><h1 className="text-2xl font-bold">Salary Management - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="advances" element={
                    <ProtectedRoute requiredRole="admin">
                      <div className="p-6"><h1 className="text-2xl font-bold">Advances - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Employee-only routes */}
                  <Route path="profile" element={
                    <ProtectedRoute requiredRole="employee">
                      <div className="p-6"><h1 className="text-2xl font-bold">My Profile - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="salary-history" element={
                    <ProtectedRoute requiredRole="employee">
                      <div className="p-6"><h1 className="text-2xl font-bold">Salary History - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  <Route path="my-advances" element={
                    <ProtectedRoute requiredRole="employee">
                      <div className="p-6"><h1 className="text-2xl font-bold">My Advances - Coming Soon</h1></div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared routes */}
                  <Route path="settings" element={
                    <div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>
                  } />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
