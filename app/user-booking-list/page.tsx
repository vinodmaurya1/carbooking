"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AddCarModal from "@/components/modal/AddCarModal";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Card, Table, Switch, Image, Space, Button, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { deleteCar, fetchCars } from "@/redux/stateSlice/carSlice";
import EditCarModal from "@/components/modal/EditCarModal";
import { useRouter } from "next/navigation";
import { fetchBookings } from "@/redux/stateSlice/bookingSlice";

export default function BookingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addData, setAddData] = useState(null);
  const { bookings, loading } = useSelector((state: RootState) => state.bookings);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    console.log("booking-new", bookings);
  }, []);


  const convertDate = (utcDate) => {
    const date = new Date(utcDate);

    const newdate = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);

    return newdate;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = user;

      if(admin?.role !== "admin" ) {
        router.push("/signin")
      } 
    };
    checkAdmin();
  }, [router]);


  function handleDeleteCar(id: string) {
    console.log("dlt", id);
    dispatch(deleteCar(id));
  }

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(5); // Track page size
  
  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serial",
      is_show: true,
      render: (_, __, index) => {
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
      render: (img, row) => {
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
      render: (type, row) => {
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
      render: (active, row) => {
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
      title: "from Date",
      dataIndex: "fromDate",
      is_show: true,
      render: (date, row) => {
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
      render: (date, row) => {
        return (
          <div>
              <Tag color="red">{convertDate(date)}</Tag>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    // selectedRowKeys: id,
    // onChange: (key) => {
    //   setId(key);
    // },
  };

  function onChangePagination(pagination, filter, sorter) {
    const { current, pageSize } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
  }
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 items-center">
        <Card
          title="Booking List"
        >
          <Table
            scroll={{ x: true }}
            rowSelection={rowSelection}
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
        <AddCarModal
          addModal={addModal}
          handleCancel={() => setAddModal(false)}
          loading={loading}
          />
        <EditCarModal
          loading={loading}
          car={addData}
          editModal={editModal}
          handleCancel={() => setEditModal(false)}
        />
      </main>
      <Footer />
    </div>
  );
}
