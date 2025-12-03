import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { PWAInstallPrompt } from "@/components/common/PWAInstallPrompt";
import { BackendStatus } from "@/components/ui/BackendStatus";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Audit from "./pages/Audit";
import { Workflows } from "./pages/Workflows";
import Leads from "./pages/Leads";
import SalesPipeline from "./pages/SalesPipeline";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import Email from "./pages/Email";
import Documents from "./pages/Documents";
import Calendar from "./pages/Calendar";
import CRMAnalytics from "./pages/CRMAnalytics";
import AIAnalytics from "./pages/AIAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute requiredPermissions={['view_clients']}>
                <MainLayout>
                  <Clients />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute requiredPermissions={['view_transactions']}>
                <MainLayout>
                  <Transactions />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute requiredPermissions={['view_alerts']}>
                <MainLayout>
                  <Alerts />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requiredPermissions={['view_reports']}>
                <MainLayout>
                  <Reports />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/audit" element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout>
                  <Audit />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/workflows" element={
              <ProtectedRoute requiredPermissions={['view_reports']}>
                <MainLayout>
                  <Workflows />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute requiredPermissions={['view_leads']}>
                <MainLayout>
                  <Leads />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/sales-pipeline" element={
              <ProtectedRoute requiredPermissions={['view_sales']}>
                <MainLayout>
                  <SalesPipeline />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute requiredPermissions={['view_contacts']}>
                <MainLayout>
                  <Contacts />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute requiredPermissions={['view_tasks']}>
                <MainLayout>
                  <Tasks />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/email" element={
              <ProtectedRoute requiredPermissions={['view_email']}>
                <MainLayout>
                  <Email />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute requiredPermissions={['view_documents']}>
                <MainLayout>
                  <Documents />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute requiredPermissions={['view_calendar']}>
                <MainLayout>
                  <Calendar />
                </MainLayout>
              </ProtectedRoute>
            } />
        <Route path="/crm-analytics" element={
          <ProtectedRoute requiredPermissions={['view_analytics']}>
            <MainLayout>
              <CRMAnalytics />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai-analytics" element={
          <ProtectedRoute requiredPermissions={['view_analytics']}>
            <MainLayout>
              <AIAnalytics />
            </MainLayout>
          </ProtectedRoute>
        } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <PWAInstallPrompt />
        <BackendStatus />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
