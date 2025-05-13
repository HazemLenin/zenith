import { Navbar, Footer } from "..";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
