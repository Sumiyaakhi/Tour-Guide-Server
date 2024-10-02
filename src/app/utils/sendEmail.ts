import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
