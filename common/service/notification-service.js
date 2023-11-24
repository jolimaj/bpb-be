const secrets = process.env;
const accountSid = secrets.SMS_SID;
const authToken = secrets.SMS_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
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

  async sendEmailNotification(payload, type) {
    const requestBody = this.#notificationMapper.emailMapper(payload, type);
    return await this.#transporter.sendMail(requestBody);
  }

  async sendfgotification(payload) {
    try {
      const requestBody = this.#notificationMapper.smsMapper(
        {
          ...payload,
          from: secrets.SMS_NUM,
        },
        payload.assignedToDepartmentID
      );
      return await client.messages.create(requestBody);
    } catch (error) {
      return error;
    }
  }
}

module.exports = { NotificationService };
