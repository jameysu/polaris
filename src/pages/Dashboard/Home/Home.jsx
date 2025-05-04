import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    withPendingRequirements: 0,
  });

  const [greeting, setGreeting] = useState('');
  const identity = JSON.parse(localStorage.getItem('identity'));

  useEffect(() => {
    // Generate greeting based on time
    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    const name = identity?.userDetail?.firstname || 'User';
    setGreeting(`${timeGreeting}, ${name}!`);

    // Simulate fetching dummy stats
    const timeout = setTimeout(() => {
      setStats({
        pending: 12,
        approved: 8,
        rejected: 3,
        withPendingRequirements: 5,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [identity]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Application Dashboard</Title>
      <Text style={{ fontSize: 18, display: 'block', marginBottom: 24 }}>{greeting}</Text>
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
