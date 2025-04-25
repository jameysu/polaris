import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag, message } from 'antd';
import http from '../../../utils/http.js';

const { Title } = Typography;

const transactionTypes = {
  1: 'RO-F-03a - Permit for COV (Transport of Planted Trees)',
  2: 'RO-F-04 - Chainsaw Registration',
  3: 'RO-F-05 - Tree Cutting Permit (Govt Projects)',
};

function Application() {
  const [applications, setApplications] = useState([]);
  console.log(applications)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const identity = JSON.parse(localStorage.getItem('identity'));
        const response = await http.get(`/applications/request/${identity.userDetail.userid}`);
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
        let label = 'Unknown';
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
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Applications</Title>
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="applicationno"
        loading={loading}
      />
    </div>
  );
}

export default Application;
