import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, token) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const link = `https://greensyncintroverts.online/verify?token=${token}`;
    const mailOptions = {
      from: `"GreenSync" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify that is you!",
      html: `
        <h2>Confirm your request</h2>
        <p>Click the link button below to verify and continue:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Best regards,<br/>GreenSync Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return false;
  }
};
