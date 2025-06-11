import { Navbar, Footer } from "..";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <div
        className={`flex-grow ${
          isHomePage || isAuthPage ? "" : "py-8 md:py-12 lg:py-16"
        }`}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
