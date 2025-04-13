import React from 'react'
import NavbarStyled from "./Navbar.styles.jsx";
import {useNavigate} from "react-router-dom";
import {Button, Flex, Image} from "antd";
import denrLogo from "../../assets/images/denr.svg";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('identity');
    navigate('/');
  }
  return (
    <NavbarStyled>
      <Flex justify="space-between" align="center">
        <Image src={denrLogo} preview={false} />
        <Button type="primary" onClick={handleLogout}>Logout</Button>
      </Flex>
    </NavbarStyled>
  )
}

export default Navbar
