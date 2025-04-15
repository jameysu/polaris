import React, { useState } from 'react';
import {Button, Checkbox, Flex, Form, Input, Modal, Select, Table, Typography, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SetApplicationModal = ({ visible, setVisible }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    form.validateFields()
      .then(values => {
        console.log("Submitted data:", values);
        setCurrentStep(4); // Go to pending approval step
      })
      .catch(err => {
        console.log("Validation errors:", err);
      });
  };

  const handleBeforeUpload = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // Log the Base64 string here
      console.log("Base64 String:", reader.result);
    };

    reader.readAsDataURL(file); // Convert the file to Base64

    // Return false to prevent the default upload action (automatic upload)
    return false;
  };

  const renderFooter = () => (
    <Flex justify="space-between">
      {currentStep > 1 && currentStep < 4 ? (
        <Button onClick={handleBack} shape="round">Back</Button>
      ) : (
        <Button onClick={() => setVisible(false)} shape="round">Cancel</Button>
      )}
      {currentStep === 3 ? (
        <Button type="primary" onClick={handleFinish} shape="round">Submit</Button>
      ) : currentStep === 4 ? (
        <Button type="primary" onClick={() => {
          setVisible(false);
          setCurrentStep(1); // Reset for next use
        }} shape="round">Okay</Button>
      ) : (
        <Button type="primary" onClick={handleNext} shape="round">Next</Button>
      )}
    </Flex>
  );

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      closable={false}
      footer={renderFooter()}
      width={600}
      centered
    >
      {currentStep === 1 && (
        <Flex vertical gap="middle">
          <Text>What is the purpose of your transaction?</Text>
          <Select
            placeholder="Select your transaction"
            options={[
              { value: '1', label: 'Get Permit for COV for the Transport of Planted Trees' },
              { value: '2', label: 'Application of Chainsaw Registration' },
              { value: '3', label: 'Issuance of Special/Tree Cutting permit (Govt Projects)' },
            ]}
          />
          <Text strong>Requirements:</Text>
          <Paragraph>
            <ul>
              <li>Request letter indicating (1 original, 1 photocopy)
                <ul>
                  <li>Type of forest product</li>
                  <li>Species</li>
                  <li>Estimated volume/quantity</li>
                  <li>Type of conveyance and plate number</li>
                  <li>Name and address of the consignee/destination</li>
                  <li>Date of transport</li>
                </ul>
              </li>
              <li>Certification that the forest products are harvested within the area of the owner (1 original)</li>
              <li>Approved Tree Cutting Permit for timber (1 photocopy)</li>
              <li>OR/CR of conveyance and Driver's License</li>
              <li>Additional Requirements
                <ul>
                  <li>Certificate of Transport Agreement</li>
                  <li>Special Power of Attorney (SPA)</li>
                </ul>
              </li>
            </ul>
          </Paragraph>
        </Flex>
      )}

      {currentStep === 2 && (
        <Flex vertical gap="middle">
          <Title level={3} style={{ textAlign: 'center' }}>APPLICATION FORM</Title>
          <Text type="secondary" style={{ textAlign: 'center' }}>
            Please provide your contact information. We will send confirmation via email.
          </Text>

          <Form layout="vertical" form={form}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item label="Middle Name" name="middleName">
              <Input placeholder="Middle Name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: 'email', required: true }]}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Mobile Number" name="mobile" rules={[{ required: true }]}>
              <Input placeholder="Mobile Number" />
            </Form.Item>
            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must agree to continue')),
                },
              ]}
            >
              <Checkbox>
                I agree to the collection and use of the data I will provide through this form by DENR
              </Checkbox>
            </Form.Item>
          </Form>
        </Flex>
      )}

      {currentStep === 3 && (
        <>
          <Text>Please upload the required documents:</Text>
          <Table
            showHeader={false}
            pagination={false}
            dataSource={[
              'Application Form',
              'Letter Request',
              'Certificate of Forest Products',
              'Approved Tree Cutting Permit',
              "OR/CR of Conveyance and Driver's License",
              'Additional Requirements',
            ].map((label, index) => ({
              key: index,
              name: label,
            }))}
            columns={[
              {
                dataIndex: 'name',
                key: 'name',
              },
              {
                key: 'upload',
                render: (_, record) => (
                  <Upload name="file" maxCount={1} beforeUpload={handleBeforeUpload}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                ),
              },
            ]}
          />
        </>
      )}

      {currentStep === 4 && (
        <Flex vertical align="center" justify="center" gap="middle" style={{ padding: '2rem 0' }}>
          <Title level={3}>Pending for Approval</Title>
          <Text type="secondary" style={{ textAlign: 'center', maxWidth: 400 }}>
            Your application has been submitted successfully and is currently pending for approval. You will be notified via email once processed.
          </Text>
        </Flex>
      )}
    </Modal>
  );
};

export default SetApplicationModal;
