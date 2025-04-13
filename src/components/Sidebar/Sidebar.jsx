import React from 'react';
import { AppstoreOutlined, HomeOutlined, SettingOutlined, BellOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
  {
    key: '1',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: '2',
    label: 'Summary',
    icon: <AppstoreOutlined />,
  },
  {
    key: '3',
    label: 'Notifications',
    icon: <BellOutlined />,
  },
  {
    key: '4',
    label: 'Account',
    icon: <UserOutlined />,
  },
  {
    key: '5',
    label: 'About',
    icon: <InfoCircleOutlined />,
  },
];

const Sidebar = ({ onMenuSelect }) => {
  const onClick = e => {
    onMenuSelect(e.key); // pass selected key to parent
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256, height: '100%' }}
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
