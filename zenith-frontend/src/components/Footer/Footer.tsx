import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeadphonesSimple,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div>
      <footer className="bg-footer-bg px-20 text-white">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <ul className="space-y-6 md:space-y-8">
                <li>
                  <motion.div
                    className="flex items-center justify-center md:justify-start"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className="fa-xl text-accent-purple pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded bg-accent-purple/10 shadow-md">
                      Points System
                    </h3>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    className="flex items-center justify-center md:justify-start"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <FontAwesomeIcon
                      icon={faHeadphonesSimple}
                      className="fa-xl text-primary pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded bg-primary/10 shadow-md">
                      SUPPORTED 24 X 7
                    </h3>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    className="flex items-center justify-center md:justify-start"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <FontAwesomeIcon
                      icon={faPiggyBank}
                      className="fa-xl text-secondary pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded bg-secondary/10 shadow-md">
                      SAVE YOUR MONEY
                    </h3>
                  </motion.div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto">
              <div className="text-center md:text-left">
                <h2 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-white uppercase">
                  TABS
                </h2>
                <ul className="text-gray-300 font-medium text-base md:text-lg space-y-2 md:space-y-4">
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      Profile
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      Home
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      Courses
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      Community
                    </motion.a>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h2 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-white uppercase">
                  Your Courses
                </h2>
                <ul className="text-gray-300 font-medium text-base md:text-lg space-y-2 md:space-y-4">
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      C++
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      JS
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      href=""
                      className="hover:text-accent-purple transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      NEXT
                    </motion.a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <span className="text-sm text-gray-300 text-center md:text-left">
              © 2023 Zenith . All Rights Reserved.
            </span>
            <div className="flex justify-center space-x-4">
              <motion.a
                href="#"
                className="text-gray-300 hover:text-accent-purple transition-all duration-200"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FontAwesomeIcon icon={faFacebookF} className="fa-lg" />
                <span className="sr-only">Facebook</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-accent-purple transition-all duration-200"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FontAwesomeIcon icon={faTwitter} className="fa-lg" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-accent-purple transition-all duration-200"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FontAwesomeIcon icon={faGithub} className="fa-lg" />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-accent-purple transition-all duration-200"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FontAwesomeIcon icon={faDiscord} className="fa-lg" />
                <span className="sr-only">Discord</span>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
