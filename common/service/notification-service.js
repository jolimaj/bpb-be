const nodemailer = require("nodemailer");
const { Vonage } = require("@vonage/server-sdk");

const { TRANSPORTER } = require("../constant/notification-constant");

const { NotificationMapper } = require("../mappers/notification-mapper");

class NotificationService {
  #notificationMapper;

  #transporter;

  #vonage;

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
    this.#vonage = new Vonage({
      apiKey: "accdcf4d",
      apiSecret: "ruO3egZtETjJneZF",
    });
  }

  sendEmailNotification(payload, type) {
    const requestBody = this.#notificationMapper.emailMapper(payload, type);
    return this.#transporter.sendMail(requestBody);
  }

  async sendSMSNotification(payload) {
    try {
      const requestBody = this.#notificationMapper.smsMapper(payload);
      return await this.#vonage.sms.send(requestBody);
    } catch (error) {
      return error;
    }
  }
}

module.exports = { NotificationService };
