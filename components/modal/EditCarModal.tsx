import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Image, Input, Modal, Row, Select, Switch } from "antd";
import { useDispatch } from "react-redux";
import { updateCar } from "@/redux/stateSlice/carSlice";
import { AppDispatch } from "@/redux/store/store";

// Define the props type
type EditCarModalProps = {
  editModal: boolean;
  handleCancel: () => void;
  car: {
    id: string;
    name: string;
    price: number;
    carImage: string;
    status: boolean;
    type: string;
  } | null; // `null` in case the `car` prop is not available
  loading: boolean;
};

export default function EditCarModal({
  editModal,
  handleCancel,
  car,
  loading,
}: EditCarModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    carImage: File | null;
    status: boolean; // Change `status` to `boolean` instead of `true`
    type: string;
  }>({
    name: car?.name || "",
    price: car?.price || 0,
    carImage: null,
    status: car?.status || true, // default to true but now typed as boolean
    type: car?.type || "",
  });
  const dispatch = useDispatch<AppDispatch>();

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
    console.log("formData:", formData);
    

    if (!name || !price || (!carImage && !car?.carImage) || !type) {
      alert("Please fill all fields!");
      return;
    }

    dispatch(
      updateCar({
        id: car?.id || "",
        name,
        price,
        carImage: carImage instanceof File ? carImage : null,
        status,
        type,
      })
    );
    handleCancel();
  };

  return (
    <Modal
      open={editModal} // `visible` updated to `open` for Ant Design v5 compatibility
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
