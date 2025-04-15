import React, { useState } from 'react';
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import DashboardStyled from "./Dashboard.styles.jsx";
import Home from "./Home/Home.jsx";
import User from "./User/User.jsx";
import About from "./About/About.jsx";
import Pendings from "./Pendings/Pendings.jsx";
import ViewDocument from "./ViewDocuments/ViewDocument.jsx";
import {Button, Flex, Modal, Select, Typography} from "antd";
import SetApplicationModal from "./SetApplicationModal.jsx";

const {Text} = Typography;

function Dashboard() {
  const [selectedKey, setSelectedKey] = useState('1');
  const [createTransactionModalVisible, setCreateTransactionModalVisible] = useState(false);

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <Home />;
      case 'pendings':
        return <Pendings />;
      case 'view-document':
        return <ViewDocument />;
      case 'user':
        return <User />;
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <DashboardStyled>
      <Navbar />
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar
          onMenuSelect={setSelectedKey}
          setCreateTransactionModalVisible={setCreateTransactionModalVisible}
        />
        <div style={{ flex: 1}}>
          {renderContent()}
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
