export interface SendEmailParams {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }
  
  const sendEmail = async (emailData: SendEmailParams) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      const data = await response.json();
      console.log('Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  };
  
  export default sendEmail;
  