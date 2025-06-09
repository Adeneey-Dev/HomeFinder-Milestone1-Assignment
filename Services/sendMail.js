const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  try {
    let mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Reset Password Notification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">
          Hello,<br><br>
          You recently requested to reset your password for your CareerEx account. Click the button below to reset it.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.yourcareerex.com/reset-password/${token}" style="padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #555;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="https://www.yourcareerex.com/reset-password/${token}" style="color: #007bff;">
            https://www.yourcareerex.com/reset-password/${token}
          </a>
        </p>
        <p style="font-size: 14px; color: #777;">
          Your reset token (for verification purposes):<br>
          <strong>${token}</strong>
        </p>
        <p style="font-size: 14px; color: #999;">
          If you did not request a password reset, please ignore this email or contact support if you have questions.
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 40px;">
          — CareerEx Team
        </p>
      </div>
        `,
    };
    await mailTransport.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
