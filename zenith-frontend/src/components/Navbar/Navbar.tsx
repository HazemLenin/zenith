import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar(): React.ReactElement {
  const { userToken, setUserToken, currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function LogOut(): void {
    localStorage.removeItem("userToken");
    setUserToken(null);
    navigate("/login");
  }

  const navLinks = userToken
    ? [
        {
          to: "/",
          label: "Home",
        },
        {
          to:
            currentUser?.role === "instructor" ? "/courses/upload" : "/courses",
          label:
            currentUser?.role === "instructor" ? "Upload Course" : "Courses",
        },
        ...(currentUser?.role === "student"
          ? [
              {
                to: "/skill-hub",
                label: "Skill Hub",
              },
            ]
          : []),
        {
          to: "/chat",
          label: "Chat",
        },
      ]
    : [
        {
          to: "/",
          label: "Home",
        },
        {
          to: "/login",
          label: "Log in",
        },
        {
          to: "/signup",
          label: "Sign Up",
        },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-primary shadow-soft sticky top-0 z-50"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Link to="/" className="block">
              <motion.img
                src="/zenith-logo-white.svg"
                alt="Zenith Logo"
                className="w-28 h-auto drop-shadow-lg"
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {userToken && (
              <motion.div
                className="flex items-center space-x-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `text-white hover:text-accent-purple transition-all duration-200 relative px-2 py-1 rounded-lg
                        ${
                          isActive
                            ? "font-semibold bg-white/10 shadow-md after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent-purple after:rounded-full"
                            : "hover:bg-white/10 hover:shadow-sm"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* User Profile Section */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {userToken ? (
                <>
                  <NavLink
                    to={`/users/${currentUser?.username}`}
                    className="flex items-center gap-2 text-white hover:text-accent-purple transition-all duration-200 group"
                  >
                    <motion.div
                      className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold ring-2 ring-white/20 group-hover:ring-accent-purple/60 transition-all duration-200 shadow-md"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {currentUser?.firstName?.charAt(0)}
                      {currentUser?.lastName?.charAt(0)}
                    </motion.div>
                    <span>Profile</span>
                  </NavLink>
                  <motion.button
                    onClick={LogOut}
                    className="text-white hover:text-accent-purple transition-all duration-200 cursor-pointer hover:underline px-2 py-1 rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log out
                  </motion.button>
                </>
              ) : (
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {navLinks.slice(1).map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `text-white hover:text-white/90 transition-all duration-200 relative
                          ${
                            isActive
                              ? "font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full"
                              : ""
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              <motion.svg
                className={`${
                  isMobileMenuOpen ? "hidden" : "block"
                } h-6 w-6 text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: 0 }}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </motion.svg>
              <motion.svg
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } h-6 w-6 text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: -90 }}
                animate={{ rotate: isMobileMenuOpen ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            className="md:hidden"
          >
            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-hover rounded-b-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-xl text-base font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "text-primary bg-primary/10 shadow-md"
                          : "text-text-dark hover:text-primary hover:bg-primary/5 hover:shadow-sm"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              {userToken && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <NavLink
                      to={`/users/${currentUser?.username}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-text-dark hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium ring-2 ring-primary/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {currentUser?.firstName?.charAt(0)}
                        {currentUser?.lastName?.charAt(0)}
                      </motion.div>
                      <span>Profile</span>
                    </NavLink>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  >
                    <motion.button
                      onClick={() => {
                        LogOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-text-dark hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Log out
                    </motion.button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
