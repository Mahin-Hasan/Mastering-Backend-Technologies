import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //smtp host of gmail
    port: 587, //smtp code of gmail
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'mahinmtrs@gmail.com',
      pass: config.google_smtp_pass,
    },
  });

  await transporter.sendMail({
    from: 'mahinmtrs@gmail.com', // sender address
    to, // list of receivers
    subject: 'change password with the following link within 10 mins', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
