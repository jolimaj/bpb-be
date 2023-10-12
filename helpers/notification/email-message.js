const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

class EmailHelper {
  message(id, notifParamsId, type) {
    let text;

    switch (type) {
      case NOTIF_TYPE.PASSWORD_RESET:
        text = `We hope this email finds you well. We received a request to reset the password associated with your account on ${process.env.APP_NAME}. To ensure the security of your account, we are providing you with the necessary steps to reset your password.

        If you did not initiate this request or believe it to be an error, please disregard this email. Your account remains safe, and no action is required.

        To proceed with the password reset, please click on the following link to access the password reset page: ${process.env.MAIN_URL}/signin/forgotPassword/${id}/${notifParamsId}`;
        break;
      case NOTIF_TYPE.NEW_STAFF:
        text = `Welcome to ${process.env.APP_NAME}! We are thrilled to have you join our online community. Your journey with us begins here, and we're excited to see what you'll achieve.
          
          To initiate the password creation process, please click the link below:
       ${process.env.MAIN_URL}/signin/passwordCreation/${id}/${notifParamsId}`;
        break;
      case NOTIF_TYPE.UPON_CREATION:
        text = `Welcome to ${process.env.APP_NAME}! We are thrilled to have you join our online community. Your journey with us begins here, and we're excited to see what you'll achieve.
        
        To get started, please activate your account by clicking on the link below:
        ${process.env.MAIN_URL}/signin/${id}/${notifParamsId}/activate`;
        break;
      default:
        text =
          "Congratulations! You`ve successfully added your password. Your account is now secure and ready for you to access all the features and benefits.";
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
      case NOTIF_TYPE.PASSWORD_RESET_SUCCESS:
        sub = "Password Reset Success!";
        break;
    }

    return sub;
  }
}

module.exports = { EmailHelper };
