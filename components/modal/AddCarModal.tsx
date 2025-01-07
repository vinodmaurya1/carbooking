import React, { useState } from "react";
import { Button, Col, Descriptions, Input, Modal, Row, Select, Space, Switch } from "antd";
import { useDispatch } from "react-redux";
import { addCar } from "@/redux/stateSlice/carSlice";
import { AppDispatch } from "@/redux/store/store";

// Define types for the props
interface AddCarModalProps {
  addModal: boolean;
  handleCancel: () => void;
}

// Define the type for the form data
interface CarFormData {
  name: string;
  price: number;
  carImage: File | null;  // It could be null if no image is selected
  status: boolean;
  type: string;
  
}

const AddCarModal: React.FC<AddCarModalProps> = ({ addModal, handleCancel }) => {
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    price: 0,
    carImage: null,
    status: true,
    type: "",
  });

  const dispatch = useDispatch<AppDispatch>(); // Properly type dispatch

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = () => {
    const { name, price, carImage, status, type } = formData;

    if (!name || !price || !carImage || !type) {
      alert("Please fill all fields!");
      return;
    }

    // If carImage is a file, you may need to handle it differently (e.g., upload to a server, then store the URL)
    const carData = {
      name,
      price,
      carImage, // Store the image filename or URL as string
      status,
      type,
    };

    dispatch(addCar(carData)); // Dispatch the action correctly
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
};

export default AddCarModal;
