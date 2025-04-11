import React, { useState } from 'react';
import { Button, message, Typography } from 'antd';
import OtpModalStyled from './OtpModal.styles.jsx';
import OtpInput from 'react-otp-input';

const { Text } = Typography;

const OtpModal = ({ visible, setVisible }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <OtpModalStyled
      open={visible}
      title="Enter OTP"
      onCancel={() => setVisible(false)}
      footer={null}
      width={400}
      centered
    >
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
        <Button type="primary" loading={loading} block>
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
