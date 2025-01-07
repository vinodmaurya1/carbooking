"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmailPassword, signUpWithGoogle } from "@/firebase"; // assuming firebase.js is set up
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "antd";
import { loginSuccess } from "@/redux/stateSlice/authSlice";
import { useDispatch } from "react-redux";

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is "user"
    profileImage: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is "user"
    profileImage: null,
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Validation logic
  // const validate = () => {
  //   const errors = {
  //     name: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     role: "user", // Default role is "user"
  //     profileImage: null,
  //     general: "",
  //   };
  //   if (!formData.name) errors.name = "Name is required";
  //   if (!formData.email) errors.email = "Email is required";
  //   if (!formData.password) errors.password = "Password is required";
  //   if (formData.password !== formData.confirmPassword)
  //     errors.confirmPassword = "Passwords do not match";
  //   return errors;
  // };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    // setErrors({});
    setLoading(true);
    // console.log("Form data:", formData);
    const role = "user";
    try {
      await signUpWithEmailPassword(
        formData.email,
        formData.password,
        formData.name,
        formData.profileImage,
        role
      );
      setSuccessMessage("Signup successful! Redirecting to login...");
      toast.success("Signup successful!");
      setLoading(false);
      router.push("/signin");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log("Signup error:", error);
      setErrors({ general: error.message });
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
      toast.error(error.message || "Google Sign-Up failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-600">
        <img
          src="/img/signup-img.jpg"
          alt="Signup"
          className="w-3/4 rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-10">
        <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl text-black font-bold text-center mb-6">
            User Sign Up
          </h2>

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
            <label
              htmlFor="name"
              className="block text-black text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-black text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border text-black rounded-lg ${
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
              className="block text-black text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-black text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-black text-sm font-medium mb-2"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg border-gray-300"
            />
            {errors.profileImage && (
              <p className="text-red-500 text-sm">{errors.profileImage}</p>
            )}
          </div>

          <Button
            loading={loading}
            type="primary"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign Up
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
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In
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
