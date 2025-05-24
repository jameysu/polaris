import React from 'react';
import {
  AppstoreOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ setCreateTransactionModalVisible, identity }) => {
  const location = useLocation();

  const items = [
    ...(identity.userJSON.usertype === 1 || identity.userJSON.usertype === 2
      ? [
        {
          key: 'create-application',
          style: { padding: 0, marginTop: 0 },
          label: (
            <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              style={{ textAlign: 'left' }}
              onClick={() => setCreateTransactionModalVisible(true)}
            >
              Set Application
            </Button>
          ),
        },
      ]
      : []),
    {
      key: 'home',
      label: <Link to="/dashboard/home">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: 'application',
      label: <Link to="/dashboard/application">Application</Link>,
      icon: <AppstoreOutlined />,
    },
    ...(identity.userJSON.usertype === 1
      ? [
        {
          key: 'user',
          label: <Link to="/dashboard/user">User</Link>,
          icon: <UserOutlined />,
        },
      ]
      : []),
    {
      key: 'about',
      label: <Link to="/dashboard/about">About</Link>,
      icon: <InfoCircleOutlined />,
    },
  ];

  return (
    <Menu
      selectedKeys={[location.pathname.replace("/", "") || 'home']}
      style={{ width: 256, height: '100%' }}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
