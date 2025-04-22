import React, { useState } from 'react';
import { Button, message, Typography } from 'antd';
import OtpModalStyled from './OtpModal.styles.jsx';
import OtpInput from 'react-otp-input';
import http from "../../utils/http.js";
import {useNavigate} from "react-router-dom";

const { Text } = Typography;

const OtpModal = ({ visible, setVisible, loginResponse, setLoggingIn }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);

  const handleVerifyOtp = async () => {
    const data = {
      otpJWT: loginResponse?.otpJWT,
      otp: parseInt(otp),
    }
    try {
      setLoading(true);
      const response = await http.post('/auth/verify-login', data);
      console.log(response);
      if(response.success) {
        messageApi.success({content: 'OTP verified!', key: 'otp-verified', duration: 3})
        setVisible(false);
        setOtp('');
        localStorage.setItem('identity', JSON.stringify(response));
        localStorage.setItem('auth', loginResponse?.otpJWT);
        setTimeout(() => {
          setLoggingIn(true);
          navigate('/dashboard');
        }, 3000)
      }
    } catch (error) {
      console.log(error);
      messageApi.error({content: 'Invalid otp!', key: 'otp-verify-failed', duration: 3})
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <OtpModalStyled
      open={visible}
      title="Enter OTP"
      onCancel={() => setVisible(false)}
      footer={null}
      width={400}
      centered
    >
      {contextHolder}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Text type="secondary">
          An OTP has been sent to your email
        </Text>
        <OtpInput
          containerStyle={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          shouldAutoFocus
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                margin: '0 0.3rem',
                fontSize: '1rem',
                textAlign: 'center',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
          )}
        />
        <Button
          type="primary"
          loading={loading}
          block
          disabled={loading || otp.length !== 6}
          onClick={() => handleVerifyOtp(otp)}
        >
          Verify OTP
        </Button>
        <Button type="link">
          Resend OTP
        </Button>
      </div>
    </OtpModalStyled>
  );
};

export default OtpModal;
