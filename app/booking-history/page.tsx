"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { EyeOutlined } from "@ant-design/icons";
import { Card, Table, Image, Space, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchBookingsById } from "@/redux/stateSlice/bookingSlice";
import BookingModalDetails from "@/components/modal/BookingModalDetails";

export default function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [addModal, setAddModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null); // Updated to accept an object
  const { bookings, loading } = useSelector((state: RootState) => state.bookings);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchBookingsById(user.userId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log("booking-user", bookings);
  }, [bookings]); // Ensure that bookings are logged correctly when they change

  const convertDate = (utcDate: string): string => { // Explicit return type
    const date = new Date(utcDate);
    const newdate = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);
    return newdate;
  };

  function handleModalData(data: any) { // Typing as `any` since you're passing an object
    console.log("data", data);
    setBookingData(data); // Set the data object
    setAddModal(true);
  }

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(5); // Track page size

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serial",
      is_show: true,
      render: (_: string, __: unknown, index: number) => {
        return <div>{(currentPage - 1) * pageSize + index + 1}</div>;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      is_show: true,
    },
    {
      title: "Car Image",
      dataIndex: "carImage",
      is_show: true,
      render: (img: string) => {
        return (
          <Image
            width={60}
            height={60}
            src={img}
            placeholder
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Car Name",
      dataIndex: "carName",
      is_show: true,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      is_show: true,
    },
    {
      title: "Type",
      dataIndex: "carType",
      is_show: true,
      render: (type: string) => {
        return (
          <div>
            <Tag color="green">{type}</Tag>
          </div>
        );
      },
    },
    {
      title: "Availability Status",
      dataIndex: "status",
      is_show: true,
      render: (active: boolean) => {
        return (
          <div>
            {active === true ? (
              <Tag color="blue">Available</Tag>
            ) : (
              <Tag color="error">Booked</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      is_show: true,
      render: (date: string) => {
        return (
          <div>
            <Tag color="green">{convertDate(date)}</Tag>
          </div>
        );
      },
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      is_show: true,
      render: (date: string) => {
        return (
          <div>
            <Tag color="red">{convertDate(date)}</Tag>
          </div>
        );
      },
    },
    {
      title: "Options",
      dataIndex: "options",
      is_show: true,
      render: (_:string, row: any) => {
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                handleModalData(row);
              }}
            />
          </Space>
        );
      },
    },
  ];

  function onChangePagination(pagination: any) { // Typing for pagination
    const { current, pageSize } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 items-center">
        <Card title="Booking List">
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columns?.filter((item) => item.is_show)}
            dataSource={bookings}
            pagination={{
              pageSize,
              total: bookings?.length,
              current: currentPage,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={onChangePagination}
            rowKey={(record) => record.id}
          />
        </Card>
        <BookingModalDetails
          BookingModalDetails={bookingData}
          bookModal={addModal}
          handleCancel={() => setAddModal(false)}
        />
      </main>
      <Footer />
    </div>
  );
}
