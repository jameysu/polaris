import React, {useEffect, useState} from 'react';
import HomeStyled from './Home.styles.jsx';
import {Button, Modal, Form, Input, Typography, Divider, Image, Tabs, Flex, message, DatePicker} from 'antd';
import denrLogo from '../../assets/images/denr.svg';
import { Link, useNavigate } from 'react-router-dom';
import http from "../../utils/http.js";
import OtpModal from "./OtpModal.jsx";

const { Text } = Typography;
const { TabPane } = Tabs;

function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [signinForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  console.log(signinForm.getFieldsValue());
  console.log(signupForm?.getFieldsValue());

  const [loading, setLoading] = useState(false);
  const [signinModalVisible, setSigninModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [loginResponse, setLoginResponse] = useState({});
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    if (token) {
      navigate('/dashboard');
    }
  }, [
    navigate,
  ])

  const onSignup = (values) => {
    console.log('Form values:', values);
  };

  const onCloseModal = () => {
    setSigninModalVisible(false);
    signinForm.resetFields();
    signupForm?.resetFields();
  }

  const onSignin = async (values) => {
    setLoading(true);
    try {
      const response = await http.post('/auth/login', values);
      setLoginResponse(response);
      console.log(response);
      if(response.success) {
        messageApi.success({content: 'OTP sent successfully!', key: 'otp-sent', duration: 3});
        setOtpModalVisible(true);
        setSigninModalVisible(false);
      }

    } catch (error) {
      console.log(error);
      message.error('Login failed: ' + (error.response?.data.message || error.message));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <HomeStyled>
      <Image src={denrLogo} preview={false} />
      <Flex vertical justify="center" align="center" gap="middle">
        <Text className="ph-text">Republic of the Philippines</Text>
        <Text className="denr-cenro-text">
          DENR CENRO ONLINE APPLICATION AND DOCUMENT TRACKING SYSTEM
        </Text>
        <Text className="other-text">ENVIRONMENTAL MANAGEMENT BUREAU</Text>
        <Text className="other-text">
          DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES
        </Text>
        <Button
          type="primary"
          className="continue-btn"
          onClick={() => setSigninModalVisible(true)}
        >
          Continue
        </Button>
      </Flex>

      {/* Signin Modal */}
      <Modal
        title="Signin / Signup"
        open={signinModalVisible}
        onCancel={onCloseModal}
        footer={null} // Remove default footer
        width={400}
        centered
        maskClosable={false}
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Signin" key="signin">
            <Form
              form={signinForm}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onSignin}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>

              <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                Sign In
              </Button>
            </Form>
          </TabPane>

          <TabPane tab="Signup" key="signup">
            <Form
              form={signupForm}
              onFinish={onSignup}
            >
              <Form.Item
                name="firstname"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>

              <Form.Item
                name="lastname"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>

              <Form.Item
                name="middlename"
              >
                <Input placeholder="Enter Middle name!" />
              </Form.Item>

              <Flex gap="middle">
                <Form.Item
                  name="birthdate"
                >
                  <DatePicker placeholder="Date of Birth" />
                </Form.Item>

                <Form.Item
                  name="phonenumber"
                  rules={[{ required: true, message: 'Please input your mobile number!' }]}
                >
                  <Input addonBefore='+63' placeholder="Enter your Mobile Number" />
                </Form.Item>
              </Flex>

              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder="Enter Username" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input id='newEmail' placeholder="Enter Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password id='newPassword' placeholder="Enter Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('The two passwords that you entered do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Sign Up
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
      {contextHolder}
      <OtpModal
        visible={otpModalVisible}
        setVisible={setOtpModalVisible}
        loginResponse={loginResponse}
      />
    </HomeStyled>
  );
}

export default Home;
