import React, { useState } from "react";
import { Button, Col, DatePicker, Descriptions, Image, Modal, Row } from "antd";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addBooking } from "@/redux/stateSlice/bookingSlice";
import { AppDispatch } from "@/redux/store/store";
import { fetchCars } from "@/redux/stateSlice/carSlice";

// Define the types for car and user (you can adjust these as needed)
interface Car {
  id: string;
  name: string;
  carImage: string;
  type: string;
  price: number;
}
interface User {
  userId: string | null;
  name: string | null;
  email: string | null;
  profilePicture: string | null;
  role: string | null;
}


interface BookingModalProps {
  bookModal: boolean;
  handleCancel: () => void;
  car: Car | null; 
  user: User;
  loading: boolean;
}


export default function BookingModal({
  bookModal,
  handleCancel,
  car,
  user,
  loading,
}: BookingModalProps) {
  const [selectedDates, setSelectedDates] = useState<any[]>([]); // Use 'any[]' for now if you expect a date range
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2 && car?.price !== undefined) {
      const [from, to] = dates;
      const days = to.diff(from, "days") + 1; // Including the start date
      const total = days * car?.price; // Calculate total price
      setSelectedDates(dates);
      setTotalPrice(total);
    } else {
      setSelectedDates([]);
      setTotalPrice(0);
    }
  };

  const handleSubmit = async () => {
    try {
      const bookingResult = await dispatch(
        addBooking({
          username: user?.name || "Anonymous",
          userId: user?.userId || "",
          carId: car?.id || "",
          price: car?.price || 0,
          totalPrice,
          carName: car?.name || "",
          carImage: car?.carImage || "",
          carType: car?.type || "",
          status: false,
          fromDate: new Date().toISOString(),
          toDate: new Date().toISOString(),
        })
      ).unwrap(); // Unwraps the result or throws an error
  
      console.log("Booking successful:", bookingResult);
      toast.success("Booking saved successfully!");
      dispatch(fetchCars());
      handleCancel(); // Close modal on success
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(error || "Failed to save booking.");
    }
  };
  

  const { RangePicker } = DatePicker;

  return (
    <Modal
      visible={bookModal}
      title="Book Car"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} type="primary" onClick={handleSubmit}>
          Book Now
        </Button>,
      ]}
    >
      <Row gutter={12}>
        <Col span={24}>
          <Descriptions bordered>
            <Descriptions.Item span={3} label="Car Image">
              <Image
                width={50}
                height={50}
                src={car?.carImage}
                placeholder
                style={{ borderRadius: 4, objectFit: "cover" }}
              />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Car Name">
              {car?.name}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Price Per Day">
              ₹{car?.price}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Type">
              {car?.type}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Username">
              {user?.name || "Anonymous"}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Date">
              <RangePicker onChange={handleDateChange} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Total Price">
              ₹{totalPrice || 0}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
}
