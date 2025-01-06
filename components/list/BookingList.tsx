"use client";
import React, { useEffect } from "react";
import {
  Avatar,
  List,
  Card,
  Button,
  Image,
  Col,
  Descriptions,
  Row,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchCars } from "@/redux/stateSlice/carSlice";

const { Meta } = Card;

const CarList = () => {
  const { cars, loading } = useSelector((state: RootState) => state.cars);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  // console.log('car' , cars)
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
      }}
      loading={loading}
      pagination={{
        pageSize: 9,
        onChange: (page) => {
          console.log("Page:", page);
        },
      }}
      dataSource={cars}
      renderItem={(item) => (
        <List.Item>
          <Card
            style={{ width: "100%" }}
            cover={
              <Image
                // width={100}
                height={200}
                src={item.carImage}
                placeholder
                style={{ borderRadius: 4, objectFit: "cover" }}
              />
              //   <Image
              //     alt="example"
              //     src={item.carImage}
              //   />
            }
            actions={[
              <Button
                key="book"
                loading={false}
                color={item.status === true ? "primary" : "danger"}
                variant="outlined"
                disabled={!item.status}
              >
                {item.status === true ? "Book Now" : "Booked"}
              </Button>,
            ]}
          >
            <Row gutter={12}>
              <Col span={12}>
                <div className="my-2" >
                  Name:
                </div>
              </Col>
              <Col span={12}>
                <h2 className="my-2" style={{ fontWeight: "bold" }}>
                {item.name}
                </h2>
              </Col>
              <Col span={12}>
                <div className="my-2" >
                  Price:
                </div>
              </Col>
              <Col span={12}>
                <h2 className="my-2" style={{ fontWeight: "bold" }}>
                  ₹{item.price}
                </h2>
              </Col>
              <Col span={12}>
                <div className="my-2" >
                  Type:
                </div>
              </Col>
              <Col span={12}>
                <div className="my-2" >
              <Tag color="green">{item.type}</Tag>
                </div>
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default CarList;
