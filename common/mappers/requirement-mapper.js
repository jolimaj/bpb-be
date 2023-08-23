class RequirementsMapper {
  submit(payload) {
    return {
      businessPermitID: payload.id,
      brgyBusinessClearance: payload.brgyBusinessClearance,
      dtiReg: payload.dtiReg,
      locationalClearance: payload.locationalClearance,
      leaseContract: payload.leaseContract, //optional
      picture: payload.picture,
      certOfCompliance: payload.certOfCompliance,
      nationalAgencyAccredetation: payload.nationalAgencyAccredetation, //optional
      marketClearance: payload.marketClearance, //optional
      homeOwnersClearance: payload.homeOwnersClearance, //optional
      cedula: payload.cedula,
      buidingpermit: payload.buidingpermit,
      sanityPermit: payload.sanityPermit,
      menroCert: payload.menroCert,
      fireSafetyCert: payload.fireSafetyCert,
    };
  }
}

module.exports = { RequirementsMapper };
