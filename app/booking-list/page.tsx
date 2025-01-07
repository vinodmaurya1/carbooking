"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, Table, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { fetchBookings } from "@/redux/stateSlice/bookingSlice";

export default function BookingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading } = useSelector((state: RootState) => state.bookings);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    console.log("booking-new", bookings);
  }, []);


  const convertDate = (utcDate:string) => {
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
    const checkLogin = async () => {

      if(!isAuthenticated) {
        router.push("/signin")
      } 
    };
    checkLogin();
  }, [router]);


  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(5); // Track page size
  

  interface Booking {
    serial: string;
    username: string;
    carImage: string;
    carName: string;
    totalPrice: string;
    carType: string;
    status: boolean;
    fromDate: string;
    toDate: string;
  }


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
            {active ? (
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
  ];

  const rowSelection = {
    // selectedRowKeys: id,
    // onChange: (key) => {
    //   setId(key);
    // },
  };

  function onChangePagination(pagination: any) {
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
      </main>
      <Footer />
    </div>
  );
}
