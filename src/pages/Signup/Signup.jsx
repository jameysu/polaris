import React from 'react'
import {Button, Form, Input, Typography} from "antd";
import SignupStyled from "./Signup.styles.jsx";
const {Title} = Typography;

function Signup() {
  return (
    <SignupStyled>
      <Form
        layout="vertical"
      >
        <Title level={3}>Create DENR/CENRO Account</Title>
        <Form.Item
          label='First Name'
          name='firstname'
        >
          <Input placeholder='e.g. Juan'/>
        </Form.Item>
        <Form.Item
          label='Last Name'
          name='lastname'
        >
          <Input placeholder='e.g. Dela Cruz'/>
        </Form.Item>
        <Form.Item
          label='Middle Name(Optional)'
          name='middlename'
        >
          <Input placeholder='e.g. Dela Cruz'/>
        </Form.Item>
        <Form.Item
          label='Username'
          name='username'
        >
          <Input placeholder='Username'/>
        </Form.Item>
        <Form.Item
          label='Email Address'
          name='email'
        >
          <Input placeholder='juan.delacruz@email.com'/>
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
        >
          <Input.Password placeholder='********'/>
        </Form.Item>
        <Form.Item
          label='Confirm Password'
          name='confirmPassword'
        >
          <Input.Password placeholder='********'/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>Signup</Button>
      </Form>
    </SignupStyled>
  )
}

export default Signup
