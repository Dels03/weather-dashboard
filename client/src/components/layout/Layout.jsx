import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({
  children,
  showHeader = true,
  showFavorites,
  setShowFavorites,
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {showHeader && (
        <Header
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
