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
      <Modal
        open={createTransactionModalVisible}
        onCancel={() => setCreateTransactionModalVisible(false)}
        footer={
          <Flex justify="space-between">
            <Button onClick={() => setCreateTransactionModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => console.log("Next clicked")}>
              Next
            </Button>
          </Flex>
        }
      >
       <Flex vertical gap={'small'}>
         <Text>What is the purpose of your transaction?</Text>
         <Select
           defaultValue="1"
           options={[
             {
               value: '1',
               label: 'Get Permit for Issuance of Certificate of Verification (COV) for the Transport of Planted Trees Within Private Land, Non-Timber Forest Products except Rattan and Bamboo.'
             },
             {
               value: '2',
               label: 'Application of Chansaw Registration'
             },
             {
               value: '3',
               label: 'Issuance of Special/Tree Cutting and/or Earth Balling permit for Trees Affected by Projects of National Government Agencies (DPWH, DOTr, DepEd, DA, DOH, CHED, DOA, and NIA)'
             },
           ]}
         />
         <Text>Requirements:</Text>
       </Flex>
      </Modal>
    </DashboardStyled>
  );
}

export default Dashboard;
