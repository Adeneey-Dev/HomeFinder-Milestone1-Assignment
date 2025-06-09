const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  try {
    let mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    const mailDetails = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Your OTP Code, it will expire in 5 minutes",
      html: `${otp}`,
    };

    await mailTransport.sendMail(mailDetails);
  } catch (error) {
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

module.exports = sendOtp;
