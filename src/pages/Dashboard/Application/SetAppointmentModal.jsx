import React, { useEffect, useState } from "react";
import {
  Modal,
  Calendar,
  List,
  Typography,
  Spin,
  message,
  Button,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import http from "../../../utils/http.js";

const { Title } = Typography;

const SetAppointmentModal = ({ open, onClose, record, onSuccess }) => {

  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const identity = JSON.parse(localStorage.getItem("identity"));

  useEffect(() => {
    if (open) {
      setSelectedDate(null);
      setTimeSlots([]);
    }
  }, [open]);

  const onDateSelect = async (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setLoading(true);

    try {
      const res = await http.get(
        `/appointment/get-available-schedules?date=${formattedDate}`
      );
      const data = res.schedules || [];

      const scheduleForDate = data.find((item) => item.date === formattedDate);

      if (scheduleForDate) {
        setTimeSlots(scheduleForDate.availableTimes);
      } else {
        setTimeSlots([]);
      }
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: 'Failed to fetch available schedules.',
      });
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    const isPast = current.isBefore(dayjs().startOf("day"));
    const isToday = current.isSame(dayjs(), "day");
    const isWeekend = current.day() === 0 || current.day() === 6;
    return isPast || isWeekend || isToday;
  };

  const handlePick = async (time) => {
    if (!selectedDate || !record) return;

    const payload = {
      appointmentdate: selectedDate,
      appointmenttime: time,
      applicationno: record.applicationno,
      firstname: record.firstname,
      lastname: record.lastname,
      middlename: record.middlename,
      email: record.email,
      mobileno: record.mobile,
      userid: identity.userJSON.userid,
    };

    try {
      const res = await http.post("/appointment/set", payload);
      if (res.success) {
        messageApi.open({
          type: 'success',
          content: 'Appointment set successfully.',
        });

        if (onSuccess) {
          onSuccess(); // ✅ Call onSuccess callback
        }

        onClose(); // ✅ Close modal after success
      } else {
        messageApi.open({
          type: 'error',
          content: res.message || "Failed to book appointment.",
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.response?.data?.message || "Failed to book appointment.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Select an Available Schedule"
        open={open}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Calendar
              fullscreen={false}
              disabledDate={disabledDate}
              onSelect={onDateSelect}
              value={selectedDate ? dayjs(selectedDate) : undefined}
            />

            {selectedDate && (
              <>
                <Title level={4} style={{ marginTop: 20 }}>
                  Available Time Slots for {selectedDate}
                </Title>
                {timeSlots.length > 0 ? (
                  <List
                    bordered
                    dataSource={timeSlots}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Popconfirm
                            key="confirm"
                            title={`Confirm booking for ${item.time}?`}
                            onConfirm={() => handlePick(item.time)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="primary">Pick</Button>
                          </Popconfirm>,
                        ]}
                      >
                        <strong>{item.time}</strong> – {item.slot} slot(s) left
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No available time slots for this date.</p>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default SetAppointmentModal;
