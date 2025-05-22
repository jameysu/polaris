import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import http from "../../../utils/http.js";

const { Title, Text } = Typography;

function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    withPendingRequirements: 0,
  });

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const identity = JSON.parse(localStorage.getItem('identity'));

    // Generate greeting based on time
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = identity?.userDetail?.firstname || 'User';
    setGreeting(`${timeGreeting}, ${name}!`);

    // Fetch applications
    const fetchApplications = async () => {
      try {
        let response
        if(identity.userJSON.usertype === 2) {
          response = await http.get(`/applications/request/${identity.userJSON.userid}`);
        } else {
          response = await http.get(`/application/request-search`);
        }
        if (response.success) {
          const apps = response.applications;

          const statusCounts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            withPendingRequirements: 0,
          };

          apps.forEach(app => {
            switch (app.applicationstatus) {
              case 1:
                statusCounts.pending++;
                break;
              case 2:
                statusCounts.approved++;
                break;
              case 4:
                statusCounts.rejected++;
                break;
              case 3:
                statusCounts.withPendingRequirements++;
                break;
              default:
                break;
            }
          });

          setStats(statusCounts);
        }
      } catch (err) {
        console.error('Failed to fetch applications', err);
      }
    };

    fetchApplications();
  }, []); // Empty dependency array ensures it runs only once

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
