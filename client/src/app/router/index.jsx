import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import Home from "../../pages/Home";
import Dashboard from "../../pages/Dashboard";
import CityDetails from "../../pages/CityDetails";
import Favorites from "../../pages/Favorites";
import Settings from "../../pages/Settings";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<Home />} />
    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
    <Route path={ROUTES.CITY} element={<CityDetails />} />
    <Route path={ROUTES.FAVORITES} element={<Favorites />} />
    <Route path={ROUTES.SETTINGS} element={<Settings />} />
  </Routes>
);
