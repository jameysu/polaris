import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Spin,
  Alert,
  Button,
  Popconfirm,
  Space,
  Input, message as antdMessage,
} from 'antd';
import http from '../../../utils/http'; // Adjust the path if necessary
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

function User() {

  const [message, contextHolder] = antdMessage.useMessage();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false); // Optional: loading state during deletion
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [editUserVisible, setEditUserVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await http.get('/auth/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userid) => {
    setDeleting(true);
    try {
      await http.delete('/auth/user/remove', {
        data: { userid },
      });
      message.success('User removed successfully');
      setTimeout(() => fetchUsers(), 2000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete user';
      message.error(errMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lower = value.toLowerCase();
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setEditUserVisible(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'User Type',
      dataIndex: 'usertype',
      key: 'usertype',
    },
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_, record) => {
        const detail = record.UserDetail || {};
        return `${detail.firstname || ''} ${detail.middlename || ''} ${detail.lastname || ''}`.trim();
      },
    },
    {
      title: 'Birthday',
      key: 'birthday',
      render: (_, record) => {
        const birthday = record.UserDetail?.birthday;
        return birthday ? dayjs(birthday).format('MMMM D, YYYY') : '';
      },
    },
    {
      title: 'Mobile',
      dataIndex: ['UserDetail', 'mobile'],
      key: 'mobile',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.userid)}
            okText="Yes"
            cancelText="No"
            disabled={deleting}
          >
            <Button danger type="primary" loading={deleting}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin tip="Loading users..." style={{ marginTop: 50 }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div>
      {contextHolder}
      <Title level={2}>User List</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by username or email"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ width: 400 }}
        />
        <Button type="primary" onClick={() => setAddUserVisible(true)}>
          Add User
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="userid"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <AddUserModal
        visible={addUserVisible}
        setVisible={setAddUserVisible}
        onSuccess={fetchUsers}
      />
      <EditUserModal
        visible={editUserVisible}
        setVisible={setEditUserVisible}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}

export default User;
