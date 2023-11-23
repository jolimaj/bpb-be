const { EmailHelper } = require("../../helpers/notification/email-message");
const { SMSHelper } = require("../../helpers/notification/sms-message");
const { NOTIF_TYPE } = require("../constant/notification-constant");

class NotificationMapper {
  #emailHelper;
  #smsHelper;

  constructor() {
    this.#emailHelper = new EmailHelper();
    this.#smsHelper = new SMSHelper();
  }

  emailMapper(payload, type) {
    const req = {
      from: "Email from @businesspermitngbayan.vercel.app <donotreplybpbbusinesspermitngbayan@gmail.com>'",
      to: payload?.email,
      subject: this.#emailHelper.subject(type),
      text: this.#emailHelper.message(
        payload?.id,
        payload?.notifParamsId,
        type
      ),
    };

    if (type === NOTIF_TYPE.RELEASE_PERMIT) {
      req.attachments = [
        {
          filename: "businessPermit.pdf",
          path: payload.certificate,
        },
        {
          filename: "qrCode.svg",
          path: payload.qrCode,
          cid: "qrCode",
        },
        // {
        //   filename: "queueNo.png",
        //   path: payload.queueNo,
        //   cid: "queueNo",
        // },
      ];
    }
    return req;
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
