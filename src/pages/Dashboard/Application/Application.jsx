import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag, message, Button, Space, Popconfirm, Modal, Descriptions, List } from 'antd';
import http from '../../../utils/http.js';

const { Title } = Typography;

const transactionTypes = {
  1: 'RO-F-03a - Permit for COV (Transport of Planted Trees)',
  2: 'RO-F-04 - Chainsaw Registration',
  3: 'RO-F-05 - Tree Cutting Permit (Govt Projects)',
};

function Application() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [viewDocumentsModalVisible, setViewDocumentsModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);

  const identity = JSON.parse(localStorage.getItem('identity'));

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const identity = JSON.parse(localStorage.getItem('identity'));
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

    if (applications.length === 0) {
      fetchApplications();
    }
  }, [applications]);

  const handleApprove = async (applicationNo) => {
    try {
      await http.post(`/application/approve/${applicationNo}`);
      message.success('Application approved successfully');
      setApplications([]);
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to approve application');
    }
  };

  const handleReject = async (applicationNo) => {
    try {
      await http.post(`/application/reject/${applicationNo}`);
      message.success('Application rejected successfully');
      setApplications([]);
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to reject application');
    }
  };

  const handlePending = async (applicationNo) => {
    try {
      await http.post(`/application/mark-pending/${applicationNo}`);
      message.success('Application marked with pending requirements');
      setApplications([]);
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to mark application as pending');
    }
  };

  const handleViewDocuments = async (applicationNo) => {
    try {
      const response = await http.get(`/application/documents/${applicationNo}`);
      setDocuments(response.documents || []);
      setViewDocumentsModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch documents');
    }
  };

  const openManageModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
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
          case 1:
            return <Tag color="blue">PENDING</Tag>;
          case 2:
            return <Tag color="green">APPROVED</Tag>;
          case 3:
            return <Tag color="warning">WITH PENDING REQUIREMENTS</Tag>;
          case 4:
            return <Tag color="red">REJECTED</Tag>;
          default:
            return null;
        }
      },
    },
  ];

  if (identity.userJSON.usertype === 1) {
    columns.push({
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => openManageModal(record)}>
          Manage
        </Button>
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

      {/* Main Manage Modal */}
      {selectedRecord && (
        <Modal
          open={modalVisible}
          title="Manage Application"
          onCancel={closeModal}
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
                  case 3: return <Tag color="warning">WITH PENDING REQUIREMENTS</Tag>;
                  case 4: return <Tag color="red">REJECTED</Tag>;
                  default: return 'Unknown';
                }
              })()}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <Space wrap style={{ width: '100%' }}>
              <Button
                type="default"
                block
                onClick={() => handleViewDocuments(selectedRecord.applicationno)}
              >
                View Documents
              </Button>

              <Popconfirm
                title="Are you sure you want to approve this application?"
                onConfirm={() => handleApprove(selectedRecord.applicationno)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" block>
                  Approve
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Are you sure you want to reject this application?"
                onConfirm={() => handleReject(selectedRecord.applicationno)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger block>
                  Reject
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Mark application with pending requirements?"
                onConfirm={() => handlePending(selectedRecord.applicationno)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" block>
                  Mark Pending
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </Modal>
      )}

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
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.filename}</a>
            </List.Item>
          )}
          locale={{ emptyText: 'No documents uploaded.' }}
        />
      </Modal>
    </div>
  );
}

export default Application;
