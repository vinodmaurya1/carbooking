"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginWithEmailPassword,
  getUserByUID,
  signUpWithGoogle,
} from "@/firebase"; // assuming firebase.js is set up
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/stateSlice/authSlice";
import { Button } from "antd";




interface Errors {
  email: string;
  password: string;
  general: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Errors>>({
    email: "",
    password: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Validation logic
  const validate = () => {
    const errors = {
      email: "",
      password: "",
      general: "",
    };
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const user = await loginWithEmailPassword(formData.email, formData.password);
      const role = await getUserByUID(user.uid);

      dispatch(
        loginSuccess({
          userId: user?.uid,
          name: role?.name,
          email: role?.email,
          profilePicture: role?.profilePicture,
          role: role?.role,
        })
      );
      setLoading(false);

      router.push(role?.role === "admin" ? "/admin" : "/");
      setSuccessMessage("Login successful!");
      toast.success("Login successful!");
    } catch (error) {
      setLoading(false);
      setErrors({ general: error instanceof Error ? error.message : "Unknown error" });
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const role = "user";

      const user = await signUpWithGoogle(role);
      dispatch(
        loginSuccess({
          userId: user?.uid,
          name: user?.displayName,
          email: user?.email,
          profilePicture: user?.photoURL,
          role: role,
        })
      );
      toast.success(`Welcome, ${user.displayName}!`);
      router.push("/");
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "Google Sign-Up failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-600">
        <img
          src="img/signup-img.jpg"
          alt="Login"
          className="w-3/4 rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-10">
        <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="mb-6">
            <Button
              loading={loading}
              type="default"
              onClick={handleGoogleSignup}
              className="w-full bg-white text-black border rounded-lg hover:bg-gray-100"
            >
              <img
                src="/img/google-icon.png"
                alt="Google"
                className="inline-block w-5 mr-2"
              />
              Continue with Google
            </Button>
          </div>

          {errors.general && (
            <p className="text-red-600 text-center mb-4">{errors.general}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <Button
            loading={loading}
            type="primary"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Become an Admin{" "}
              <Link
                href="/admin_signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-gray-600">
              Create an account{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-gray-600">
              <Link
                href="/"
                className="text-blue-600 hover:underline font-medium"
              >
                Go to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
