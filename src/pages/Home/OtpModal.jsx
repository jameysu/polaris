import React, { useState } from "react";
import { Button, message, Typography } from "antd";
import OtpModalStyled from "./OtpModal.styles.jsx";
import OtpInput from "react-otp-input";
import http from "../../utils/http.js";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const OtpModal = ({ visible, setVisible, loginResponse }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    const data = {
      otpJWT: loginResponse?.otpJWT,
      otp: otp,
    };

    try {
      setLoading(true);

      const response = await http.post("/auth/verify-otp", data);

      if (response.success) {
        messageApi.success("OTP verified!");

        setVisible(false);
        setOtp("");

        localStorage.setItem("identity", JSON.stringify(response.user));

        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Invalid OTP!");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OtpModalStyled
      open={visible}
      title="Enter OTP"
      footer={null}
      centered
      width={400}
      onCancel={() => setVisible(false)}
    >
      {contextHolder}

      <Text type="secondary">An OTP has been sent to your email.</Text>

      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        shouldAutoFocus
        containerStyle={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
        renderInput={(props) => (
          <input
            {...props}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              margin: "0 0.3rem",
              fontSize: "1.2rem",
              textAlign: "center",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
        )}
      />

      <Button
        type="primary"
        block
        loading={loading}
        disabled={otp.length !== 6}
        onClick={handleVerifyOtp}
      >
        Verify OTP
      </Button>

      <Button type="link" block disabled={loading}>
        Resend OTP
      </Button>
    </OtpModalStyled>
  );
};

export default OtpModal;
