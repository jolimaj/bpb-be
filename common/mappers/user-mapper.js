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
      mobile: payload?.mobile,
      password: this.#securePassword.encryptPassword(payload?.password),
      isActive: payload?.isActive,
    };
  }
  createStaff(payload) {
    return {
      roleID: 3,
      departmentID: payload?.departmentID,
      firstName: payload?.fName,
      middleName: payload?.mName,
      lastName: payload?.lName,
      email: payload?.email,
      mobile: payload?.mobile,
      isActive: false,
    };
  }
  createStaffPassword(payload) {
    return {
      password: this.#securePassword.encryptPassword(payload?.password),
      isActive: true,
    };
  }
}

module.exports = { UserMapper };
