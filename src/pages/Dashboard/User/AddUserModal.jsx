// src/pages/User/AddUserModal.jsx
import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Flex, Select, message as antdMessage } from 'antd';
import http from '../../../utils/http';
import AddUpdateUserModalStyled from "./AddUpdateUserModal.styles.jsx";

const { Option } = Select;

function AddUserModal({ visible, setVisible, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [message, contextHolder] = antdMessage.useMessage();

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log(values);
      const res = await http.post('/auth/signup', values);
      if (res.success) {
        message.success('User added successfully!');
        form.resetFields();
        setVisible(false);
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <AddUpdateUserModalStyled
        title="Add New User"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: 'Please input first name' }]}
            style={{ marginBottom: 10 }}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name' }]}
            style={{ marginBottom: 10 }}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item name="middlename" label="Middle Name" style={{ marginBottom: 10 }}>
            <Input placeholder="Enter middle name (optional)" />
          </Form.Item>

          <Flex gap="middle" style={{ justifyContent: 'space-between' }}>
            <Form.Item
              name="birthday"
              label="Birthday"
              style={{ marginBottom: 10, flex: 1 }}
            >
              <DatePicker placeholder="Select date of birth" format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[{ required: true, message: 'Please input mobile number' }]}
              style={{ marginBottom: 10, flex: 1 }}
            >
              <Input addonBefore="+63" placeholder="9XXXXXXXXX" />
            </Form.Item>
          </Flex>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username' }]}
            style={{ marginBottom: 10 }}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input email' }]}
            style={{ marginBottom: 10 }}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input password' }]}
            style={{ marginBottom: 10 }}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input.Password placeholder="Re-enter password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="User Type"
            rules={[{ required: true, message: 'Please select a user type' }]}
            style={{ marginBottom: 10 }}
          >
            <Select placeholder="Select a user type">
              <Option value={1}>ADMIN</Option>
              <Option value={2}>CLIENT</Option>
              <Option value={3}>RECEIVING/RELEASING CLERK</Option>
              <Option value={4}>CENR OFFICER</Option>
              <Option value={5}>CHIEF RPS</Option>
              <Option value={6}>DEPUTY CENR OFFICER</Option>
              <Option value={7}>INSPECTION TEAM RPS/TSD</Option>
              <Option value={8}>TECHNICAL STAFF CONCERNED</Option>
            </Select>
          </Form.Item>

          <Button htmlType="submit" type="primary" loading={loading} block>
            Add User
          </Button>
        </Form>
      </AddUpdateUserModalStyled>
    </>
  );
}

export default AddUserModal;
