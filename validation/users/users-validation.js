const Joi = require("joi");
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
      .required(),
    email: Joi.string().email().trim(true).label("Email Address").required(),
    isActive: Joi.boolean().optional(),
    password: Joi.string()
      .label("Password")
      .min(8)
      .pattern(REGULAR_EXPRESSION.PASSWORD)
      .required()
      .options({ messages: { "any.only": "{{#label}} does not match sd" } }),
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
