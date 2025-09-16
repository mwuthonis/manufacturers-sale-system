import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import StockManagement from "./pages/StockManagement";
import OrderManagement from "./pages/OrderManagement";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/stocks" element={
            <MainLayout>
              <StockManagement />
            </MainLayout>
          } />
          <Route path="/orders" element={
            <MainLayout>
              <OrderManagement />
            </MainLayout>
          } />
          <Route path="/invoices" element={
            <MainLayout>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Invoice Management - Coming Soon</p>
              </div>
            </MainLayout>
          } />
          <Route path="/payments" element={
            <MainLayout>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Payment Recording - Coming Soon</p>
              </div>
            </MainLayout>
          } />
          <Route path="/receipts" element={
            <MainLayout>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Receipt Management - Coming Soon</p>
              </div>
            </MainLayout>
          } />
          <Route path="/delivery-notes" element={
            <MainLayout>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Delivery Notes - Coming Soon</p>
              </div>
            </MainLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
