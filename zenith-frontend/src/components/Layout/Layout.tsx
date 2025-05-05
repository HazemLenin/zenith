import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function LayOut() {
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
