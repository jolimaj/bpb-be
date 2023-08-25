const Joi = require("joi");
const {
  APPLICATION_TYPES,
} = require("../../common/constant/business-permit-constant");

module.exports.validateSignature = {
  schema: Joi.object({
    applicantSignature: Joi.any()
      .meta({ swaggerType: "file" })
      .label("Applicant Signature")
      .required()
      .messages({
        "any.required":
          "{{#label}} is required! or Please check if file exists.",
        "string.empty": "{{#label}} cannot be empty!!",
      }),
  }),
  location: "files",
};
module.exports.validateSignatureApprover = {
  schema: Joi.object({
    signatureMTO: Joi.any()
      .meta({ swaggerType: "file" })
      .label("MTO Signature")
      .optional()
      .messages({
        "any.required":
          "{{#label}} is required! or Please check if file exists.",
        "string.empty": "{{#label}} cannot be empty!!",
      }),
    signatureBFP: Joi.any()
      .meta({ swaggerType: "file" })
      .label("BFP Signature")
      .optional()
      .messages({
        "any.required":
          "{{#label}} is required! or Please check if file exists.",
        "string.empty": "{{#label}} cannot be empty!!",
      }),
    signatureBPLO: Joi.any()
      .meta({ swaggerType: "file" })
      .label("BPLO Signature")
      .optional()
      .messages({
        "any.required":
          "{{#label}} is required! or Please check if file exists.",
        "string.empty": "{{#label}} cannot be empty!!",
      }),
  }),
  location: "file",
};

