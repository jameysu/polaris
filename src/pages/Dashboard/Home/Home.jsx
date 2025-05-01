import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    withPendingRequirements: 0,
  });

  useEffect(() => {
    // Simulate fetching dummy data
    const timeout = setTimeout(() => {
      setStats({
        pending: 12,
        approved: 8,
        rejected: 3,
        withPendingRequirements: 5,
      });
    }, 500); // simulate loading delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Application Dashboard</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Requirements"
              value={stats.withPendingRequirements}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
