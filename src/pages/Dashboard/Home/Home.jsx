import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  List,
  Avatar,
  Divider,
  Space,
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  ExclamationCircleTwoTone,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import http from "../../../utils/http.js";
import dayjs from "dayjs"; // Add this at the top

const { Title, Text } = Typography;

function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    withPendingRequirements: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [doneAppointments, setDoneAppointments] = useState([]);
  const [allApplications, setAllApplications] = useState([]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: // Pending
        return <ClockCircleTwoTone twoToneColor="#1890ff" />;
      case 2: // Approved
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      case 4: // Rejected
        return <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
      case 3: // Pending Requirements
        return <ExclamationCircleTwoTone twoToneColor="#faad14" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const identity = JSON.parse(localStorage.getItem("identity"));

    // Greeting
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening";
    const name = identity?.userDetail?.firstname || "User";
    setGreeting(`${timeGreeting}, ${name}!`);

    const fetchApplications = async () => {
      try {
        let response;
        if (identity.userJSON.usertype === 2) {
          console.log("identity.userJSON.usertype", identity.userJSON.usertype);
          response = await http.get(
            `/applications/request/${identity.userJSON.userid}`
          );
        } else {
          console.log("TEST");
          response = await http.get(`/application/request-search`);
        }

        if (response.success) {
          const apps = response.applications || [];

          // ✅ NEW: Set full list for "Application Requests"
          setAllApplications(apps); // Make sure you have `const [allApplications, setAllApplications] = useState([]);`

          // ✅ Existing: Save latest 5 for recent applications
          setRecentApplications(apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

          // ✅ Existing: Application status counters
          const statusCounts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            withPendingRequirements: 0,
          };

          apps.forEach((app) => {
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
        console.error("Failed to fetch applications", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        let response
        if(identity.userJSON.usertype === 2) {
          response = await http.get(`/appointment/user/${identity.userJSON.userid}`);
        } else {
          response = await http.get(`/appointment/get`);
        }
        if (response.success) {
          const now = dayjs();
          const upcoming = [];
          const done = [];

          response.appointments.forEach((appt) => {
            const apptDate = dayjs(appt.appointmentdate);
            const isInFuture =
              apptDate.isAfter(now, "day") || apptDate.isSame(now, "day");

            if (isInFuture && !appt.isdone) {
              upcoming.push(appt);
            } else {
              done.push(appt);
            }
          });

          setUpcomingAppointments(upcoming.slice(0, 5));
          setDoneAppointments(done.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchApplications();
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Application Dashboard</Title>
      <Text style={{ fontSize: 18, display: "block", marginBottom: 24 }}>
        {greeting}
      </Text>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24, flexWrap: "wrap" }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ClockCircleTwoTone twoToneColor="#1890ff" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
            />
          </Card>
        </Col>
        {/*<Col xs={24} sm={12} md={4}>*/}
        {/*  <Card>*/}
        {/*    <Statistic*/}
        {/*      title="Pending Requirements"*/}
        {/*      value={stats.withPendingRequirements}*/}
        {/*      valueStyle={{ color: "#faad14" }}*/}
        {/*      prefix={<ExclamationCircleTwoTone twoToneColor="#faad14" />}*/}
        {/*    />*/}
        {/*  </Card>*/}
        {/*</Col>*/}
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Upcoming Appointments"
              value={upcomingAppointments.length}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Done Appointments"
              value={doneAppointments.length}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Lists */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Application Requests" bordered={false}>
            {allApplications.length === 0 ? (
              <Text>No application requests found.</Text>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {allApplications.map((app) => (
                  <Space
                    key={app.applicationno}
                    align="start"
                    style={{ display: "flex" }}
                  >
                    {getStatusIcon(app.applicationstatus)}
                    <div>
                      <Text strong>{app.applicationno}</Text> —{" "}
                      {`${app.firstname} ${app.middlename ?? ""} ${
                        app.lastname
                      }`}
                      <br />
                      <Text type="secondary">
                        Submitted:{" "}
                        {new Date(app.createdAt).toLocaleDateString()} @{" "}
                        {new Date(app.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </div>
                  </Space>
                ))}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Upcoming Appointments"
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingAppointments}
              locale={{ emptyText: "No upcoming appointments" }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} />}
                    title={<Text strong>{item.applicationno}</Text>}
                    description={`${item.firstname} ${item.lastname} - ${dayjs(
                      item.appointmentdate
                    ).format("MM/DD/YYYY")} @ ${dayjs(
                      item.appointmenttime,
                      "HH:mm:ss"
                    ).format("hh:mm A")}`}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Done Appointments" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={doneAppointments}
              locale={{ emptyText: "No finished appointments" }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                      />
                    }
                    title={<Text strong>{item.applicationno}</Text>}
                    description={`${item.firstname} ${item.lastname} - ${dayjs(
                      item.appointmentdate
                    ).format("MM/DD/YYYY")} @ ${dayjs(
                      item.appointmenttime,
                      "HH:mm:ss"
                    ).format("hh:mm A")}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;