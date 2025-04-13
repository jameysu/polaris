import React from 'react'
import Navbar from "../../components/Navbar/Navbar.jsx";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('identity');
    navigate('/');
  }
  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Dashboard
