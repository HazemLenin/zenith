import { Navbar, Footer } from "..";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isHomePage = location.pathname === "/";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-accent-purple/5 to-white"
    >
      <AnimatePresence mode="wait">{!isAuthPage && <Navbar />}</AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          className={`flex-grow transition-all duration-500 ${
            isHomePage || isAuthPage ? "" : "py-8 md:py-12 lg:py-16"
          }`}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Footer />
      </AnimatePresence>
    </motion.div>
  );
}
