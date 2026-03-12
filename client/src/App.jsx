import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./app/providers";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CityDetails from "./pages/CityDetails";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
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
