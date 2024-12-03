// src/components/MessagesModal.js
import React from 'react';
import axios from 'axios';

const MessagesModal = ({ messages, onClose }) => {
    console.log({messages});
    const markAsRead = (messageId) => {
        // Make an API call to mark the message as read
        // Replace with actual API endpoint
        axios.post(`https://main.dwoh96qwfxa1j.amplifyapp.com/order/markmessageread?messageId=${messageId}`)
          .then(response => {
            // Handle success (if needed)
            console.log('Message marked as read:', response.data);
          })
          .catch(error => console.error('Error marking message as read:', error));
      };
      
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Messages</h2>
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Mark as Read</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => (
              <tr key={message.messageId}>
                <td>{message.message}</td>
                <td>
                  <button onClick={() => {markAsRead(message.messageId);      window.location.reload();
} }>
                    Mark as Read
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MessagesModal;
