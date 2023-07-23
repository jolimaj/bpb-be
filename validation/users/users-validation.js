const Joi = require("joi");
const { REGULAR_EXPRESSION } = require("../../common/constant/regexer");

module.exports.validateRegister = {
  schema: Joi.object({
    roleID: Joi.number().required(),
    fName: Joi.string().pattern(REGULAR_EXPRESSION.NAME).required(),
    mName: Joi.string().pattern(REGULAR_EXPRESSION.NAME).optional(),
    lName: Joi.string().pattern(REGULAR_EXPRESSION.NAME).required(),
    mobile: Joi.string().pattern(REGULAR_EXPRESSION.MOBILE).required(),
    email: Joi.string().email().trim(true).required(),
    password: Joi.string()
      .min(8)
      .pattern(REGULAR_EXPRESSION.PASSWORD)
      .required(),
  }),
  location: "body",
};

module.exports.validateLogin = {
  schema: Joi.object({
    email: Joi.string().email().trim(true).required(),
    password: Joi.string()
      .min(8)
      .pattern(REGULAR_EXPRESSION.PASSWORD)
      .required(),
  }),
  location: "body",
};
