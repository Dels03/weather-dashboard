import { FavoritesProvider as OriginalFavoritesProvider } from "../../context/FavoritesContext";

export const FavoritesProvider = ({ children }) => {
  return <OriginalFavoritesProvider>{children}</OriginalFavoritesProvider>;
};
