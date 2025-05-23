import React, { useEffect } from 'react';
import {Modal, Form, Input, Select, DatePicker, Button, message as antdMessage} from 'antd';
import dayjs from 'dayjs';
import http from '../../../utils/http';
import AddUpdateUserModalStyled from "./AddUpdateUserModal.styles.jsx";

const { Option } = Select;

function EditUserModal({ visible, setVisible, user, onSuccess }) {
  const [form] = Form.useForm();
  const [message, contextHolder] = antdMessage.useMessage();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        usertype: user.usertype,
        firstname: user.UserDetail?.firstname,
        middlename: user.UserDetail?.middlename,
        lastname: user.UserDetail?.lastname,
        mobile: user.UserDetail?.mobile,
        birthday: user.UserDetail?.birthday ? dayjs(user.UserDetail.birthday) : null,
      });
    }
  }, [user, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        userid: user.userid,
        username: values.username,
        email: values.email,
        usertype: values.usertype,
        firstname: values.firstname,
        middlename: values.middlename,
        lastname: values.lastname,
        mobile: values.mobile,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      };

      await http.put('/auth/user/update', payload);

      message.success('User updated successfully');
      form.resetFields();
      setVisible(false);
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      message.error(err?.response?.message || 'Failed to update user');
    }
  };

  return (
    <AddUpdateUserModalStyled
      open={visible}
      title="Edit User"
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}>
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item name="usertype" label="User Type" rules={[{ required: true, message: 'Please select a user type' }]}>
          <Select placeholder="Select user type">
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

        <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item name="middlename" label="Middle Name">
          <Input placeholder="Enter middle name (optional)" />
        </Form.Item>

        <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item name="mobile" label="Mobile">
          <Input placeholder="Enter mobile number" addonBefore="+63" />
        </Form.Item>

        <Form.Item name="birthday" label="Birthday">
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update User
          </Button>
        </Form.Item>
      </Form>
    </AddUpdateUserModalStyled>
  );
}

export default EditUserModal;
