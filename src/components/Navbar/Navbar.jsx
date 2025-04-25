import React, {use, useState} from 'react'
import NavbarStyled from "./Navbar.styles.jsx";
import {useNavigate} from "react-router-dom";
import {Avatar, Badge, Button, Divider, Flex, Form, Image, Input, Modal, Popconfirm, Popover, Spin} from "antd";
import denrLogo from "../../assets/images/denr.svg";
import {BellOutlined, UserOutlined, LoadingOutlined} from "@ant-design/icons";

function Navbar() {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const identity = JSON.parse(localStorage.getItem("identity"));

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('auth');
      localStorage.removeItem('identity');
      navigate('/');
    }, 3000)
  }

  const userPopoverContent = (
    <Flex
      vertical
      gap="small"
      style={{
        minWidth: 150,   // set your desired width
        minHeight: 100,  // set your desired height
        padding: 8
      }}
    >
      <Flex align={'center'} gap="small">
        <Avatar size="large" icon={<UserOutlined />} onClick={() => setUserModalVisible(true)} />
        <span style={{ fontWeight: 500 }}>{identity.userDetail.firstname} {identity.userDetail.lastname}</span>
      </Flex>
      <Divider style={{ margin: "10px" }}/>
      <Button type="primary" danger size="small" onClick={handleLogout}>
        Logout
      </Button>
      <Modal
        open={userModalVisible}
        title={isEditMode ? "Edit Account" : "My Account"}
        centered
        footer={null}
        onCancel={() => {
          setUserModalVisible(false);
          setIsEditMode(false); // Reset to view mode on close
        }}
      >
        {isEditMode ? (
          <Form
            layout="vertical"
            initialValues={{
              firstname: identity.userDetail.firstname,
              lastname: identity.userDetail.lastname,
              email: identity.userJSON.email,
              mobile: identity.userDetail.mobile,
            }}
            onFinish={(values) => {
              console.log('Updated values:', values);
              // TODO: Call API to update user details
              setIsEditMode(false);
              setUserModalVisible(false);
              // Optional: update localStorage here
            }}
          >
            <Form.Item
              label="First Name"
              name="firstname"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastname"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mobile"
              name="mobile"
              rules={[{ required: true, message: 'Please enter your mobile number' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between">
                <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Save</Button>
              </Flex>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <p><strong>Name:</strong> {identity.userDetail.firstname} {identity.userDetail.lastname}</p>
            <p><strong>Email:</strong> {identity.userJSON.email}</p>
            <p><strong>Mobile:</strong> {identity.userDetail.mobile}</p>
            <Button type="primary" onClick={() => setIsEditMode(true)}>
              Edit Account
            </Button>
          </div>
        )}
      </Modal>

    </Flex>
  );

  return (
    <>
      {loggingOut && (
        <div
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spin indicator={<LoadingOutlined spin />} size="large" tip="Logging out..." />
        </div>
      )}

      <NavbarStyled>
        <Flex justify="space-between" align="center">
          <Image src={denrLogo} preview={false} />
          <Flex justify="end" align="center" gap="middle">
            <Popover trigger="click" title="Notifications">
              <Badge dot>
                <Avatar size="large" icon={<BellOutlined />} />
              </Badge>
            </Popover>
            <Popover
              trigger="click"
              content={userPopoverContent}
              placement="bottomRight"
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </Popover>
          </Flex>
        </Flex>
        <Modal
          open={userModalVisible}
          centered
          footer={null}
          onCancel={() => setUserModalVisible(false)}
        >
          hello
        </Modal>
      </NavbarStyled>
    </>
  );
}

export default Navbar;