import React from 'react'
import SigninStyled from "./Signin.styles.jsx";
import {Button, Divider, Form, Image, Input, Typography} from "antd";
import denrLogo from "../../assets/images/denr.svg";
import {Link} from "react-router-dom";

const {Text} = Typography;
function Signin() {

  const onFinish = values => {
    console.log('Success:', values);
  };

  return (
    <SigninStyled>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Image src={denrLogo} preview={false}/>
        <Form.Item
          label='Username'
          name='username'
        >
          <Input placeholder='Username'/>
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
        >
          <Input.Password placeholder='********'/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>Login</Button>
        <Divider />
        <Link to='/signup'>Create an account</Link>
      </Form>
    </SigninStyled>
  )
}

export default Signin
      