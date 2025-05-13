import React, { JSX, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Navbar(): JSX.Element {
  const { userToken, setUserToken } = useContext(UserContext);
  const navigate = useNavigate();

  function LogOut(): void {
    localStorage.removeItem("userToken");
    setUserToken(null);
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-background border-gray-200 p-5">
        <div className="max-w-screen-xl flex flex-wrap items-center gap-3 mx-auto pt-8">
          <span className="self-center text-3xl font-semibold whitespace-nowrap text-black ">
            zenith
          </span>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className="hidden w-full md:w-auto flex-grow md:flex md:justify-between"
            id="navbar-default"
          >
            {userToken && (
              <ul className=" font-medium flex flex-col ms-10 items-center md:p-0 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0   ">
                <li>
                  <NavLink
                    to="/"
                    className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/courses"
                    className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                  >
                    Courses
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/community"
                    className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                  >
                    Community
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/chat"
                    className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                  >
                    Chat
                  </NavLink>
                </li>
              </ul>
            )}
            <ul className=" font-medium flex flex-col ms-10 items-center md:p-0 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0   ">
              {userToken && (
                <li>
                  <span
                    onClick={LogOut}
                    className="block py-2 px-3 rounded hover:bg-gray-100 cursor-pointer md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary"
                  >
                    Log out
                  </span>
                </li>
              )}
              {!userToken && (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                    >
                      Log in
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-black hover:text-primary "
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
              <li className="flex gap-4 px-3">
                <a href="">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="">
                  <i className="fa-brands fa-github"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
