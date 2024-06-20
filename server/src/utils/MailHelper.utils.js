import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const mailHelper = async (user) => {
  try {
    if (
      !user ||
      !user.email ||
      !user.subject ||
      !user.message ||
      !user.htmlMessage
    ) {
      throw new Error("Incomplete user object provided for sending email");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const message = {
      from: "updates@modazen.com",
      to: user.email,
      subject: user.subject,
      text: user.message,
      html: user.htmlMessage,
    };

    const info = await transporter.sendMail(message);
    return info;
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

export { mailHelper };
