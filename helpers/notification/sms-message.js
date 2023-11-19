const {
  NOTIF_TYPE,
  APPLICATION_TYPES,
  DEPARTMENT_ID,
} = require("../../common/constant/business-permit-constant");

class SMSHelper {
  message(department, type) {
    if (type === APPLICATION_TYPES.NEW) {
      return this.#news(department);
    }
    return this.#renew(department);
  }
  #renew(department) {
    let message;
    switch (department) {
      case DEPARTMENT_ID.BPLO:
        message = "Business permit licensing office";
        break;
      case DEPARTMENT_ID.MTO:
        message = "Municipal Treasurer's office";
        break;
      case DEPARTMENT_ID.SANIDAD:
        message = "Municipal Health Office (Sanitation)";
        break;
      case DEPARTMENT_ID.BFP:
        message = "Bureu of Fire Protection";
        break;
      default:
        break;
    }
    return `${this.#forwardedRENEW(department, message)}
    
    Best Regards,
    BPB-SARIAYA QUEZON`;
  }

  #news(department) {
    let message;
    switch (department) {
      case DEPARTMENT_ID.MPDC:
        message = "Municipal Planning and Development Coordinator";
        break;
      case DEPARTMENT_ID.BPLO:
        message = "Business permit licensing office";
        break;
      case DEPARTMENT_ID.MTO:
        message = "Municipal Treasurer's office";
        break;
      case DEPARTMENT_ID.SANIDAD:
        message = "Municipal Health Office (Sanitation)";
        break;
      case DEPARTMENT_ID.MEO:
        message = "Municipal Engineering Office";
        break;
      case DEPARTMENT_ID.MENRO:
        message = "Municipal Environmental and Natural Resources Office";
        break;
      case DEPARTMENT_ID.BFP:
        message = "Bureu of Fire Protection";
        break;
      default:
        break;
    }
    return `${this.#forwardedNEW(department, message)}
    
    Best Regards,
    BPB-SARIAYA QUEZON`;
  }

  #forwardedNEW(department, name, status) {
    if (status === 1) {
      return `We wanted to inform you that  your application  are currently approved ${name}.
      You can get your Business Permit copy together with QR Code and Queueing  Number in your email address.`;
    }

    if (status === -1) {
      return `We regret to inform you that your application was rejected by ${name}.`;
    }

    if (department === DEPARTMENT_ID.MPDC) {
      return `We wanted to inform you that we have received your application and are currently in the process of reviewing under ${name}.
      Rest assured that we will notify you of the outcome as soon as the review process is complete.`;
    }

    return `We hope this message finds you well. We wanted to inform you that your application are currently in the process of reviewing under ${name}.
    Rest assured that we will notify you of the outcome as soon as the review process is complete.`;
  }

  #forwardedRENEW(name, status) {
    if (status === 3) {
      return `We wanted to inform you that  your application  are currently approved ${name}.
      You can get your Business Permit copy together with QR Code and Queueing  Number in your email address.`;
    }

    if (status === -1) {
      return `We regret to inform you that your renewal was rejected by ${name}.`;
    }
    return `We hope this message finds you well. We wanted to inform you that your renewal are currently in the process of reviewing under ${name}.
    Rest assured that we will notify you of the outcome as soon as the review process is complete.`;
  }
}
module.exports = { SMSHelper };
