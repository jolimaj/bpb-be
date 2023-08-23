const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

class EmailHelper {
  message(id, type) {
    let text;

    switch (type) {
      case NOTIF_TYPE.PASSWORD_RESET:
        text = `We hope this email finds you well. We received a request to reset the password associated with your account on ${process.env.APP_NAME}. To ensure the security of your account, we are providing you with the necessary steps to reset your password.

        If you did not initiate this request or believe it to be an error, please disregard this email. Your account remains safe, and no action is required.

        To proceed with the password reset, please click on the following link to access the password reset page: ${process.env.MAIN_URL}`;
        break;
      case NOTIF_TYPE.NEW_STAFF:
        text = `We hope this email finds you well. We received a request to reset the password associated with your account on ${process.env.APP_NAME}. To ensure the security of your account, we are providing you with the necessary steps to reset your password.

        To proceed with the password creation, please click on the following link to access the password creation page: ${process.env.MAIN_URL}admin/users/staff/${id}`;
        break;
      case NOTIF_TYPE.UPON_CREATION:
        text = `We are thrilled to welcome you to ${process.env.APP_NAME}! Thank you for creating an account with us. This marks the beginning of an exciting journey together, and we can't wait to show you all that our platform has to offer. To proceed with the account activation, please click on the following link to activate your account: ${process.env.MAIN_URL}sign-in/${id}`;
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
        sub = "Welcome to BPB!";
        break;
      case NOTIF_TYPE.NEW_STAFF:
        sub = "Welcome to BPB!";
        break;
    }

    return sub;
  }
}

module.exports = { EmailHelper };
