const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { REGULAR_EXPRESSION } = require("../../common/constant/regexer");

module.exports.validateRegister = {
  schema: Joi.object({
    roleID: Joi.number().required(),
    fName: Joi.string()
      .label("First Name")
      .pattern(REGULAR_EXPRESSION.NAME)
      .required(),
    mName: Joi.string()
      .pattern(REGULAR_EXPRESSION.NAME)
      .label("Middle Name")
      .optional(),
    lName: Joi.string()
      .pattern(REGULAR_EXPRESSION.NAME)
      .label("Last Name")
      .required(),
    mobile: Joi.string()
      .pattern(REGULAR_EXPRESSION.MOBILE)
      .label("Mobile Number")
      .required()
      .messages({
        "*": "{mobile} Incorrect mobile number format",
      }),
    email: Joi.string().email().trim(true).label("Email Address").required(),
    isActive: Joi.boolean().optional(),
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

module.exports.validateLogin = {
  schema: Joi.object({
    email: Joi.string().email().trim(true).required(),
    password: Joi.string().min(8).required(),
  }),
  location: "body",
};

module.exports.validateEmail = {
  schema: Joi.object({
    email: Joi.string().email().trim(true).required(),
  }),
  location: "body",
};
