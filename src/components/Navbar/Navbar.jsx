import React, { useEffect, useState } from 'react';
import NavbarStyled from "./Navbar.styles.jsx";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Spin,
  Typography,
  message
} from "antd";
import denrLogo from "../../assets/images/denr.svg";
import {
  BellOutlined,
  UserOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import http from "../../utils/http.js";
import dayjs from "dayjs";

const { Text } = Typography;

function Navbar() {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const identity = JSON.parse(localStorage.getItem("identity"));
  const userid = identity?.userJSON?.userid;

  const roleMap = {
    1: "ADMIN",
    2: "CLIENT",
    3: "RECEIVING/RELEASING CLERK",
    4: "CENR OFFICER",
    5: "CHIEF RPS",
    6: "DEPUTY CENR OFFICER",
    7: "INSPECTION TEAM RPS/TSD",
    8: "TECHNICAL STAFF CONCERNED"
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('auth');
      localStorage.removeItem('identity');
      navigate('/');
    }, 3000);
  };

  const fetchNotifications = async () => {
    if (!userid) return;
    try {
      setLoadingNotifications(true);
      const res = await http.get(`notification/${userid}`);
      setNotifications(res.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userid]);

  const renderNotifications = () => {
    if (loadingNotifications) return <Spin size="small" />;
    if (notifications.length === 0) return <Text type="secondary">No notifications.</Text>;

    return notifications.map((notif, index) => (
      <div
        key={notif.notificationno || index}
        style={{
          marginBottom: 8,
          backgroundColor: notif.status ? '#f5f5f5' : '#e6f7ff',
          padding: 8,
          borderRadius: 4
        }}
      >
        <Flex justify="space-between">
          <Text strong>{notif.title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(notif.createdAt).format('MMM D, YYYY hh:mm A')}
          </Text>
        </Flex>
        <div>{notif.message}</div>
        <Divider style={{ margin: '8px 0' }} />
      </div>
    ));
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        userid: identity.userJSON.userid,
        email: values.email,
        username: identity.userJSON.username,
        usertype: identity.userJSON.usertype,
        firstname: values.firstname,
        lastname: values.lastname,
        middlename: values.middlename,
        birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : null,
        mobile: values.mobile
      };

      const res = await http.put("/auth/user/update", payload);
      message.success("Account updated successfully!");
      setIsEditMode(false);
      setUserModalVisible(false);

      // Optionally update localStorage if email or userDetail changed
      const updatedIdentity = {
        ...identity,
        userJSON: {
          ...identity.userJSON,
          email: values.email
        },
        userDetail: {
          ...identity.userDetail,
          firstname: values.firstname,
          lastname: values.lastname,
          middlename: values.middlename,
          birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : null,
          mobile: values.mobile
        }
      };
      localStorage.setItem("identity", JSON.stringify(updatedIdentity));
    } catch (err) {
      console.error("Failed to update user", err);
      message.error("Failed to update account.");
    }
  };

  const userPopoverContent = (
    <Flex
      vertical
      gap="small"
      style={{
        minWidth: 150,
        minHeight: 100,
        padding: 8
      }}
    >
      <Flex align={'center'} gap="small">
        <Avatar size="large" icon={<UserOutlined />} onClick={() => setUserModalVisible(true)} />
        <div>
          <div style={{ fontWeight: 500 }}>
            {identity.userDetail.firstname} {identity.userDetail.lastname}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {roleMap[identity.userJSON.usertype]}
          </div>
        </div>
      </Flex>
      <Divider style={{ margin: "10px" }} />
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
          setIsEditMode(false);
        }}
      >
        {isEditMode ? (
          <Form
            layout="vertical"
            initialValues={{
              firstname: identity.userDetail.firstname,
              lastname: identity.userDetail.lastname,
              middlename: identity.userDetail.middlename,
              email: identity.userJSON.email,
              mobile: identity.userDetail.mobile,
              birthday: identity.userDetail.birthday ? dayjs(identity.userDetail.birthday) : null,
            }}
            onFinish={handleFormSubmit}
          >
            <Form.Item label="First Name" name="firstname" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Middle Name" name="middlename">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: 'email', required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Birthday" name="birthday">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
            <p><strong>Role:</strong> {roleMap[identity.userJSON.usertype]}</p>
            <Button type="primary" onClick={() => setIsEditMode(true)}>Edit Account</Button>
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
            <Popover
              trigger="click"
              title="Notifications"
              placement="bottomRight"
              content={
                <div style={{ maxWidth: 300, maxHeight: 300, overflowY: 'auto' }}>
                  {renderNotifications()}
                </div>
              }
            >
              <Badge dot={notifications.some(n => n.status === false)}>
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
      </NavbarStyled>
    </>
  );
}

export default Navbar;
