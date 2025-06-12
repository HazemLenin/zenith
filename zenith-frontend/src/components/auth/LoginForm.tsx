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
          "http://localhost:3000/api/auth/login",
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

  return (
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
    </form>
  );
};

export default LoginForm;
