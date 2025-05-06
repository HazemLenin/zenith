import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Login from "./Login";

interface FormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor";
}

interface ApiResponse {
  token: string;
  //   User:user;
}

declare function setToken(token: string): void;

const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<"option1" | "option2">(
    "option1"
  );

  const handleOptionChange = (option: "option1" | "option2") => {
    setSelectedOption(option);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be 50 characters or less"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be 50 characters or less"),
    username: Yup.string()
      .required("username is required")
      .min(5, "Must be at least 5 characters")
      .max(20, "Must be 20 characters or less"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        "Invalid email format"
      ),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Za-z0-9!@#$%^&*]{8,50}$/,
        "Password must be 8-50 characters, alphanumeric or special characters (!@#$%^&*)"
      ),
    role: Yup.string()
      .required("Role is required")
      .oneOf(
        ["student", "instructor"],
        "Role must be either student or instructor"
      ),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "student",
    },
    validationSchema,
    onSubmit: async (values: FormValues) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post<ApiResponse>(
          "http://localhost:3000/api/auth/signup",
          values
        );
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("userToken", data.token);
          } else {
            console.warn("localStorage is not available");
          }
        } catch (e) {
          console.error("Failed to save token to localStorage:", e);
        }
        if (typeof setToken === "function") {
          setToken(data.token);
        } else {
          console.error("setToken function is not defined");
        }
        formik.resetForm();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message ||
              (error.request
                ? "Network error. Please check your connection."
                : "An error occurred. Please try again later.")
          );
        } else {
          setErrorMessage("Unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col w-full max-w-2xl bg-[#e3f2fd] rounded-lg shadow-lg">
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full p-8">
            <h2 className="text-3xl font-medium mb-6 text-black text-center">
              Welcome To Learning
            </h2>
            <div
              className={`filter-switch relative flex items-center h-[60px] w-full max-w-[450px] mx-auto rounded-full overflow-hidden bg-[#94adc4]`}
            >
              <input
                id="option1"
                name="options"
                type="radio"
                className="hidden peer/option1"
                checked={selectedOption === "option1"}
                onChange={() => handleOptionChange("option1")}
              />
              <label
                htmlFor="option1"
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-light text-lg peer-checked/option1:text-white peer-checked/option1:font-light peer-not-checked/option1:text-white"
              >
                SIGN UP
              </label>
              <input
                id="option2"
                name="options"
                type="radio"
                className="hidden peer/option2"
                checked={selectedOption === "option2"}
                onChange={() => handleOptionChange("option2")}
              />
              <label
                htmlFor="option2"
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-medium text-lg peer-checked/option2:text-black peer-checked/option2:font-bold peer-not-checked/option2:text-gray-500"
              >
                LOGIN
              </label>
              <span
                className={`background absolute w-[49%] h-[50px] top-1 left-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] bg-[#2a5c8a] peer-checked/option2:left-1/2`}
              />
            </div>
            {selectedOption === "option1" ? (
              <>
                {errorMessage && (
                  <div
                    className="flex items-center p-4 mb-4 text-sm text-[#ff6b6b] border border-[#ff6b6b] rounded-lg bg-red-50"
                    role="alert"
                    aria-live="assertive"
                  >
                    <svg
                      className="shrink-0 inline w-4 h-4 me-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Error</span>
                    <div>{errorMessage}</div>
                  </div>
                )}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      First Name
                    </label>
                    <input
                      {...formik.getFieldProps("firstName")}
                      type="text"
                      id="firstName"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                      placeholder="First Name"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.firstName}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      Last Name
                    </label>
                    <input
                      {...formik.getFieldProps("lastName")}
                      type="text"
                      id="lastName"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                      placeholder="Last Name"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.lastName}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      username
                    </label>
                    <input
                      {...formik.getFieldProps("username")}
                      type="text"
                      id="username"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                      placeholder="username"
                    />
                    {formik.touched.username && formik.errors.username && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.username}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      Email
                    </label>
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      id="email"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                      placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      Password
                    </label>
                    <input
                      {...formik.getFieldProps("password")}
                      type="password"
                      id="password"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#2a5c8a] bg-[#ffffff] placeholder:text-[#94adc4] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                      placeholder="Password"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.password}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-xl mb-2 font-medium text-[#2f327d]"
                    >
                      Role
                    </label>
                    <select
                      {...formik.getFieldProps("role")}
                      id="role"
                      disabled={isLoading}
                      className="w-full px-4 py-2 rounded-3xl border border-[#94adc4] bg-[#ffffff] placeholder:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] disabled:bg-[#94adc4]"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                    {formik.touched.role && formik.errors.role && (
                      <div
                        className="flex p-4 mb-4 text-sm text-[#ff6b6b] rounded-lg bg-red-50"
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Error</span>
                        <div>{formik.errors.role}</div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className=" w-56 py-3 px-4 bg-[#1a3c5a] text-white rounded-lg hover:bg-[#2a5c8a] hover:cursor-pointer disabled:bg-[#2a5c8a]  flex items-center justify-center mx-auto transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] focus:ring-offset-2"
                    aria-label={
                      isLoading
                        ? "Submitting form, please wait"
                        : "Sign up for an account"
                    }
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <Login />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
