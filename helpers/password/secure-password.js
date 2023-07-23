const bcrypt = require("bcrypt");

class SecurePassword {
  constructor() {}

  encryptPassword(password) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  }

  decryptPassword(password, encrypted) {
    const unhashedPassword = bcrypt.compareSync(password, encrypted);
    return unhashedPassword;
  }
}

module.exports = { SecurePassword };
