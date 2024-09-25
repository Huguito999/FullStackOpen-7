import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification || !notification.message) {
    return null;
  }

  const { message, type } = notification;

  const notificationStyle = {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    color: type === 'error' ? 'red' : 'green',
    border: `1px solid ${type === 'error' ? 'red' : 'green'}`,
    backgroundColor: '#f4f4f4',
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
