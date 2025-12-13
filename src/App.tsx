import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { DashboardLayout } from "./components/DashboardLayout"
import { ThemeProvider } from "./components/ThemeProvider"

import {
  PanelSizer,
  ChargeControllerSizer,
  BreakerSelection,
  CableSizer,
  KitGenerator,
  Toolbox,
  CertificatesPage,
} from "./pages/Tools"

import QuotationPreview from "./components/toolbox/QuotationPreview";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ae-renewable-theme">
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Toolbox />} />
          <Route path="/quotation" element={<QuotationPreview />} />

          {/* Tool Routes with Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/toolbox" element={<PanelSizer />} />
            <Route path="/panel-sizer" element={<PanelSizer />} />
            <Route path="/charge-controller" element={<ChargeControllerSizer />} />
            <Route path="/breaker-selection" element={<BreakerSelection />} />
            <Route path="/cable-sizer" element={<CableSizer />} />
            <Route path="/kit" element={<KitGenerator />} />
            {/* Add placeholder routes to avoid 404 for sidebar links */}
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
