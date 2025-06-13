import React, { ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../";
import { UserContext } from "../../context/UserContext";
import { User } from "../../types/chat";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.form
      onSubmit={formik.handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          value={formik.values.email}
          onChangeFun={handleInputChange("email")}
          required
        />
        <AnimatePresence>
          {formik.touched.email && formik.errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger text-sm mt-1"
            >
              {formik.errors.email}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChangeFun={handleInputChange("password")}
          required
        />
        <AnimatePresence>
          {formik.touched.password && formik.errors.password && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger text-sm mt-1"
            >
              {formik.errors.password}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          ariaLabel={
            isLoading ? "Signing in, please wait" : "Sign in to your account"
          }
          className="w-full"
        >
          Sign In
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-4"
      >
        <motion.button
          type="button"
          onClick={onSwitch}
          className="text-primary hover:text-primary/80 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Don't have an account? Sign up
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
