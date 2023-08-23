const {
  APPLICATION_TYPES,
  DEPARTMENT_ID,
} = require("../constant/business-permit-constant");

class BusinessPermitMapper {
  basicInfo(payload) {
    return {
      businessPermitID: payload?.id,
      dateOfApplication: payload?.dateOfApplication,
      dtiRegNo: payload?.dtiRegNo,
      dtiRegDate: payload?.dtiRegDate,
      tinNo: payload?.tinNo,
      businessTypeID: payload?.businessTypeID,
      enjoyTaxIncentive: payload?.enjoyTaxIncentive,
      notEnjoyTaxIncentive: payload?.notEnjoyTaxIncentive, // optional must be fill when enjoyTaxIncentive is no
      taxPayerName: payload?.taxPayerName, // tax Payer
      businessName: payload?.businessName,
      tradeFranchiseName: payload?.tradeFranchiseName,
    };
  }

  otherInfo(payload) {
    return {
      businessPermitID: payload?.id,
      businessAddress: payload?.businessAddress,
      businessPostalCode: parseInt(payload?.businessPostalCode),
      businessTelephone: parseInt(payload?.businessTelephone),
      businessMobile: parseInt(payload?.businessMobile),
      businessEmail: payload?.businessEmail, // optional
      ownersAddress: payload?.businessAddress,
      ownersPostalCode: parseInt(payload?.ownersPostalCode),
      ownersTelephone: parseInt(payload?.ownersTelephone),
      ownersMobile: parseInt(payload?.ownersMobile),
      ownersEmail: payload?.ownersEmail, // optional
      emergencyPerson: payload?.emergencyPerson,
      emergencyAddress: payload?.emergencyAddress,
      emergencyMobile: parseInt(payload?.emergencyMobile),
      businessArea: parseInt(payload?.businessArea),
      femaleEmployee: parseInt(payload?.femaleEmployee),
      maleEmployee: parseInt(payload?.maleEmployee),
      lguEmployee: parseInt(payload?.lguEmployee),
      lessorName: payload?.lessorName ?? null, //null when not rented
      lessorAddress: payload?.lessorAddress ?? null,
      lessorMobile: parseInt(payload?.lessorMobile) ?? 0,
      lessorEmail: payload?.lessorEmail ?? null,
      buildingName: payload?.buildingName ?? null,
      buildingAddress: payload?.buildingAddress ?? null,
      monthlyRental: parseFloat(payload?.monthlyRental) ?? 0,
    };
  }

  businessActivity(payload) {
    const one = {
      businessPermitID: payload?.id,
      lineOfBusiness: payload?.line1,
      noOfUnits: payload?.unit1,
      capitalization: payload?.capital1,
      essentialGross: payload?.grossEssential1,
      nonEssentialGross: payload?.grossNonEssential1,
    };
    const two = {
      businessPermitID: payload?.id,
      lineOfBusiness: payload?.line2,
      noOfUnits: payload?.unit2,
      capitalization: payload?.capital2,
      essentialGross: payload?.grossEssential2,
      nonEssentialGross: payload?.grossNonEssential2,
    };
    const three = {
      businessPermitID: payload?.businessPermitID,
      lineOfBusiness: payload?.line3,
      noOfUnits: payload?.unit3,
      capitalization: payload?.capital3,
      essentialGross: payload?.grossEssential3,
      nonEssentialGross: payload?.grossNonEssential3,
    };
    const four = {
      businessPermitID: payload?.businessPermitID,
      lineOfBusiness: payload?.line4,
      noOfUnits: payload?.unit4,
      capitalization: payload?.capital4,
      essentialGross: payload?.grossEssential4,
      nonEssentialGross: payload?.grossNonEssential4,
    };
    return [one, two, three, four];
  }
  bfpForm(payload) {
    return {
      businessPermitID: payload?.id,
      ownersName: payload?.ownersName,
      businessName: payload?.ownersBusinessName,
      totalFloorArea: payload?.totalFloorArea,
    };
  }

  apply(payload) {
    return {
      userID: payload?.userID,
      paymentTypeID: payload?.paymentTypeID,
      type: payload?.type, //1 new 2 renewal
      assignedToDepartmentID:
        payload?.type === APPLICATION_TYPES.NEW
          ? DEPARTMENT_ID.MPDC
          : DEPARTMENT_ID.BPLO,
      applicantSignature: payload?.applicantSignature,
      applicantPosition: payload?.applicantPosition,
    };
  }
}
module.exports = { BusinessPermitMapper };
