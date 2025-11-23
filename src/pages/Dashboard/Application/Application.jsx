import React, { useEffect, useState } from "react";
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
  Select,
  Input,
} from "antd";
import http from "../../../utils/http.js";
import SetAppointmentModal from "./SetAppointmentModal.jsx";
import ViewAppointmentModal from "./ViewAppointmentModal.jsx";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const transactionTypes = {
  1: "RO-F-03a - Permit for COV (Transport of Planted Trees)",
  2: "RO-F-04 - Chainsaw Registration",
  3: "RO-F-05 - Tree Cutting Permit (Govt Projects)",
};

const transactionOptions = [
  {
    value: "1",
    label: "RO-F-03a-Get Permit for COV for the Transport of Planted Trees",
    requirements: [
      "Request letter indicating:\na. Type of forest product\nb. Species\nc. Estimated volume/quantity\nd. Type of conveyance and plate number\ne. Name and address of the consignee/destination\nf. Date of transport",
      "Certification that the forest products are harvested within the area of the owner (1 original)",
      "Approved Tree Cutting Permit for timber (1 photocopy)",
      "OR/CR of conveyance and Driver’s License (1 photocopy)",
      "Certificate of Transport Agreement (if not owner of conveyance)",
      "Special Power of Attorney (SPA) (if applicant is not the land owner)",
    ],
  },
  {
    value: "2",
    label: "R0-F-04-Application of Chainsaw Registration",
    requirements: [
      "Duly accomplished Application Form",
      "Official Receipt of Chainsaw Purchase or Affidavit of Ownership",
      "SPA (if applicant is not the owner of the chainsaw)",
      "Detailed Specification of Chainsaw",
      "Notarized Deed of Absolute Sale (if transfer of ownership)",
      "Chainsaw to be registered",
      "Forest Tenure Agreement (if Tenurial Instrument holder)",
      "Business Permit (if Business Owner)",
      "Certificate of Registration (if Private Tree Plantation Owner)",
      "Business Permit or affidavit for legal purpose",
      "Wood processing plant permit (if licensed Wood Processor)",
      "Certification from Head of Office (if government)",
      "Latest Certificate of Chainsaw Registration (if renewal)",
    ],
  },
  {
    value: "3",
    label: "RO-F-05-Issuance of Special/Tree Cutting permit (Govt Projects)",
    requirements: [
      "Letter of Application (1 original)",
      "LGU Endorsement/Certification of No Objection (1 original)",
      "Approved Site/Infrastructure Plan with tree charting (1 Certified True Copy)",
      "ECC or CNC (1 certified copy)",
      "NCIP Clearance (if applicable)",
      "Waiver/Consent of owner (if titled property)",
      "PAMB Clearance/Resolution (if within Protected Area)",
    ],
  },
];

const personnelOptions = [
  { label: "RECEIVING/RELEASING CLERK", value: 3 },
  { label: "CENR OFFICER", value: 4 },
  { label: "CHIEF RPS", value: 5 },
  { label: "DEPUTY CENR OFFICER", value: 6 },
  { label: "INSPECTION TEAM RPS/TSD", value: 7 },
  { label: "TECHNICAL STAFF CONCERNED", value: 8 },
];

