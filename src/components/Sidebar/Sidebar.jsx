import React from 'react';
import { AppstoreOutlined, HomeOutlined, PlusOutlined, BellOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {Button, Menu} from 'antd';

const items = [
  {
    key: 'create-application',
    style: {padding: 0, marginTop: 0},
    label: (
      <Button type="primary" block icon={<PlusOutlined />} style={{ textAlign: 'left'}}>
        Set Application
      </Button>
    ),
  },
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: 'summary',
    label: 'Summary',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'pendings', label: 'Pendings' },
      { key: 'view-document', label: 'View Document' },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    icon: <UserOutlined />,
    children: [
      { key: 'user', label: 'User' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    icon: <InfoCircleOutlined />,
  },
];

const Sidebar = ({ onMenuSelect, setCreateTransactionModalVisible }) => {
  const onClick = e => {
    const { key } = e;
    if (key === 'create-application') {
      setCreateTransactionModalVisible(true);
      return;
    }
    onMenuSelect(key);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256, height: '100%' }}
      defaultSelectedKeys={['home']}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
