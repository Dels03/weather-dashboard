import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./app/providers";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CityDetails from "./pages/CityDetails";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Preloader from "./components/Preloader";
import { useState, useEffect } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    // Preloader shows for 2 seconds then fades out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AppProviders>
        <Preloader isLoading={isLoading} />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/city/:name" element={<CityDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
