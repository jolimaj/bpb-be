const responseModel = require("./model");

const Response = {
  okResp: (status, code, data) => {
    return new responseModel.SuccessResp(status, code, data);
  },
  errResp: (status, code, message) => {
    return new responseModel.ErrorResp(status, code, message);
  },
  validationErr: (status, code, errors) => {
    if (errors === null || errors === undefined) {
      throw new Error("Cant Create validation resp with empty errors");
    }
    if (Array.isArray(errors)) {
      const errList = errors.map(
        (e) => new responseModel.FieldError(e.field, e.message)
      );
      return new responseModel.ValidationErrResp(status, code, errList);
    } else {
      return new responseModel.ValidationErrResp(status, code, [
        new responseModel.FieldError(errors.field, errors.message),
      ]);
    }
  },
};

module.exports = Response;
