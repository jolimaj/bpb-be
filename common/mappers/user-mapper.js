const { SecurePassword } = require("../../helpers/password/secure-password");
class UserMapper {
  #securePassword;

  constructor() {
    this.#securePassword = new SecurePassword();
  }
  createUser(payload) {
    return {
      roleID: payload?.roleID,
      firstName: payload?.fName,
      middleName: payload?.mName,
      lastName: payload?.lName,
      email: payload?.email,
      mobile: payload?.phone,
      password: this.#securePassword.encryptPassword(payload?.password),
      isActive: payload?.isActive,
    };
  }
}

module.exports = { UserMapper };
