import * as nodemailer from 'nodemailer';
import ejs from 'ejs'
import { RESETPASSWORD } from './templates';

// Create a transporter with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'organization2201@gmail.com',
    pass: 'kgue pmwg smij brly'
  },
});

export const sendMail = ({
  to, data , email_type,subject
}) => {
  const emails = {
    "reset_password":RESETPASSWORD
  }
  const html = ejs.render(emails[email_type] , {})
  const options = {
    from: 'organization2201@example.com',
    to,
    data,
    html:html,
    subject
  }
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return console.error(error);
    }
    console.log('Email sent:', info.response);
  });

}

