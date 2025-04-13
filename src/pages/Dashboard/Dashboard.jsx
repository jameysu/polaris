import React, { useState } from 'react';
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import DashboardStyled from "./Dashboard.styles.jsx";
import Home from "./Home/Home.jsx";
import Summary from "./Summary/Summary.jsx";
import Notifications from "./Notifications/Notifications.jsx";
import Account from "./Account/Account.jsx";
import About from "./About/About.jsx";

function Dashboard() {
  const [selectedKey, setSelectedKey] = useState('1');

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Home />;
      case '2':
        return <Summary />;
      case '3':
        return <Notifications />;
      case '4':
        return <Account />;
      case '5':
        return <About />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <DashboardStyled>
      <Navbar />
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar onMenuSelect={setSelectedKey} />
        <div style={{ flex: 1, padding: 24 }}>
          {renderContent()}
        </div>
      </div>
    </DashboardStyled>
  );
}

export default Dashboard;
