const { EmailHelper } = require("../../helpers/notification/email-message");

class NotificationMapper {
  #emailHelper;

  constructor() {
    this.#emailHelper = new EmailHelper();
  }

  emailMapper(payload, type) {
    return {
      from: "'Email from @businesspermitngbayan.vercel.app <donotreplybpbbusinesspermitngbayan@gmail.com>'",
      to: payload?.email,
      subject: this.#emailHelper.subject(type),
      text: this.#emailHelper.message(payload?.id, type),
    };
  }

  smsMapper(payload) {
    return {
      from: payload?.from,
      to: payload?.mobile,
      text: payload?.message,
    };
  }
}

module.exports = { NotificationMapper };
