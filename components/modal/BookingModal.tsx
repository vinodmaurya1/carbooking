import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Descriptions, Image, Modal, Row } from "antd";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateCar } from "@/redux/stateSlice/carSlice";
import { addBooking } from "@/redux/stateSlice/bookingSlice";

export default function BookingModal({ bookModal, handleCancel, car, user, loading }) {
  // console.log('car', car)
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [from, to] = dates;
      const days = to.diff(from, "days") + 1; // Including the start date
      const total = days * car.price; // Calculate total price
      setSelectedDates(dates);
      setTotalPrice(total);
    } else {
      setSelectedDates([]);
      setTotalPrice(0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDates.length || !user || !car) {
      alert("Please fill all fields!");
      return;
    }

    const [fromDate, toDate] = selectedDates;
    console.log('dates' , fromDate.toISOString() , toDate.toISOString())

    try {
      const bookingData = {
        username: user?.name || "Anonymous", // Fallback to "Anonymous" if `user.name` is not defined
        userId: user?.userId,
        carId: car?.id,
        carName: car.name,
        carImage: car.carImage,
        carType: car.type,
        price: car.price,
        totalPrice,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      dispatch(addBooking(bookingData)).unwrap().then((result) => {
    console.log("Booking successful:", result);
      toast.success("Booking saved successfully")
      handleCancel();
  })
  .catch((error) => {
    console.error("Booking failed:", error);
    toast.error(error || "An error occurred"); // Example for showing a toast
  });

      // await  dispatch(updateCar({ id:car?.id, name:car?.name, price:car.price, carImage: car?.carImage, status: false, type:car?.type }));


    } catch (error) {
      toast.error("Failed to save booking")
      console.error("Failed to save booking:", error);
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
