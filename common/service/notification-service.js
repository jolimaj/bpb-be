const nodemailer = require("nodemailer");
const { TRANSPORTER } = require("../constant/notification-constant");

const { NotificationMapper } = require("../mappers/notification-mapper");

class NotificationService {
  #notificationMapper;

  #transporter;
  constructor() {
    this.#notificationMapper = new NotificationMapper();
    this.#transporter = nodemailer.createTransport({
      service: TRANSPORTER.SERVICE,
      host: TRANSPORTER.HOST,
      port: TRANSPORTER.PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, //email ID
        pass: process.env.EMAIL_PASSWORD, //Password
      },
    });
  }

  sendEmailNotification(payload, type) {
    const requestBody = this.#notificationMapper.emailMapper(payload, type);
    return this.#transporter.sendMail(requestBody);
  }
}

module.exports = { NotificationService };
