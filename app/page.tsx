import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingList from "../components/BookingList";
import CarList from "@/components/list/CarList";
import { Toaster } from "react-hot-toast";
import { Card, Select, Space } from "antd";


export default function Home() {
  return (
<><Toaster position="top-right" />
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-10 px-4">
          <h3 className="text-3xl font-bold text-center mb-6">Car List</h3>

          <CarList />
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
