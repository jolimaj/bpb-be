const {
  validateRegister,
  validateLogin,
  validateUserID,
} = require("./users/users-validation");
const {
  validateStaff,
  validatePassword,
  validateStaffID,
} = require("./admin/staff-validation");
const {
  validatePermit,
  validateSignature,
  validateSignatureApprover,
  validateApprover,
} = require("./users/business-permit");

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
  validateStaff: (req, res, next) =>
    schemaValidate(validateStaff, req, res, next),
  validatePassword: (req, res, next) =>
    schemaValidate(validatePassword, req, res, next),
  validateStaffID: (req, res, next) =>
    schemaValidate(validateStaffID, req, res, next),
  validatePermit: (req, res, next) =>
    schemaValidate(validatePermit, req, res, next),
  validateSignature: (req, res, next) =>
    schemaValidate(validateSignature, req, res, next),
  validateSignatureApprover: (req, res, next) =>
    schemaValidate(validateSignatureApprover, req, res, next),
  validateApprover: (req, res, next) =>
    schemaValidate(validateApprover, req, res, next),
};

module.exports = validate;
