const { EmailHelper } = require("../../helpers/notification/email-message");
const { SMSHelper } = require("../../helpers/notification/sms-message");

class NotificationMapper {
  #emailHelper;
  #smsHelper;

  constructor() {
    this.#emailHelper = new EmailHelper();
    this.#smsHelper = new SMSHelper();
  }

  emailMapper(payload, type) {
    return {
      from: "Email from @businesspermitngbayan.vercel.app <donotreplybpbbusinesspermitngbayan@gmail.com>'",
      to: payload?.email,
      subject: this.#emailHelper.subject(type),
      text: this.#emailHelper.message(
        payload?.id,
        payload?.notifParamsId,
        type
      ),
    };
  }

  smsMapper(payload, department) {
    return {
      from: payload?.from,
      to: payload?.mobile,
      body: this.#smsHelper.message(department, payload?.type, payload?.status),
    };
  }
}

module.exports = { NotificationMapper };
