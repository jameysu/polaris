import React, { useEffect, useState } from "react";
import HomeStyled from "./Home.styles.jsx";
import {
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Divider,
  Image,
  Tabs,
  Flex,
  message,
  DatePicker,
  Spin,
} from "antd";
import denrLogo from "../../assets/images/denr.svg";
import { Link, useNavigate } from "react-router-dom";
import http from "../../utils/http.js";
import OtpModal from "./OtpModal.jsx";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { TabPane } = Tabs;

function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [signinForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signinModalVisible, setSigninModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [loginResponse, setLoginResponse] = useState({});
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [signupResponse, setSignupResponse] = useState({});
  const [loggingIn, setLoggingIn] = useState(false);

  const [searchApplicationStatus, setSearchApplicationStatus] = useState(false);
  const [applicationStatusModalVisible, setApplicationStatusModalVisible] =
    useState(false);
  const [application, setApplication] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onCloseModal = () => {
    setSigninModalVisible(false);
    signinForm.resetFields();
    signupForm?.resetFields();
  };

  const onSignin = async (values) => {
    setLoginLoading(true);
    try {
      const response = await http.post("/auth/login", values);
      if (response.success) {
        messageApi.success({
          content: "Login Successful!",
          key: "otp-sent",
          duration: 3,
        });
        localStorage.setItem("identity", JSON.stringify(response));
        localStorage.setItem("auth", response?.token);
        // setOtpModalVisible(true);
        setSigninModalVisible(false);
        setTimeout(() => {
          setLoggingIn(true);
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Login failed, email and password do not match!");
    } finally {
      setLoginLoading(false);
    }
  };

  // const onSignup = async (values) => {
  //   setSignupLoading(true);
  //   try {
  //     const response = await http.post("/auth/signup", values);
  //     setSignupResponse(response);
  //     if (response.success) {
  //       messageApi.success({
  //         content: "Sign Up successful!",
  //         key: "signup-success",
  //         duration: 3,
  //       });
  //       setSigninModalVisible(false);
  //       signupForm.resetFields();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     messageApi.error(
  //       "Sign Up failed: " + (error.response?.data.message || error.message)
  //     );
  //   } finally {
  //     setSignupLoading(false);
  //   }
  // };

  const onSignup = async (values) => {
    setSignupLoading(true);
    try {
      const response = await http.post("/auth/signup", values);
      console.log("response", response);
      setLoginResponse(response);

      if (response.success) {
        messageApi.success("Signup successful! OTP sent to your email.");

        setOtpModalVisible(response);
        setOtpModalVisible(true);
        setSigninModalVisible(false);
        signupForm.resetFields();
      }
    } catch (error) {
      messageApi.error(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const onSearchApplication = async (value) => {
    setSearchApplicationStatus(true);
    try {
      const response = await http.get(`/application/request/${value}`);
      if (response.success) {
        messageApi.success({
          content: "Application found!",
          key: "search-application-success",
          duration: 3,
        });
        let applicationStatus;
        switch (response.applicationstatus) {
          case 1:
            applicationStatus = "PENDING";
            break;
          case 2:
            applicationStatus = "APPROVED";
            break;
          case 4:
            applicationStatus = "REJECTED";
            break;
          default:
            break;
        }
        setApplication(applicationStatus);
        setApplicationStatusModalVisible(true);
      }
    } catch (error) {
      console.log(error);
      messageApi.error({
        content: "Application not found!",
        key: "search-application-success",
        duration: 3,
      });
    } finally {
      setSearchApplicationStatus(false);
    }
  };

  return (
    <>
      {loggingIn && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            tip="Signing in..."
          />
        </div>
      )}
      <HomeStyled>
        <div
          style={{
            position: "absolute",
            display: "flex",
            height: "fit-content",
            width: "fit-content",
            top: "60px",
            right: "100px",
            bottom: 0,
          }}
        >
          {/*<Button*/}
          {/*  // type="primary"*/}
          {/*  style={{background: 'transparent', border: 'none'}}*/}
          {/*  className="continue-btn"*/}
          {/*  onClick={() => setSigninModalVisible(true)}*/}
          {/*  loading={loginLoading}*/}
          {/*>*/}
          {/*  <Text style={{color: 'white', fontSize:'25px', fontWeight: '500'}}>Sign In or Sign Up</Text>*/}
          {/*</Button>*/}
          <Button
            style={{
              height: "60px",
              backgroundColor: "rgba(255, 255, 255, 0.15)", // subtle translucent background
              border: "none", // soft border
              borderRadius: "8px",
              padding: "8px 20px",
              backdropFilter: "blur(0px)", // modern glass effect
              WebkitBackdropFilter: "blur(0px)",
              transition: "all 0.3s ease",
            }}
            className="continue-btn"
            onClick={() => setSigninModalVisible(true)}
            loading={loginLoading}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.15)")
            }
          >
            <Text
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: "500",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
              }}
            >
              Sign In or Sign Up
            </Text>
          </Button>
        </div>
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
          <div
            style={{
              width: "100%",
              height: "50px",
              display: "flex",
              gap: "20px",
            }}
          >
            <Input
              placeholder="Enter Application Number"
              onChange={(e) => setApplicationNumber(e.target.value)}
              value={applicationNumber}
            />
            <Button
              type={"primary"}
              style={{ width: "200px", height: "50px" }}
              onClick={(e) => {
                if (applicationNumber.length <= 1) {
                  messageApi.error("Please enter an application number!");
                  e.preventDefault();
                } else {
                  onSearchApplication(applicationNumber);
                }
              }}
            >
              <SearchOutlined />
              Track
            </Button>
          </div>
        </Flex>

        {/* Signin Modal */}
        <Modal
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
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password placeholder="********" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loginLoading}
                >
                  Sign In
                </Button>
              </Form>
            </TabPane>

            <TabPane tab="Signup" key="signup">
              <Form form={signupForm} onFinish={onSignup} autoComplete="off">
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter First Name" />
                </Form.Item>

                <Form.Item
                  name="lastname"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input placeholder="Enter Last Name" />
                </Form.Item>

                <Form.Item name="middlename">
                  <Input placeholder="Enter Middle name" />
                </Form.Item>

                <Flex gap="middle">
                  <Form.Item name="birthday">
                    <DatePicker
                      placeholder="Date of Birth"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>

                  <Form.Item
                    name="mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please input your mobile number!",
                      },
                    ]}
                  >
                    <Input
                      addonBefore="+63"
                      placeholder="Enter your Mobile Number"
                    />
                  </Form.Item>
                </Flex>

                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input placeholder="Enter Username" />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input id="newEmail" placeholder="Enter Email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    id="newPassword"
                    placeholder="Enter Password"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={signupLoading}
                  style={{ width: "100%" }}
                >
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
          setLoggingIn={setLoggingIn}
        />
        <Modal
          open={applicationStatusModalVisible}
          onCancel={() => setApplicationStatusModalVisible(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={() => setApplicationStatusModalVisible(false)}
            >
              OK
            </Button>,
          ]}
          centered
          maskClosable={false}
          closable={true}
          title="Application Status"
        >
          <Flex vertical align="center" gap="small">
            <Text>Your application number:</Text>
            <Text strong>{applicationNumber}</Text>
            <Divider />
            <Text>Status:</Text>
            {application === "APPROVED" && (
              <Text type="success" strong style={{ fontSize: 18 }}>
                ✅ Approved
              </Text>
            )}
            {application === "REJECTED" && (
              <Text type="danger" strong style={{ fontSize: 18 }}>
                ❌ Rejected
              </Text>
            )}
            {application === "PENDING" && (
              <Text strong style={{ fontSize: 18 }}>
                ⏳ Pending
              </Text>
            )}
            <Divider />
            <Text type="secondary">
              {application === "APPROVED" &&
                "You may proceed with the next steps as instructed."}
              {application === "REJECTED" &&
                "Please contact support for more information."}
              {application === "PENDING" &&
                "Please wait while your application is being reviewed."}
            </Text>
          </Flex>
        </Modal>
      </HomeStyled>
    </>
  );
}

export default Home;
