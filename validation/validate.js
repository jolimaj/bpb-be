const {
  validateRegister,
  validateLogin,
  validateUserID,
} = require("./users/users-validation");

function schemaValidate(template, req, res, next) {
  try {
    const validate = template.schema.validate(req[template.location]);
    if (validate.error) {
      return res.status(400).json({
        error: validate.error.details.map((e) => e.message.replace(/"/gim, "")),
      });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: e.toString(),
    });
  }
}

const validate = {
  validateRegister: (req, res, next) =>
    schemaValidate(validateRegister, req, res, next),
  validateLogin: (req, res, next) =>
    schemaValidate(validateLogin, req, res, next),
  validateUserID: (req, res, next) =>
    schemaValidate(validateUserID, req, res, next),
};

module.exports = validate;
