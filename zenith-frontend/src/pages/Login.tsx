import React, { useState, ChangeEvent, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components";
import { UserContext } from "../context/UserContext";
import { User } from "../types/chat";

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserToken, setCurrentUser } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState<"option1" | "option2">(
    "option2"
  );

  const handleOptionChange = (option: "option1" | "option2") => {
    setSelectedOption(option);
    if (option === "option1") {
      navigate("/signup");
    }
  };

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
        setUserToken(data.token);

        // Extract and set user data from JWT token
        try {
          const base64Url = data.token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));

          if (payload.user) {
            setCurrentUser(payload.user as User);
          }
        } catch (error) {
          console.error("Error parsing JWT token:", error);
        }

        formik.resetForm();
        navigate("/");
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

  const handleInputChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(field, e.target.value);
    };

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
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-medium text-lg peer-checked/option1:text-black peer-checked/option1:font-bold peer-not-checked/option1:text-gray-500"
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
                className="option flex-1 text-center cursor-pointer rounded-full z-10 transition-all duration-500 font-light text-lg peer-checked/option2:text-white peer-checked/option2:font-light peer-not-checked/option2:text-white"
              >
                LOGIN
              </label>
              <span
                className={`background absolute w-[49%] h-[50px] top-1 left-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] bg-[#2a5c8a] peer-checked/option2:left-1/2`}
              />
            </div>
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
                <Input
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChangeFun={handleInputChange("email")}
                  required
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
                <Input
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChangeFun={handleInputChange("password")}
                  required
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
              <button
                type="submit"
                disabled={isLoading}
                className=" w-56 py-3 px-4 bg-[#1a3c5a] text-white rounded-lg hover:bg-[#2a5c8a] hover:cursor-pointer disabled:bg-[#2a5c8a]  flex items-center justify-center mx-auto transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2a5c8a] focus:ring-offset-2"
                aria-label={
                  isLoading
                    ? "Signing in, please wait"
                    : "Sign in to your account"
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
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
