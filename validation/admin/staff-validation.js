const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { REGULAR_EXPRESSION } = require("../../common/constant/regexer");

module.exports.validateStaff = {
  schema: Joi.object({
    roleID: Joi.number().required(),
    departmentID: Joi.number().required(),
    fName: Joi.string()
      .label("First Name")
      .pattern(REGULAR_EXPRESSION.NAME)
      .required(),
    mName: Joi.string()
      .pattern(REGULAR_EXPRESSION.NAME)
      .label("Middle Name")
      .optional()
      .allow(""),
    lName: Joi.string()
      .pattern(REGULAR_EXPRESSION.NAME)
      .label("Last Name")
      .required(),
    mobile: Joi.string()
      .pattern(REGULAR_EXPRESSION.MOBILE)
      .label("Mobile Number")
      .required(),
    email: Joi.string().email().trim(true).label("Email Address").required(),
  }),
  location: "body",
};

module.exports.validatePassword = {
  schema: Joi.object({
    password: passwordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 6,
    }).required(),
  }),
  location: "body",
};

module.exports.validateStaffID = {
  schema: Joi.object({
    id: Joi.number().required(),
    notifParamsId: Joi.string().required(),
  }),
  location: "params",
};
