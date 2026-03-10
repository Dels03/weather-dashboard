import { ThemeProvider as OriginalThemeProvider } from "../../context/ThemeContext";

export const ThemeProvider = ({ children }) => {
  return <OriginalThemeProvider>{children}</OriginalThemeProvider>;
};
