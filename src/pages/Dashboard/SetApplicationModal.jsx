import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Typography,
  Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const transactionOptions = [
  {
    value: '1',
    label: 'Get Permit for COV for the Transport of Planted Trees',
    requirements: [
      'Request letter indicating:\na. Type of forest product\nb. Species\nc. Estimated volume/quantity\nd. Type of conveyance and plate number\ne. Name and address of the consignee/destination\nf. Date of transport',
      'Certification that the forest products are harvested within the area of the owner (1 original)',
      'Approved Tree Cutting Permit for timber (1 photocopy)',
      'OR/CR of conveyance and Driver’s License (1 photocopy)',
      'Certificate of Transport Agreement (if not owner of conveyance)',
      'Special Power of Attorney (SPA) (if applicant is not the land owner)'
    ]
  },
  {
    value: '2',
    label: 'Application of Chainsaw Registration',
    requirements: [
      'Duly accomplished Application Form',
      'Official Receipt of Chainsaw Purchase or Affidavit of Ownership',
      'SPA (if applicant is not the owner of the chainsaw)',
      'Detailed Specification of Chainsaw',
      'Notarized Deed of Absolute Sale (if transfer of ownership)',
      'Chainsaw to be registered',
      'Forest Tenure Agreement (if Tenurial Instrument holder)',
      'Business Permit (if Business Owner)',
      'Certificate of Registration (if Private Tree Plantation Owner)',
      'Business Permit or affidavit for legal purpose',
      'Wood processing plant permit (if licensed Wood Processor)',
      'Certification from Head of Office (if government)',
      'Latest Certificate of Chainsaw Registration (if renewal)'
    ]
  },
  {
    value: '3',
    label: 'Issuance of Special/Tree Cutting permit (Govt Projects)',
    requirements: [
      'Letter of Application (1 original)',
      'LGU Endorsement/Certification of No Objection (1 original)',
      'Approved Site/Infrastructure Plan with tree charting (1 Certified True Copy)',
      'ECC or CNC (1 certified copy)',
      'NCIP Clearance (if applicable)',
      'Waiver/Consent of owner (if titled property)',
      'PAMB Clearance/Resolution (if within Protected Area)'
    ]
  }
];

const SetApplicationModal = ({ visible, setVisible }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [form] = Form.useForm();
  const [uploads, setUploads] = useState({});
  const [formCompleted, setFormCompleted] = useState(false);

  // Enable the "Next" button if a transaction is selected for Step 1
  const isNextDisabled = (currentStep === 1 && !selectedTransaction) ||
    (currentStep === 2 && !formCompleted) ||
    (currentStep === 3 && !selectedTransaction.requirements.every(req => uploads[req]?.length > 0));

  // Disable the Submit button if all requirements are not uploaded
  const isSubmitDisabled = currentStep === 3 && selectedTransaction &&
    !selectedTransaction.requirements.every(req => uploads[req]?.length > 0);

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
        console.log("Form values:", values);
        console.log("Uploaded files:", uploads);
        setCurrentStep(4);
      })
      .catch(err => {
        console.log("Validation error:", err);
      });
  };

  const handleBeforeUpload = (file, field) => {
    setUploads(prev => ({
      ...prev,
      [field]: [file]
    }));
    return false;
  };

  // Handle form value changes and check if the form is completed
  const onValuesChange = (changedValues, allValues) => {
    if (currentStep === 2) {
      setFormCompleted(allValues.firstName && allValues.lastName && allValues.email && allValues.mobile);
    }
  };

  const renderFooter = () => (
    <Flex justify="space-between">
      {currentStep > 1 && currentStep < 4 ? (
        <Button onClick={handleBack}>Back</Button>
      ) : (
        <Button onClick={() => setVisible(false)}>Cancel</Button>
      )}
      {currentStep === 3 ? (
        <Button type="primary" onClick={handleFinish} disabled={isSubmitDisabled}>Submit</Button>
      ) : currentStep === 4 ? (
        <Button type="primary" onClick={() => {
          setVisible(false);
          setCurrentStep(1);
          form.resetFields();
          setSelectedTransaction(null);
          setUploads({});
        }}>Okay</Button>
      ) : (
        <Button type="primary" onClick={handleNext} disabled={isNextDisabled}>Next</Button>
      )}
    </Flex>
  );

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      closable={false}
      footer={renderFooter()}
      width={700}
      centered
    >
      {currentStep === 1 && (
        <Flex vertical gap="middle">
          <Text>What is the purpose of your transaction?</Text>
          <Select
            placeholder="Select your transaction"
            options={transactionOptions}
            onChange={(value) => {
              const transaction = transactionOptions.find(opt => opt.value === value);
              setSelectedTransaction(transaction);
              setUploads({});
            }}
          />
          {selectedTransaction && (
            <>
              <Text strong>Requirements:</Text>
              <Paragraph>
                <ul>
                  {selectedTransaction.requirements.map((req, index) => (
                    <li key={index}>
                      {req.includes('\n') ? (
                        <>
                          {req.split('\n')[0]}
                          <ul>
                            {req.split('\n').slice(1).map((sub, i) => (
                              <li key={i}>{sub}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        req
                      )}
                    </li>
                  ))}
                </ul>
              </Paragraph>
            </>
          )}
        </Flex>
      )}

      {currentStep === 2 && (
        <Flex vertical gap="middle">
          <Title level={3} style={{ textAlign: 'center' }}>APPLICATION FORM</Title>
          <Text type="secondary" style={{ textAlign: 'center' }}>
            Please provide your contact information. We will send confirmation via email.
          </Text>

          <Form layout="vertical" form={form} onValuesChange={onValuesChange}>
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
              rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to continue')) }]}>
              <Checkbox>
                I agree to the collection and use of the data I will provide through this form by DENR
              </Checkbox>
            </Form.Item>
          </Form>
        </Flex>
      )}

      {currentStep === 3 && selectedTransaction && (
        <>
          <Text>Please upload the required documents:</Text>
          <Table
            dataSource={selectedTransaction.requirements.map((req, index) => ({
              key: index,
              label: req,
              fileList: uploads[req] || [],
            }))}
            pagination={false}
            columns={[
              {
                title: 'Requirement',
                dataIndex: 'label',
                key: 'label',
                render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
              },
              {
                title: 'Upload',
                key: 'upload',
                render: (_, record) => (
                  <Upload
                    beforeUpload={(file) => handleBeforeUpload(file, record.label)}
                    fileList={record.fileList}
                    onRemove={() =>
                      setUploads(prev => {
                        const updated = { ...prev };
                        delete updated[record.label];
                        return updated;
                      })
                    }
                  >
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