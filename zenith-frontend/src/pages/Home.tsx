import React, { useEffect, useRef } from "react";
import zenith from "/public/zenith-bg.jpg";
import Typed from "typed.js";

export const Home: React.FC = () => {
  // Create reference element
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const options = {
      strings: [
        "Learn from Experts",
        "Share Your Skills",
        "Earn While Teaching",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    };

    // Create typed instance
    const typed = new Typed(el.current!, options);

    // Cleanup on component unmount
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${zenith})` }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <h1
              className="text-white
 text-7xl font-bold mb-8"
            >
              Welcome to Zenith
            </h1>
            <div className="flex items-center gap-2">
              <span ref={el} className="text-white text-5xl"></span>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="px-8 py-3 bg-secondary-title text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Join For Free
              </button>
              <button className="px-8 py-3 bg-white text-secondary-title font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 border border-secondary-title">
            Explore Our Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Market Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {" "}
                  Discover In-Demand Skills
                </h3>
                <p className="text-gray-600 text-center">
                  Explore trending skills in your field and stay ahead in a
                  constantly evolving digital world.
                </p>
              </div>
            </div>

            {/* Funds Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m9 5v6m0-6l9-5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Learn From Real People
                </h3>
                <p className="text-gray-600 text-center">
                  Get access to practical, peer-led lessons taught by
                  experienced learners like you.
                </p>
              </div>
            </div>

            {/* PR & Marketing */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                    <circle cx="12" cy="8" r="2" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Teach What You Know
                </h3>
                <p className="text-gray-600 text-center">
                  Share your expertise, build your profile, and help others
                  grow—while growing yourself.
                </p>
              </div>
            </div>

            {/* Business Planning */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Personalized Learning Paths
                </h3>
                <p className="text-gray-600 text-center">
                  Follow guided paths tailored to your goals, whether you're
                  switching careers or mastering a new hobby.
                </p>
              </div>
            </div>

            {/* Audit */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>{" "}
                <h3 className="text-xl font-semibold mb-2">
                  Track Your Growth
                </h3>
                <p className="text-gray-600 text-center">
                  Monitor your learning progress, skill exchanges, and
                  impact—every step of the way.
                </p>
              </div>
            </div>

            {/* Consulting */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex flex-col items-center">
                <div className="text-secondary-title mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Connect & Collaborate
                </h3>
                <p className="text-gray-600 text-center">
                  Join a vibrant community where knowledge meets connection.
                  Learn, teach, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Get in Touch
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 text-primary-titletext-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
