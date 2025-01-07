"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      if (!isAuthenticated) {
        router.push("/signin");
      }
    };
    checkLogin();
  }, [router]);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-100 items-center">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="mt-10 bg-white text-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                {profileData?.profilePicture ? (
                  <Image
                    src={profileData.profilePicture}
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-indigo-500"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">No Image</span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.24 2.76l4 4-4 4M8 9h4a4 4 0 014 4v6H4v-6a4 4 0 014-4h0m2 0V6a4 4 0 018 0v3"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {profileData?.name || "User Name"}
              </h2>
              <p className="text-gray-600 mt-1">
                {profileData?.email || "N/A"}
              </p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                  profileData?.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {profileData?.role || "N/A"}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Email:</span>
                <span>{profileData?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Role:</span>
                <span>{profileData?.role || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
