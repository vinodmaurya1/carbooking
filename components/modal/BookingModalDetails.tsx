import React from "react";
import { Button, Col, Descriptions, Image, Modal, Row, Tag } from "antd";

export default function BookingModalDetails({ BookingModalDetails,bookModal, handleCancel, loading }) {
  // console.log('BookingModalDetails', BookingModalDetails)

  const convertDate = (utcDate) => {

    try {
      console.log('date-',utcDate)
      const date = new Date(utcDate);
  
      const newdate = new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(date);
  
      return newdate;
      
    } catch (error) {
      console.log('date-convert',error)
    }
  };

  return (
    <Modal
      visible={bookModal}
      title="Booking Details"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
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
                src={BookingModalDetails?.carImage}
                placeholder
                style={{ borderRadius: 4, objectFit: "cover" }}
              />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Car Name">
              {BookingModalDetails?.carName}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Username">
              {BookingModalDetails?.username}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Price Per Day">
              ₹{BookingModalDetails?.price}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Type">
            <Tag color="green">{BookingModalDetails?.carType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Total Price">
             {BookingModalDetails?.price} × {BookingModalDetails?.totalPrice/BookingModalDetails?.price} = ₹{BookingModalDetails?.totalPrice}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="From Date">
            <Tag color="green">{convertDate(`${BookingModalDetails?.fromDate}`)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="To Date">
            <Tag color="red">{convertDate(`${BookingModalDetails?.toDate}`)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Status">
            {BookingModalDetails?.status === true ? (
              <Tag color="blue">Available</Tag>
            ) : (
              <Tag color="error">Booked</Tag>
            )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
}
