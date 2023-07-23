class HttpResp {
  constructor(status, code) {
    this.status = status;
    this.code = code;
  }

  toJson() {
    return JSON.stringify(this);
  }
}

class SuccessResp extends HttpResp {
  constructor(status, code, data) {
    super(status, code);
    this.data = data;
  }
}

class ErrorResp extends HttpResp {
  constructor(status, code, message) {
    super(status, code);
    this.error = new Error(message);
  }
}

class ValidationErrResp extends HttpResp {
  constructor(status, code, _errors) {
    super(status, code);
    this.error = _errors;
  }
}

class Error {
  constructor(_message) {
    this.message = _message;
  }
}

class FieldError extends Error {
  constructor(_field, _message) {
    super(_message);
    this.field = _field;
  }
}

module.exports = {
  SuccessResp: SuccessResp,
  ErrorResp: ErrorResp,
  ValidationErrResp: ValidationErrResp,
  FieldError: FieldError,
};
