import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import DashboardStyled from "./Dashboard.styles.jsx";
import Home from "./Home/Home.jsx";
import About from "./About/About.jsx";
import SetApplicationModal from "./SetApplicationModal.jsx";
import Application from "./Application/Application.jsx";
import User from "./User/User.jsx";

function Dashboard() {
  const [createTransactionModalVisible, setCreateTransactionModalVisible] = useState(false);

  const identity = JSON.parse(localStorage.getItem("identity"));

  return (
    <DashboardStyled>
      <Navbar />
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar
          setCreateTransactionModalVisible={setCreateTransactionModalVisible}
          identity={identity}
        />
        <div style={{ flex: 1, padding: '5px'}}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/application" element={<Application />} />
            {identity.userJSON.usertype === 1 && (
              <Route path="/user" element={<User />} />
            )}
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
      <SetApplicationModal
        visible={createTransactionModalVisible}
        setVisible={setCreateTransactionModalVisible}
      />
    </DashboardStyled>
  );
}

export default Dashboard;