function Application() {
  const [messageApi, contextHolder] = message.useMessage();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewDocumentsModalVisible, setViewDocumentsModalVisible] =
    useState(false);
  const [documents, setDocuments] = useState([]);
  const [newAssignee, setNewAssignee] = useState(null);
  const [selectedPersonnelType, setSelectedPersonnelType] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [appointmentMap, setAppointmentMap] = useState({});
  const [viewAppointmentModalVisible, setViewAppointmentModalVisible] =
    useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);

  const identity = JSON.parse(localStorage.getItem("identity"));

  // const fetchApplications = async () => {
  //   try {
  //     setLoading(true);
  //     let response;
  //     if (identity.userJSON.usertype === 2) {
  //       response = await http.get(`/applications/request/${identity.userJSON.userid}`);
  //     } else {
  //       response = await http.get(`/application/request-search`);
  //     }
  //     const { applications, uploadedFiles } = response;

  //     const appsWithDocs = applications
  //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  //       .map((app) => {
  //         const transaction = transactionOptions.find(
  //           (t) => t.value === String(app.applicationtype)
  //         );
  //         const filesWithRequirementNames = uploadedFiles
  //           .filter((file) => file.applicationno === app.applicationno)
  //           .map((file, idx) => ({
  //             ...file,
  //             requirementname: transaction?.requirements[idx] || `Requirement ${idx + 1}`
  //           }));
  //         return { ...app, files: filesWithRequirementNames };
  //       });

  //     setApplications(appsWithDocs);
  //     setFilteredApps(appsWithDocs);
  //   } catch (error) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Failed to fetch applications. Please try again.',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchApplications = async () => {
    try {
      setLoading(true);

      let response;
      if (identity.userJSON.usertype === 2) {
        response = await http.get(
          `/applications/request/${identity.userJSON.userid}`
        );
      } else {
        response = await http.get(`/application/request-search`);
      }

      const { applications, uploadedFiles } = response;

      const appsWithDocs = applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((app) => {
          const transaction = transactionOptions.find(
            (t) => t.value === String(app.applicationtype)
          );

          const filesWithRequirementNames = uploadedFiles
            .filter((file) => file.applicationno === app.applicationno)
            .map((file, idx) => ({
              ...file,
              requirementname:
                transaction?.requirements[idx] || `Requirement ${idx + 1}`,
            }));

          return { ...app, files: filesWithRequirementNames };
        });

      let filteredList = appsWithDocs;

      if (identity.userJSON.usertype >= 3 && identity.userJSON.usertype <= 8) {
        filteredList = appsWithDocs.filter(
          (app) => app.assignedpersonnel === identity.userDetail.userid
        );
      }

      setApplications(filteredList);
      setFilteredApps(filteredList);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to fetch applications. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await http.get("/appointment/get");
      const map = {};
      res.appointments.forEach((item) => {
        map[item.applicationno] = item;
      });
      setAppointmentMap(map);
    } catch {
      messageApi.open({
        type: "error",
        content: "Failed to fetch appointments",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchAppointments();
  }, []);

  const handleSearch = (value) => {
    const lower = value.toLowerCase();
    const filtered = applications.filter(
      (app) =>
        app.firstname.toLowerCase().includes(lower) ||
        app.lastname.toLowerCase().includes(lower) ||
        app.applicationno.toString().includes(lower) ||
        app.mobile.includes(lower)
    );
    setFilteredApps(filtered);
    setSearchText(value);
  };

  const updateApplicationStatus = async (applicationNo, status) => {
    try {
      await http.patch(`/application/${applicationNo}/status`, {
        applicationstatus: status,
      });
      messageApi
        .open({
          type: "success",
          content: "Application status updated successfully",
        })
        .then(() => {
          location.reload();
        });
      await fetchApplications();
      setModalVisible(false);
    } catch {
      messageApi.open({
        type: "error",
        content: "Failed to update application status",
      });
    }
  };

  const handleViewDocuments = (record) => {
    setDocuments(record.files || []);
    setViewDocumentsModalVisible(true);
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
      const response = await http.get("/auth/users-by-usertype", {
        params: { usertype: type },
      });
      setAvailableUsers(response.data);
    } catch {
      messageApi.open({
        type: "error",
        content: "Failed to fetch users",
      });
    }
  };

  const handleAssigneeChange = async () => {
    if (!newAssignee) {
      return messageApi.open({
        type: "warning",
        content: "Please select an assignee",
      });
    }

    try {
      await http.patch(`/application/assign-personnel`, {
        applicationno: selectedRecord.applicationno,
        userid: newAssignee,
      });
      messageApi.open({
        type: "success",
        content: "Assignee updated successfully",
      });
      await fetchApplications();
      setAssignModalVisible(false);
    } catch {
      messageApi.open({
        type: "error",
        content: "Failed to update assignee",
      });
    }
  };

  const openCalendarModal = (record) => {
    setSelectedRecord(record);
    const appointment = appointmentMap[record.applicationno];
    if (appointment) {
      setViewingAppointment(appointment);
      setViewAppointmentModalVisible(true);
    } else {
      setCalendarModalVisible(true);
    }
  };

  const columns = [
    {
      title: "Application No",
      dataIndex: "applicationno",
      key: "applicationno",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Transaction Type",
      dataIndex: "applicationtype",
      key: "applicationtype",
      render: (type) => (
        <Tag color="green">{transactionTypes[type] || "Unknown"}</Tag>
      ),
    },
    {
      title: "Application Status",
      dataIndex: "applicationstatus",
      key: "applicationstatus",
      render: (status) => {
        switch (status) {
          case 1:
            return <Tag color="blue">PENDING</Tag>;
          case 2:
            return <Tag color="green">APPROVED</Tag>;
          case 3:
            return <Tag color="orange">WITH PENDING REQUIREMENTS</Tag>;
          case 4:
            return <Tag color="red">REJECTED</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => {
        const isAdmin = identity.userJSON.usertype === 1;
        const isAssignee =
          record.assignedpersonnel === identity.userDetail.userid;
        const hasAppointment = appointmentMap[record.applicationno];
        return (
          <Space>
            {(isAdmin || isAssignee) && (
              <>
                <Button type="link" onClick={() => openManageModal(record)}>
                  Manage
                </Button>
                <Button type="link" onClick={() => openAssignModal(record)}>
                  Assign
                </Button>
              </>
            )}
            {identity.userJSON.usertype === 2 &&
              record.applicationstatus === 2 && (
                <Button type="link" onClick={() => openCalendarModal(record)}>
                  {hasAppointment
                    ? "View Appointment Details"
                    : "Set Appointment"}
                </Button>
              )}
          </Space>
        );
      },
    },
  ];

  const documentColumns = [
    {
      title: "Requirement Name",
      dataIndex: "requirementname",
      key: "requirementname",
    },
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <a href={record.uploadfileurl} download={record.filename}>
            <Button type="link">Download</Button>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Title level={3}>My Applications</Title>

      <Search
        placeholder="Search by name, application no, or mobile"
        enterButton
        allowClear
        onSearch={handleSearch}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ maxWidth: 400, marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredApps}
        rowKey="applicationno"
        loading={loading}
      />

      {/* Manage Modal */}
      <Modal
        open={modalVisible}
        title="Manage Application"
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
      >
        {selectedRecord && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Application No">
                {selectedRecord.applicationno}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedRecord.firstname} {selectedRecord.lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRecord.email}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {selectedRecord.mobile}
              </Descriptions.Item>
              <Descriptions.Item label="Transaction Type">
                {transactionTypes[selectedRecord.applicationtype]}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  switch (selectedRecord.applicationstatus) {
                    case 1:
                      return <Tag color="blue">PENDING</Tag>;
                    case 2:
                      return <Tag color="green">APPROVED</Tag>;
                    case 3:
                      return (
                        <Tag color="orange">WITH PENDING REQUIREMENTS</Tag>
                      );
                    case 4:
                      return <Tag color="red">REJECTED</Tag>;
                    default:
                      return "Unknown";
                  }
                })()}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24, display: "flex" }}>
              <Space wrap style={{ width: "100%" }}>
                <Button
                  block
                  onClick={() => handleViewDocuments(selectedRecord)}
                >
                  View Documents
                </Button>
                <Popconfirm
                  title="Approve this application?"
                  onConfirm={() =>
                    updateApplicationStatus(selectedRecord.applicationno, 2)
                  }
                >
                  <Button type="primary" block>
                    Approve
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Reject this application?"
                  onConfirm={() =>
                    updateApplicationStatus(selectedRecord.applicationno, 4)
                  }
                >
                  <Button danger block>
                    Reject
                  </Button>
                </Popconfirm>
                {/*<Popconfirm title="Mark application as pending requirements?" onConfirm={() => updateApplicationStatus(selectedRecord.applicationno, 3)}>*/}
                {/*  <Button block>Mark Pending</Button>*/}
                {/*</Popconfirm>*/}
              </Space>
            </div>
          </>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        open={assignModalVisible}
        title="Assign Application"
        onCancel={() => setAssignModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ marginBottom: 16 }}>
          <label>Select Personnel Type</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Choose personnel type"
            onChange={(value) => {
              setSelectedPersonnelType(value);
              setNewAssignee(null);
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
              style={{ width: "100%" }}
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
        <Table
          columns={documentColumns}
          dataSource={documents}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Appointment Modal */}
      <SetAppointmentModal
        open={calendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        record={selectedRecord}
        onSuccess={() => {
          setTimeout(() => {
            location.reload();
          }, 2000);
        }}
      />

      {/* View Appointment Modal */}
      <ViewAppointmentModal
        open={viewAppointmentModalVisible}
        onClose={() => setViewAppointmentModalVisible(false)}
        appointment={viewingAppointment}
      />
    </div>
  );
}

export default Application;