module.exports.validatePermit = {
  schema: Joi.object({
    paymentTypeID: Joi.number().label("Payment Type").required(),
    type: Joi.number().required(),
    applicantPosition: Joi.string()
      .label("Applicant Title/Position")
      .required(),
    dtiRegNo: Joi.number().label("DTI/SEC/CDA Registration No.").required(),
    dtiRegDate: Joi.date().label("DTI/SEC/CDA Registration Date.").required(),
    tinNo: Joi.number().label("Tin No.").required(),
    businessTypeID: Joi.number().label("Business Type").required(),
    enjoyTaxIncentive: Joi.boolean().label("Enjoy Tax Incentive").required(),
    notEnjoyTaxIncentive: Joi.string().when("enjoyTaxIncentive", {
      is: false,
      then: Joi.required(),
    }),
    taxPayerName: Joi.string().label("Tax Payer Name").required(),
    businessName: Joi.string().label("Business Name").required(),
    tradeFranchiseName: Joi.string().label("Trade/Franchise Name").required(),
    businessAddress: Joi.string().label("Business Address").required(),
    businessPostalCode: Joi.number().label("Business Postal Code").required(),
    businessTelephone: Joi.number()
      .label("Business Telephone Number")
      .required(),
    businessMobile: Joi.number().label("Business Mobile Number").required(),
    businessEmail: Joi.string().label("Business Email Address").required(),
    ownersAddress: Joi.string().label("Owners Address").required(),
    ownersPostalCode: Joi.number().label("Owners Postal Code").required(),
    ownersTelephone: Joi.number().label("Owners Telephone Number").required(),
    ownersMobile: Joi.number().label("Owners Mobile Number").required(),
    ownersEmail: Joi.string().label("Owners Email Address").required(),
    emergencyPerson: Joi.string().label("Emergency Contact Person").required(),
    emergencyAddress: Joi.string()
      .label("Emergency Contact Person Address")
      .required(),
    emergencyMobile: Joi.number()
      .label("Emergency Contact Person Mobile Number")
      .required(),
    businessArea: Joi.number().label("Business Area").required(),
    femaleEmployee: Joi.number().label("No. of Female Employee").required(),
    maleEmployee: Joi.number().label("No. of Male Employee").required(),
    lguEmployee: Joi.number()
      .label("No. of Employee  Residing within LGU")
      .required(),
    lessorName: Joi.string()
      .label("Lessor's Full Name:")
      .optional()
      .allow(null, ""),
    lessorAddress: Joi.string()
      .label("Lessor's Address")
      .optional()
      .allow(null, ""),
    lessorMobile: Joi.number()
      .label("Lessor's Mobile Number")
      .optional()
      .allow(null, ""),
    lessorEmail: Joi.string()
      .label("Lessor's Email Address")
      .optional()
      .allow(null, ""),
    buildingName: Joi.string()
      .label("Building Name")
      .optional()
      .allow(null, ""),
    buildingAddress: Joi.string()
      .label("Building Address")
      .optional()
      .allow(null, ""),
    monthlyRental: Joi.number()
      .label("Monthly Rental")
      .optional()
      .allow(null, ""),
    line1: Joi.string().label("First Line of Business").required(),
    units1: Joi.number().label("First No. of Units").optional().allow(null, ""),
    capital1: Joi.number().when("type", {
      is: APPLICATION_TYPES.NEW,
      then: Joi.number().required().label("First Capitalization"),
      otherwise: Joi.forbidden(),
    }),
    grossEssential1: Joi.number().when("type", {
      is: APPLICATION_TYPES.NEW,
      then: Joi.forbidden(),
      otherwise: Joi.number()
        .label("First Essential Gross")
        .optional()
        .allow(null, ""),
    }),

    grossNonEssential1: Joi.number().when("type", {
      is: APPLICATION_TYPES.NEW,
      then: Joi.forbidden(),
      otherwise: Joi.number()
        .label("First Non-Essential Gross")
        .optional()
        .allow(null, ""),
    }),
    line1: Joi.string().label("First Line of Business").required(),
    units1: Joi.number().label("First No. of Units").optional().allow(null, ""),
    capital1: Joi.number().label("First Capitalization").required(),
    grossEssential1: Joi.number()
      .label("First Essential Gross")
      .optional()
      .allow(null, ""),
    grossNonEssential1: Joi.number()
      .label("First Non-Essential Gross")
      .optional()
      .allow(null, ""),
    line2: Joi.string()
      .label("Second Line of Business")
      .optional()
      .allow(null, ""),
    units2: Joi.number()
      .label("Second No. of Units")
      .optional()
      .allow(null, ""),
    capital2: Joi.number()
      .label("Second Capitalization")
      .optional()
      .allow(null, ""),
    grossEssential2: Joi.number()
      .label("Second Essential Gross")
      .optional()
      .allow(null, ""),
    grossNonEssential2: Joi.number()
      .label("Second Non-Essential Gross")
      .optional()
      .allow(null, ""),
    line3: Joi.string()
      .label("Third Line of Business")
      .optional()
      .allow(null, ""),
    units3: Joi.number().label("Third No. of Units").optional().allow(null, ""),
    capital3: Joi.number()
      .label("Third Capitalization")
      .optional()
      .allow(null, ""),
    grossEssential3: Joi.number()
      .label("Third Essential Gross")
      .optional()
      .allow(null, ""),
    grossNonEssential3: Joi.number()
      .label("Third Non-Essential Gross")
      .optional()
      .allow(null, ""),
    line4: Joi.string()
      .label("Fourth Line of Business")
      .optional()
      .allow(null, ""),
    units4: Joi.number()
      .label("Fourth No. of Units")
      .optional()
      .allow(null, ""),
    capital4: Joi.number()
      .label("Fourth Capitalization")
      .optional()
      .allow(null, ""),
    grossEssential4: Joi.number()
      .label("Fourth Essential Gross")
      .optional()
      .allow(null, ""),
    grossNonEssential4: Joi.number()
      .label("Fourth Non-Essential Gross")
      .optional(),
    ownersName: Joi.string().label("Owner's Name").required(),
    ownersBusinessName: Joi.string().label("Business Name").required(),
    totalFloorArea: Joi.string().label("Total Floor Area").required(),
  }),
  location: "body",
};

module.exports.validateApprover = {
  schema: Joi.object({
    id: Joi.string().label("Business Permit APplication No").required(),
  }),
  location: "queryStringParameters",
};
