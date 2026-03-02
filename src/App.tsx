import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { DashboardLayout } from "./components/DashboardLayout"
import { AdminLayout } from "./components/AdminLayout"
import { ThemeProvider } from "./components/ThemeProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { PublicRoute } from "./components/PublicRoute"

import {
  PanelSizer,
  ChargeControllerSizer,
  BreakerSelection,
  CableSizer,
  KitGenerator,
  Toolbox,
  CertificatesPage,
} from "./pages/Tools"

import { Overview } from "./pages/Overview"
import { Customers } from "./pages/Customers"
import { Users } from "./pages/Users"
import { Settings } from "./pages/Settings"
import { Login } from "./pages/Login"

import QuotationPreview from "./components/toolbox/QuotationPreview";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ae-renewable-theme">
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Toolbox />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/quotation" element={<QuotationPreview />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Tool Routes with original Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/toolbox" element={<PanelSizer />} />
            <Route path="/panel-sizer" element={<PanelSizer />} />
            <Route path="/charge-controller" element={<ChargeControllerSizer />} />
            <Route path="/breaker-selection" element={<BreakerSelection />} />
            <Route path="/cable-sizer" element={<CableSizer />} />
            <Route path="/kit" element={<KitGenerator />} />
            <Route path="/certificate" element={<CertificatesPage />} />
            <Route path="/completion" element={<Toolbox />} />
            <Route path="/earthing" element={<Toolbox />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

