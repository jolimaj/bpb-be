const TRANSPORTER = {
  SERVICE: "gmail",
  HOST: "smtp.ethereal.email",
  PORT: 587,
};

const NOTIF_TYPE = {
  NEW_STAFF: "NEW_STAFF",
  UPON_CREATION: "UPON_CREATION",
  PASSWORD_RESET: "PASSWORD_RESET",
  PASSWORD_RESET_SUCCESS: "PASSWORD_RESET_SUCCESS",
  RELEASE_PERMIT: "RELEASE_PERMIT",
};

module.exports = {
  TRANSPORTER,
  NOTIF_TYPE,
};
