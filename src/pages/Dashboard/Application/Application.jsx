import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Tag,
  message,
  Button,
  Space,
  Popconfirm,
  Modal,
  Descriptions,
  List,
  Select,
} from 'antd';
import http from '../../../utils/http.js';

const { Title } = Typography;
const { Option } = Select;

const transactionTypes = {
  1: 'RO-F-03a - Permit for COV (Transport of Planted Trees)',
  2: 'RO-F-04 - Chainsaw Registration',
  3: 'RO-F-05 - Tree Cutting Permit (Govt Projects)',
};

const personnelOptions = [
  { label: 'RECEIVING/RELEASING CLERK', value: 3 },
  { label: 'CENR OFFICER', value: 4 },
  { label: 'CHIEF RPS', value: 5 },
  { label: 'DEPUTY CENR OFFICER', value: 6 },
  { label: 'INSPECTION TEAM RPS/TSD', value: 7 },
  { label: 'TECHNICAL STAFF CONCERNED', value: 8 },
];

function Application() {
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewDocumentsModalVisible, setViewDocumentsModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [newAssignee, setNewAssignee] = useState(null);
  const [selectedPersonnelType, setSelectedPersonnelType] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  console.log("availableUsers", availableUsers)

  const identity = JSON.parse(localStorage.getItem('identity'));

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        let response;
        if (identity.userJSON.usertype === 2) {
          response = await http.get(`/applications/request/${identity.userDetail.userid}`);
        } else {
          response = await http.get(`/application/request-search`);
        }
        setApplications(response.applications);
      } catch (error) {
        message.error('Failed to fetch applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!applications) {
      fetchApplications();
    }
  }, [applications, identity]);

  const updateApplicationStatus = async (applicationNo, status) => {
    try {
      await http.patch(`/application/${applicationNo}/status`, { applicationstatus: status });
      message.success('Application status updated successfully');
      setApplications(null);
      setModalVisible(false);
    } catch {
      message.error('Failed to update application status');
    }
  };

  const handleViewDocuments = async (applicationNo) => {
    try {
      const response = await http.get(`/application/documents/${applicationNo}`);
      setDocuments(response.documents || []);
      setViewDocumentsModalVisible(true);
    } catch {
      message.error('Failed to fetch documents');
    }
  };

  const openManageModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const openAssignModal = (record) => {
    setSelectedRecord(record);
    setSelectedPersonnelType(null);
    setAvailableUsers([]);
    setNewAssignee(null);
    setAssignModalVisible(true);
  };

  const fetchUsersByType = async (type) => {
    try {
      const response = await http.get('/auth/users-by-usertype', {
        params: { usertype: type },
      });
      setAvailableUsers(response.data);
    } catch {
      message.error('Failed to fetch users');
    }
  };

  const handleAssigneeChange = async () => {
    if (!newAssignee) return message.warning('Please select an assignee');

    try {
      await http.patch(`/application/assign-personnel`, {
        applicationno: selectedRecord.applicationno,
        userid: newAssignee,
      });
      message.success('Assignee updated successfully');
      setApplications(null);
      setAssignModalVisible(false);
    } catch {
      message.error('Failed to update assignee');
    }
  };

  const columns = [
    {
      title: 'Application No',
      dataIndex: 'applicationno',
      key: 'applicationno',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'applicationtype',
      key: 'applicationtype',
      render: (type) => <Tag color="green">{transactionTypes[type] || 'Unknown'}</Tag>,
    },
    {
      title: 'Application Status',
      dataIndex: 'applicationstatus',
      key: 'applicationstatus',
      render: (status) => {
        switch (status) {
          case 1: return <Tag color="blue">PENDING</Tag>;
          case 2: return <Tag color="green">APPROVED</Tag>;
          case 3: return <Tag color="orange">WITH PENDING REQUIREMENTS</Tag>;
          case 4: return <Tag color="red">REJECTED</Tag>;
          default: return null;
        }
      },
    },
  ];

  if (identity.userJSON.usertype === 1) {
    columns.push({
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openManageModal(record)}>Manage</Button>
          <Button type="link" onClick={() => openAssignModal(record)}>Assign</Button>
        </Space>
      ),
    });
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Applications</Title>
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="applicationno"
        loading={loading}
      />

      {/* Manage Modal */}
      {selectedRecord && (
        <Modal
          open={modalVisible}
          title="Manage Application"
          onCancel={() => setModalVisible(false)}
          footer={null}
          centered
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Application No">{selectedRecord.applicationno}</Descriptions.Item>
            <Descriptions.Item label="Name">{selectedRecord.firstname} {selectedRecord.lastname}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedRecord.email}</Descriptions.Item>
            <Descriptions.Item label="Mobile">{selectedRecord.mobile}</Descriptions.Item>
            <Descriptions.Item label="Transaction Type">{transactionTypes[selectedRecord.applicationtype]}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {(() => {
                switch (selectedRecord.applicationstatus) {
                  case 1: return <Tag color="blue">PENDING</Tag>;
                  case 2: return <Tag color="green">APPROVED</Tag>;
                  case 3: return <Tag color="orange">WITH PENDING REQUIREMENTS</Tag>;
                  case 4: return <Tag color="red">REJECTED</Tag>;
                  default: return 'Unknown';
                }
              })()}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <Space wrap style={{ width: '100%' }}>
              <Button type="default" block onClick={() => handleViewDocuments(selectedRecord.applicationno)}>
                View Documents
              </Button>
              <Popconfirm
                title="Are you sure you want to approve this application?"
                onConfirm={() => updateApplicationStatus(selectedRecord.applicationno, 2)}
              >
                <Button type="primary" block>Approve</Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to reject this application?"
                onConfirm={() => updateApplicationStatus(selectedRecord.applicationno, 4)}
              >
                <Button danger block>Reject</Button>
              </Popconfirm>
              <Popconfirm
                title="Mark application with pending requirements?"
                onConfirm={() => updateApplicationStatus(selectedRecord.applicationno, 3)}
              >
                <Button block>Mark Pending</Button>
              </Popconfirm>
            </Space>
          </div>
        </Modal>
      )}

      {/* Assign Modal */}
      <Modal
        open={assignModalVisible}
        title="Assign Application"
        onCancel={() => setAssignModalVisible(false)}
        footer={null}
        centered
        maskClosable={false}
      >
        <div style={{ marginBottom: 16 }}>
          <label>Select Personnel Type</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Choose personnel type"
            onChange={(value) => {
              setSelectedPersonnelType(value);
              setNewAssignee(null); // Clear selected user
              fetchUsersByType(value);
            }}
            value={selectedPersonnelType}
          >
          {personnelOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {selectedPersonnelType && (
          <div style={{ marginBottom: 16 }}>
            <label>Select User</label>
            <Select
              key={selectedPersonnelType}
              style={{ width: '100%' }}
              placeholder="Choose user"
              value={newAssignee}
              onChange={setNewAssignee}
            >
              {availableUsers.map((user) => (
                <Option key={user.userid} value={user.userid}>
                  {user.UserDetail
                    ? `${user.UserDetail.firstname} ${user.UserDetail.lastname}`
                    : user.username}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <Button
          type="primary"
          block
          onClick={handleAssigneeChange}
          disabled={!selectedPersonnelType || !newAssignee}
        >
          Assign to User
        </Button>
      </Modal>

      {/* View Documents Modal */}
      <Modal
        open={viewDocumentsModalVisible}
        title="Uploaded Documents"
        onCancel={() => setViewDocumentsModalVisible(false)}
        footer={null}
        centered
      >
        <List
          dataSource={documents}
          renderItem={(item) => (
            <List.Item>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.filename}
              </a>
            </List.Item>
          )}
          locale={{ emptyText: 'No documents uploaded.' }}
        />
      </Modal>
    </div>
  );
}

export default Application;
