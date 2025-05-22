// components/ViewAppointmentModal.jsx
import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';

function ViewAppointmentModal({ open, onClose, appointment }) {
  if (!appointment) return null;

  const fullName = `${appointment.firstname} ${appointment.middlename || ''} ${appointment.lastname}`.trim();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Appointment Details"
      centered
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Appointment No">{appointment.appointmentno}</Descriptions.Item>
        <Descriptions.Item label="Applicant Name">{fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{appointment.email}</Descriptions.Item>
        <Descriptions.Item label="Mobile No">{appointment.mobileno}</Descriptions.Item>
        <Descriptions.Item label="Date">
          {dayjs(appointment.appointmentdate).format('MMMM D, YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Time">
          {dayjs(appointment.appointmenttime, 'HH:mm:ss').format('h:mm A')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {appointment.isdone ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="blue">Scheduled</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default ViewAppointmentModal;
