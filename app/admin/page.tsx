"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AddCarModal from "@/components/modal/AddCarModal";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Card, Table, Image, Space, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { deleteCar, fetchCars } from "@/redux/stateSlice/carSlice";
import EditCarModal from "@/components/modal/EditCarModal";
import { useRouter } from "next/navigation";
import { TablePaginationConfig } from 'antd';

interface Car {
  id: string;
  serial?: number;
  name: string;
  carImage: string;
  price: number;
  type: string;
  status: boolean;
}

export default function Admin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addData, setAddData] = useState<Car | null>(null);
  const { cars, loading } = useSelector((state: RootState) => state.cars);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  useEffect(() => {
    console.log("car-new", cars);
  }, [cars]);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = user;

      if (admin?.role !== "admin") {
        router.push("/signin");
      }
    };
    checkAdmin();
  }, [router, user]);

  function handleDeleteCar(id: string) {
    console.log("dlt", id);
    dispatch(deleteCar(id));
  }

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serial",
      is_show: true,
      render: (_: Car, __: unknown, index: number) => {
        return <div>{(currentPage - 1) * pageSize + index + 1}</div>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      is_show: true,
    },
    {
      title: "Image",
      dataIndex: "carImage",
      is_show: true,
      render: (img: string) => {
        return (
          <Image
            width={100}
            height={100}
            src={img}
            placeholder
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      is_show: true,
    },
    {
      title: "Type",
      dataIndex: "type",
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
      title: "Options",
      dataIndex: "options",
      is_show: true,
      render: (_: unknown, row: Car) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setAddData(row); // Now row is of type Car
                setEditModal(true);
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                handleDeleteCar(row.id); // Now row is of type Car, accessing row.id
              }}
            />
          </Space>
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

  // Pagination handler with types
  function onChangePagination(pagination: TablePaginationConfig) {
    const { current = 1, pageSize = 10 } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 items-center">
        <Card
          title="Car List"
          extra={
            <Space>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => setAddModal(true)}
              >
                Add Car
              </Button>
            </Space>
          }
        >
          <Table
            scroll={{ x: true }}
            rowSelection={rowSelection}
            loading={loading}
            columns={columns.filter((item) => item.is_show)}
            dataSource={cars}
            pagination={{
              pageSize,
              total: cars.length,
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
