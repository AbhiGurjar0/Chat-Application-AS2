import React from 'react';

const Message = ({ message, isOwn }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (isOwn) {
      switch (message.status) {
        case 'sent':
          return '✓';
        case 'delivered':
          return '✓✓';
        case 'seen':
          return <span style={{ color: '#007bff' }}>✓✓</span>;
        default:
          return '';
      }
    }
    return null;
  };

  return (
    <div className={`message ${isOwn ? 'own' : ''}`}>
      <div className="message-content">
        {!isOwn && (
          <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>
            {message.sender.username}
          </div>
        )}
        <div>{message.content}</div>
        <div className="message-info">
          {formatTime(message.createdAt)}
          {getStatusIcon() && (
            <span style={{ marginLeft: '5px' }}>
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
