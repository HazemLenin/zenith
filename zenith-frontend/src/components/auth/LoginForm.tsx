import React, { ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../";
import { UserContext } from "../../context/UserContext";
import { User } from "../../types/chat";
import { useToast } from "../../context/ToastContext";

interface FormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitch: () => void;
}

// Test users for easy login testing
const TEST_USERS = [
  {
    name: "Admin",
    email: "admin@zenith.com",
    password: "admin123",
    role: "System administrator",
  },
  {
    name: "Instructor",
    email: "instructor@zenith.com",
    password: "instructor123",
    role: "Course instructor",
  },
  {
    name: "Student",
    email: "student@zenith.com",
    password: "student123",
    role: "Learning student",
  },
  {
    name: "Student (Teacher)",
    email: "teacher.student@zenith.com",
    password: "teacher123",
    role: "Student who can teach others",
  },
];

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserToken, setCurrentUser } = React.useContext(UserContext);
  const { showToast } = useToast();

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
          "/api/auth/login",
          values
        );
        localStorage.setItem("userToken", data.token);
        setUserToken(data.token);

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
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.error?.message ||
            "An error occurred. Please try again later.";
          showToast(errorMessage, "error");
        } else {
          showToast("An unexpected error occurred.", "error");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleInputChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(field, e.target.value);
    };

  const handleQuickLogin = (user: (typeof TEST_USERS)[0]) => {
    formik.setFieldValue("email", user.email);
    formik.setFieldValue("password", user.password);
    showToast(`Filled in ${user.name} credentials`, "info");
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Quick Login Buttons for Testing */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick Login (Testing):</p>
        <div className="flex flex-wrap gap-2">
          {TEST_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => handleQuickLogin(user)}
              className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
              title={`${user.name} - ${user.role}`}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

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
          <div className="text-danger text-sm mt-1">{formik.errors.email}</div>
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
          <div className="text-danger text-sm mt-1">
            {formik.errors.password}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        isLoading={isLoading}
        ariaLabel={
          isLoading ? "Signing in, please wait" : "Sign in to your account"
        }
      >
        Sign In
      </Button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
