import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values: FormValues) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post<{ token: string }>(
          "http://localhost:3000/api/auth/login",
          values
        );
        localStorage.setItem("userToken", data.token);
        formik.resetForm();
        navigate("/Home");
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md p-8">
      {errorMessage && (
        <div className="flex items-center p-4 mb-4 text-sm text-danger border border-danger rounded-lg bg-red-50">
          <div>{errorMessage}</div>
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4 ">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black"
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
              </svg>{" "}
              <div>{formik.errors.email}</div>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black"
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
              <div>{formik.errors.password}</div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className=" w-56 py-3 px-4 bg-[#1a3c5a] text-white rounded-lg hover:bg-[#2a5c8a] hover:cursor-pointer disabled:bg-[#2a5c8a]  flex items-center justify-center mx-auto transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] focus:ring-offset-2"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
