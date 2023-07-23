class UserMapper {
  createUser(payload) {
    return {
      roleID: payload?.roleID,
      firstName: payload?.fName,
      middleName: payload?.mName,
      lastName: payload?.lName,
      email: payload?.email,
      mobile: payload?.phone,
    };
  }
}

module.exports = { UserMapper };
