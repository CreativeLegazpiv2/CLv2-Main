"use client"

import sendEmail from '@/services/email/emailService';
import React, { useState } from 'react';

const SendEmailComponent = () => {
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
      const emailData = {
        to: emailTo,
        subject: subject,
        text: message, // or use `html: message` for HTML content
      };

      const response = await sendEmail(emailData);
      alert('Email sent successfully!');
    } catch (error) {
      alert('Failed to send email');
    }
  };

  return (
    <div className='mt-48'>
      <input
        type="email"
        placeholder="Recipient Email"
        value={emailTo}
        onChange={(e) => setEmailTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default SendEmailComponent;
