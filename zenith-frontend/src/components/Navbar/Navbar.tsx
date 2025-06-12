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
    <nav className="bg-primary border-b sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/zenith-logo-white.svg"
                alt="Zenith Logo"
                className="w-28 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {userToken && (
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-white hover:text-gray-200 transition-colors duration-200 ${
                        isActive ? "text-gray-200 font-medium" : ""
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              {userToken ? (
                <>
                  <NavLink
                    to={`/users/${currentUser?.username}`}
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-background text-primary flex items-center justify-center text-sm font-medium">
                      {currentUser?.firstName?.charAt(0)}
                      {currentUser?.lastName?.charAt(0)}
                    </div>
                    <span>Profile</span>
                  </NavLink>
                  <button
                    onClick={LogOut}
                    className="text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {navLinks.slice(1).map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-white hover:text-gray-200 transition-colors duration-200 ${
                          isActive ? "text-gray-200 font-medium" : ""
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${
                  isMobileMenuOpen ? "hidden" : "block"
                } h-6 w-6 text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } h-6 w-6 text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "text-white bg-primary/20"
                        : "text-white hover:text-gray-200 hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {userToken && (
                <>
                  <NavLink
                    to={`/users/${currentUser?.username}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {currentUser?.firstName?.charAt(0)}
                      {currentUser?.lastName?.charAt(0)}
                    </div>
                    <span>Profile</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      LogOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
