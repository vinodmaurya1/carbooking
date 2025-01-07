"use client";
import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Button,
  Image,
  Col,
  Row,
  Tag,
  Select,
  Space,
  Slider,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchCars } from "@/redux/stateSlice/carSlice";
import BookingModal from "../modal/BookingModal";
import toast from "react-hot-toast";

const marks = {
  1000: "₹1000",
  5000: "₹5000",
  10000: "₹10,000",
};

const CarList = () => {
  const { cars, loading } = useSelector((state: RootState) => state.cars);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [bookModal, setBookModal] = useState(false);
  const [carData, setCarData] = useState(null);
  const [filters, setFilters] = useState({
    type: null,
    availability: null,
    priceRange: [1000, 10000],
    search: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleBookModal = (data) => {
    if (!isAuthenticated) {
      toast.error("User does not exist!");
    } else {
      setBookModal(true);
      setCarData(data);
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredCars = cars.filter((car) => {
    const inPriceRange =
      car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
    const matchesType = filters.type ? car.type === filters.type : true;
    const matchesAvailability =
      filters.availability == null || car.status === filters.availability;
    const matchesSearch =
      filters.search.trim() === "" ||
      car.name.toLowerCase().includes(filters.search.toLowerCase());

    return inPriceRange && matchesType && matchesAvailability && matchesSearch;
  });

  const { Search } = Input;

  return (
    <>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6}>
            <Space direction="vertical" style={{ width: "90%" }}>
              <div>Search a Car</div>
              <Search
                placeholder="Search a Car"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                enterButton
              />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Space direction="vertical" style={{ width: "90%" }}>
              <div>Select Car Type</div>
              <Select
                value={filters.type}
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange("type", value)}
                allowClear
                options={[
                  { value: "suv", label: "SUV" },
                  { value: "sedan", label: "Sedan" },
                  { value: "hatchback", label: "Hatchback" },
                ]}
                placeholder="Select Type"
              />
            </Space>
          </Col>

          {/* Filter by Price Range */}
          <Col xs={24} sm={24} md={6}>
            <Space direction="vertical" style={{ width: "90%" }}>
              <div>Select Price Range</div>
              <Slider
                range
                marks={marks}
                min={1000}
                max={10000}
                defaultValue={filters.priceRange}
                onChange={(value) => handleFilterChange("priceRange", value)}
              />
            </Space>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Space direction="vertical" style={{ width: "90%" }}>
              <div>Select Car Availability</div>
              <Select
                style={{ width: "100%" }}
                allowClear
                value={filters.availability}
                onChange={(value) => handleFilterChange("availability", value)}
                options={[
                  { value: true, label: "Book now" },
                  { value: false, label: "Booked" },
                ]}
                placeholder="Select Availability"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <List
      className="my-3"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
        }}
        loading={loading}
        pagination={{
          pageSize: 12,
        }}
        dataSource={filteredCars}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={{ width: "100%" }}
              cover={
                <Image
                  height={180}
                  // width={100}
                  src={item.carImage}
                  placeholder
                  style={{ borderRadius: 4, objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  key="book"
                  color={item.status === true ? "primary" : "danger"}
                  variant="outlined"
                  disabled={!item.status}
                  onClick={() => handleBookModal(item)}
                >
                  {item.status === true ? "Book Now" : "Booked"}
                </Button>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <div className="my-2">Name:</div>
                </Col>
                <Col span={12}>
                  <h2 className="my-2" style={{ fontWeight: "bold" }}>
                    {item.name}
                  </h2>
                </Col>
                <Col span={12}>
                  <div className="my-2">Price:</div>
                </Col>
                <Col span={12}>
                  <h2 className="my-2" style={{ fontWeight: "bold" }}>
                    ₹{item.price}/day
                  </h2>
                </Col>
                <Col span={12}>
                  <div className="my-2">Type:</div>
                </Col>
                <Col span={12}>
                  <div className="my-2">
                    <Tag color="green">{item.type}</Tag>
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />

      <BookingModal
        loading={loading}
        car={carData}
        user={user}
        bookModal={bookModal}
        handleCancel={() => setBookModal(false)}
      />
    </>
  );
};

export default CarList;
