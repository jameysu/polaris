import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import http from '../../../utils/http';
import AddUpdateUserModalStyled from "./AddUpdateUserModal.styles.jsx";

const { Option } = Select;

function EditUserModal({ visible, setVisible, user, onSuccess }) {
  const [form] = Form.useForm();

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
      await http.put(`/auth/users/${user.userid}`, {
        username: values.username,
        email: values.email,
        usertype: values.usertype,
        UserDetail: {
          firstname: values.firstname,
          middlename: values.middlename,
          lastname: values.lastname,
          mobile: values.mobile,
          birthday: values.birthday?.format('YYYY-MM-DD') || null,
        },
      });
      message.success('User updated successfully');
      setVisible(false);
      onSuccess(); // refresh list
    } catch (err) {
      message.error('Failed to update user');
    }
  };

  return (
    <AddUpdateUserModalStyled
      open={visible}
      title="Edit User"
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="usertype" label="User Type" rules={[{ required: true }]}>
          <Select>
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
        <Form.Item name="firstname" label="First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="middlename" label="Middle Name">
          <Input />
        </Form.Item>
        <Form.Item name="lastname" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item name="birthday" label="Birthday">
          <DatePicker style={{ width: '100%' }} />
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