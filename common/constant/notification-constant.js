const TRANSPORTER = {
  SERVICE: "gmail",
  HOST: "smtp.ethereal.email",
  PORT: 587,
};

const NOTIF_TYPE = {
  NEW_STAFF: "NEW_STAFF",
  UPON_CREATION: "UPON_CREATION",
  PASSWORD_RESET: "PASSWORD_RESET",
};

module.exports = {
  TRANSPORTER,
  NOTIF_TYPE,
};
