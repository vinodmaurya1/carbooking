import React, { useState } from "react";
import { Button, Col, Descriptions, Input, Modal, Row, Select, Space, Switch } from "antd";
import { useDispatch } from "react-redux";
import { addCar } from "@/redux/stateSlice/carSlice";

export default function AddCarModal({ addModal, handleCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    carImage: null,
    status: true,
    type: "",
  });
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value) => {console.log(value)
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = () => {
    const { name, price, carImage, status, type } = formData;
    console.log("Form Data:", formData);
    if (!name || !price || !carImage || !type) {
      alert("Please fill all fields!");
      return;
    }

    dispatch(addCar({ name, price, carImage, status, type }));
    setFormData({
      name: "",
      type: "",
      price: 0,
      carImage: null,
      status: true,
    });
    handleCancel();
  };

  return (
    <Modal
      visible={addModal}
      title="Add Car"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleSubmit}>
          Add
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Descriptions bordered>
            <Descriptions.Item span={3} label="Car Image">
              <Input type="file" name="carImage" onChange={handleInputChange} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Car Name">
              <Input
                name="name"
                placeholder="Car Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Price per day">
              <Input
                name="price"
                type="number"
                placeholder="Price per day"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Type">
              <Space wrap>
                <Select
                  value={formData.type}
                  style={{ width: 250 }}
                  onChange={handleSelectChange}
                  allowClear
                  options={[
                    { value: "suv", label: "SUV" },
                    { value: "sedan", label: "Sedan" },
                    { value: "hatchback", label: "Hatchback" },
                  ]}
                  placeholder="Select Type"
                />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Status">
              <Switch
                checked={formData.status}
                onChange={(checked) => setFormData((prev) => ({ ...prev, status: checked }))}
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
}
