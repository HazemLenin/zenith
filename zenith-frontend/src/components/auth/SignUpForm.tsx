import React, { ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Switch, Button } from "../";
import { UserContext } from "../../context/UserContext";
import { User } from "../../types/chat";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

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
}

interface SignUpFormProps {
  onSwitch: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitch }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserToken, setCurrentUser } = React.useContext(UserContext);
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = React.useState<
    "student" | "instructor"
  >("student");

  const handleRoleChange = (isInstructor: boolean) => {
    const newRole = isInstructor ? "instructor" : "student";
    setSelectedRole(newRole);
    formik.setFieldValue("role", newRole);
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
        setUserToken(data.token);

        try {
          const base64Url = data.token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));

          if (payload.user) {
            setCurrentUser(payload.user as User);
          } else {
            const newUser: User = {
              id: 0,
              firstName: values.firstName,
              lastName: values.lastName,
              username: values.username,
              email: values.email,
              role: values.role,
            };
            setCurrentUser(newUser);
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
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="First Name"
            type="text"
            placeholder="First Name"
            value={formik.values.firstName}
            onChangeFun={handleInputChange("firstName")}
            required
          />
          <AnimatePresence>
            {formik.touched.firstName && formik.errors.firstName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger text-sm mt-1"
              >
                {formik.errors.firstName}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            label="Last Name"
            type="text"
            placeholder="Last Name"
            value={formik.values.lastName}
            onChangeFun={handleInputChange("lastName")}
            required
          />
          <AnimatePresence>
            {formik.touched.lastName && formik.errors.lastName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-danger text-sm mt-1"
              >
                {formik.errors.lastName}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Input
          label="Username"
          type="text"
          placeholder="Username"
          value={formik.values.username}
          onChangeFun={handleInputChange("username")}
          required
        />
        <AnimatePresence>
          {formik.touched.username && formik.errors.username && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-danger text-sm mt-1"
            >
              {formik.errors.username}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
        className="flex items-center justify-start mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Switch
          label={selectedRole}
          onChange={handleRoleChange}
          checked={selectedRole === "instructor"}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          ariaLabel={
            isLoading
              ? "Submitting form, please wait"
              : "Sign up for an account"
          }
          className="w-full"
        >
          Create Account
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center mt-4"
      >
        <motion.button
          type="button"
          onClick={onSwitch}
          className="text-primary hover:text-primary/80 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Already have an account? Sign in
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default SignUpForm;
