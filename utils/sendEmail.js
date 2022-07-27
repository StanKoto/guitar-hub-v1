const sgMail = require('@sendgrid/mail');
const config = require('../envVariables');

exports.sendEmail = async (userEmail, subject, text) => {
  sgMail.setApiKey(config.sendgrid.apiKey);

  const msg = {
    to: userEmail,
    from: config.sendgrid.fromEmail,
    subject,
    text
  };

  await sgMail.send(msg);
};