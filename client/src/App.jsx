import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/router";
import Layout from "./components/layout/Layout";

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  
  return (
    <Layout showHeader={!isLandingPage}>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
