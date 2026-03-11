import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/router";
import Layout from "./components/layout/Layout";
import { useState } from "react";

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Move showFavorites state up from Dashboard
  const [showFavorites, setShowFavorites] = useState(true);

  return (
    <Layout
      showHeader={!isLandingPage}
      showFavorites={showFavorites}
      setShowFavorites={setShowFavorites}
    >
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
