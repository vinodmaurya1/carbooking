"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { logout } from "@/redux/stateSlice/authSlice";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { Avatar, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    console.log("user", user);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(logout());
      toast.success("Logout successful!");

      router.push("/signin");
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-blue-600 text-white py-4 shadow px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Book Your Car
        </Link>

        <button
          className="block md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <ul className="hidden md:flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/booking-history" className="hover:underline">
                  Booking History
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
              {user?.role === "admin" ? (
                <>
                  <li>
                    <Link href="/booking-list" className="hover:underline">
                      Booking List
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:underline">
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
              <li>
                <Button
                  onClick={() => router.push("/profile")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  icon={
                    <Avatar
                      src={
                        <img
                          src={user?.profilePicture}
                          style={{ width: "20px", height: "20px" }}
                          alt="avatar"
                        />
                      }
                    />
                  }
                >
                  {user?.name}
                </Button>
              </li>
              <li>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/signin"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  SignIn
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="bg-yellow-400 text-blue-600 px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                >
                  SignUp
                </Link>
              </li>
            </>
          )}
        </ul>

        <ul
          style={{ zIndex: "10" }}
          className={`absolute top-16 left-0 w-full bg-blue-600 text-white flex-col space-y-2 p-4 md:hidden ${
            isMobileMenuOpen ? "flex" : "hidden"
          }`}
        >
          <li>
            <Link
              href="/"
              className="hover:underline"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:underline"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:underline"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <>
            <li>
                <Link href="/booking-history" className="hover:underline">
                  Booking History
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
              {user?.role === "admin" ? (
                <>
                  <li>
                    <Link href="/booking-list" className="hover:underline">
                      Booking List
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:underline">
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
              <li>
                <Button
                  onClick={() => router.push("/profile")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  icon={
                    <Avatar
                      src={
                        <img
                          src={user?.profilePicture}
                          style={{ width: "20px", height: "20px" }}
                          alt="avatar"
                        />
                      }
                    />
                  }
                >
                  {user?.name}
                </Button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/signin"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  onClick={toggleMobileMenu}
                >
                  SignIn
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="bg-yellow-400 text-blue-600 px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                  onClick={toggleMobileMenu}
                >
                  SignUp
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
