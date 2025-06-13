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

const Footer = () => {
  return (
    <div>
      <footer className="bg-footer-bg px-20 text-white">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <ul className="space-y-6 md:space-y-8">
                <li>
                  <div className="flex items-center justify-center md:justify-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="fa-xl text-white pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded">
                      Points System
                    </h3>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-center md:justify-start">
                    <FontAwesomeIcon
                      icon={faHeadphonesSimple}
                      className="fa-xl text-white pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded">
                      SUPPORTED 24 X 7
                    </h3>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-center md:justify-start">
                    <FontAwesomeIcon
                      icon={faPiggyBank}
                      className="fa-xl text-white pe-2"
                    />
                    <h3 className="text-white text-sm md:text-xl py-1 px-2 md:py-2 md:px-3 rounded">
                      SAVE YOUR MONEY
                    </h3>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto">
              <div className="text-center md:text-left">
                <h2 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-gray-900 uppercase">
                  TABS
                </h2>
                <ul className="text-gray-500 text-gray-400 font-medium text-base md:text-lg space-y-2 md:space-y-4">
                  <li>
                    <a href="" className="hover:underline">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h2 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-gray-900 uppercase">
                  Your Courses
                </h2>
                <ul className="text-gray-500 text-gray-400 font-medium text-base md:text-lg space-y-2 md:space-y-4">
                  <li>
                    <a href="" className="hover:underline">
                      C++
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      JS
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      NEXT
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <span className="text-sm text-gray-500 text-center md:text-left text-gray-400">
              © 2023 Zenith . All Rights Reserved.
            </span>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 hover:text-white"
              >
                <FontAwesomeIcon icon={faFacebookF} className="fa-lg" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 hover:text-white"
              >
                <FontAwesomeIcon icon={faTwitter} className="fa-lg" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 hover:text-white"
              >
                <FontAwesomeIcon icon={faGithub} className="fa-lg" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 hover:text-white"
              >
                <FontAwesomeIcon icon={faDiscord} className="fa-lg" />
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
