import { Button, Card, Col, DatePicker, DatePickerProps, Divider, Form, Input, Row, Select, Space, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../../../../interfaces/IUpload";
import { EmployeesInterface } from "../../../../interfaces/IEmployee";
import { PromotionInterface } from "../../../../interfaces/IPromotion";
import { CreatePromotion, GetEmployee } from "../../../../services/https/promotion";
import { GetEmployeeById } from "../../../../services/https/employee";

const { Option } = Select;
function PromotionCreate() {

    const navigate = useNavigate();
    const handleCancel = () => { navigate("/promotion"); };
    const [messageApi, contextHolder] = message.useMessage();
    const [promotionimage, setPromotionimage] = useState<ImageUpload>();
    const [employee, setEmployee] = useState<EmployeesInterface[]>([]);

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const onFinish = async (values: PromotionInterface) => {
        values.Image = promotionimage?.thumbUrl;
        values.Discount = parseFloat(values.Discount!.toString());
        values.DiscountPoint = parseFloat(values.DiscountPoint!.toString());
        values.EmployeeID = Number(localStorage.getItem('id'))

        let resPromotion = await CreatePromotion(values);

        if (resPromotion) {
            messageApi.open({
                type: "success",
                content: "บันทึกข้อมูลสำเร็จ",
            });
            setTimeout(function () {
                navigate("/promotion");
            }, 2000);
        } else {
            messageApi.open({
                type: "error",
                content: "บันทึกข้อมูลไม่สำเร็จ",
            });
        }
        console.log(values);
    }

    useEffect(() => {
        GetEmployees();
    }, []);

    const GetEmployees = async () => {
        let res = await GetEmployee();
        if (res) {
            setEmployee(res);
        }
    }; // select Employee to use (combobox)

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        setPromotionimage(e?.fileList[0])
        return e?.fileList;
    };

    return (
        <div>
            {contextHolder}
            <Card>
                <h2>เพิ่มข้อมูลโปรโมชั่น</h2>
                <Divider />
                <Form
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="รหัสโปรโมชั่น"
                                name="Code"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณากรอกรหัสโปรโมชั่น !",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="ชื่อโปรโมชั่น"
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณากรอกชื่อโปรโมชั่น !",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="ราคาส่วนลด"
                                name="Discount"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณากรอกราคาส่วนลด !",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="คะแนนที่ใช้"
                                name="DiscountPoint"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณากรอกคะแนนที่ใช้ !",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="start">
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="เลือกเวลาเริ่มต้นโปรโมชั่น"
                                name="TimeOfbegin"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณาเลือกเวลาเริ่มต้นโปรโมชั่น !",
                                    },
                                ]}
                            >
                                <DatePicker onChange={onChange} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="เลือกเวลาสิ้นสุดโปรโมชั่น"
                                name="TimeOfend"
                                rules={[
                                    {
                                        required: true,
                                        message: "กรุณาเลือกเวลาสิ้นสุดโปรโมชั่น !",
                                    },
                                ]}
                            >
                                <DatePicker onChange={onChange} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="รูปโปรโมชั่น"
                        name="Image" // -> ใส่มาก่อน เพราะ setup data มาไม่มี Image
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    // rules={[{ required: true,  message: "กรุณาเพิ่มรูปภาพ !", }]}
                    >
                        <Upload maxCount={1} multiple={false} listType="picture-card">
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>อัพโหลด</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Row justify="end">
                        <Col style={{ marginTop: "40px" }}>
                            <Form.Item>
                                <Space>
                                    <Button htmlType="button" style={{ marginRight: "10px" }} onClick={handleCancel}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<PlusOutlined />}
                                        style={{ background: '#E48F44' }}
                                    >
                                        ยืนยัน
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default PromotionCreate;