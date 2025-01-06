import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Image, Input, Modal, Row, Select, Switch } from "antd";
import { useDispatch } from "react-redux";
import { updateCar } from "@/redux/stateSlice/carSlice";

export default function EditCarModal({ editModal, handleCancel, car , loading }) {
  const [formData, setFormData] = useState({
    name: car?.name || "",
    price: car?.price || 0,
    carImage: null,
    status: car?.status || true,
    type: car?.type || "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || "",
        price: car.price || 0,
        status: car.status || true,
        carImage: null,
        type: car.type || "",
      });
    }
  }, [car]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = () => {
    const { name, price, carImage, status, type } = formData;
    console.log("formData:", formData);

    if ( !name || !price || (!carImage && !car?.carImage) || !type) {
      alert("Please fill all fields!");
      return;
    }

    dispatch(updateCar({ id:car?.id, name, price, carImage: carImage || car?.carImage, status, type }));
    handleCancel();
  };

  return (
    <Modal
      visible={editModal}
      title="Edit Car"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="edit" loading={loading} type="primary" onClick={handleSubmit}>
          Update
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Descriptions bordered>
            <Descriptions.Item span={3} label="Car Image">
              <div className="flex">
                <Image
                  width={50}
                  height={50}
                  src={car?.carImage}
                  placeholder
                  style={{ borderRadius: 4, objectFit: "cover" }}
                />
                <Input type="file" name="carImage" onChange={handleInputChange} />
              </div>
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
              <Select
                value={formData.type}
                style={{ width: "100%" }}
                onChange={handleSelectChange}
                options={[
                  { value: "suv", label: "SUV" },
                  { value: "sedan", label: "Sedan" },
                  { value: "hatchback", label: "Hatchback" },
                ]}
                placeholder="Select Type"
              />
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Status">
              <Switch
                checked={formData.status}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, status: checked }))
                }
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
}
