const nodemailer = require('nodemailer');

const mailSender = async (mailOptions) => {
  try {
    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

// Export the mailSender function
module.exports = { mailSender };
