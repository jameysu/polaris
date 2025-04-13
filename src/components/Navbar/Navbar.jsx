import React, {useState} from 'react'
import NavbarStyled from "./Navbar.styles.jsx";
import {useNavigate} from "react-router-dom";
import {Avatar, Badge, Button, Divider, Flex, Image, Popconfirm, Popover, Spin} from "antd";
import denrLogo from "../../assets/images/denr.svg";
import {BellOutlined, UserOutlined, LoadingOutlined} from "@ant-design/icons";

function Navbar() {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

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
        <Avatar size="large" icon={<UserOutlined />}/>
        <span style={{ fontWeight: 500 }}>John doe</span>
      </Flex>
      <Divider style={{ margin: "10px" }}/>
      <Button type="primary" danger size="small" onClick={handleLogout}>
        Logout
      </Button>
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
      </NavbarStyled>
    </>
  );
}

export default Navbar;