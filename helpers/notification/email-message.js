const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

class EmailHelper {
  message(type) {
    let text;

    switch (type) {
      case NOTIF_TYPE.PASSWORD_RESET:
        text = `We hope this email finds you well. We received a request to reset the password associated with your account on ${process.env.APP_NAME}. To ensure the security of your account, we are providing you with the necessary steps to reset your password.

        If you did not initiate this request or believe it to be an error, please disregard this email. Your account remains safe, and no action is required.

        To proceed with the password reset, please click on the following link to access the password reset page: [Password Reset Link]`;
        break;
      case NOTIF_TYPE.UPON_CREATION:
        text = `We are thrilled to welcome you to ${process.env.APP_NAME}! Thank you for creating an account with us. This marks the beginning of an exciting journey together, and we can't wait to show you all that our platform has to offer. To proceed with the password reset, please click on the following link to activate your account: [Password Reset Link]`;
        break;
    }

    return text;
  }
  subject(type) {
    let sub;

    switch (type) {
      case NOTIF_TYPE.PASSWORD_RESET:
        sub = "You forgot your password!";
        break;
      case NOTIF_TYPE.UPON_CREATION:
        sub = "You are a new User!";
        break;
    }

    return sub;
  }
}

module.exports = { EmailHelper };
