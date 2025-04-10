import React, {useEffect, useState} from 'react';
import HomeStyled from './Home.styles.jsx';
import {Button, Modal, Form, Input, Typography, Divider, Image, Tabs, Flex, message} from 'antd';
import denrLogo from '../../assets/images/denr.svg';
import { Link, useNavigate } from 'react-router-dom';
import http from "../../utils/http.js";

const { Text } = Typography;
const { TabPane } = Tabs;

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signinModalVisible, setSigninModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    const token = localStorage.getItem('auth');
    if (token) {
      navigate('/dashboard');
    }
  }, [
    navigate,
  ])

  const onFinish = (values) => {
    console.log('Form values:', values);
    setSigninModalVisible(false);
  };

  const onSignin = async (values) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      const response = await http.post('/auth/login', values);
      console.log('response', response);
      const { token, data } = response;

      localStorage.setItem('auth', token);
      localStorage.setItem('identity', JSON.stringify(data));

      message.success('Login successful');
      navigate('/dashboard');
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
        onCancel={() => setSigninModalVisible(false)}
        footer={null} // Remove default footer
        width={400}
        centered
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Signin" key="signin">
            <Form
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
              onFinish={onFinish}
            >
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
                <Input placeholder="Enter Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder="Enter Password" />
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
    </HomeStyled>
  );
}

export default Home;
