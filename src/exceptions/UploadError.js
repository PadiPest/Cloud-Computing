const ClientError = require("../exceptions/ClientError");

class UploadError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "UploadError";
  }
}

module.exports = UploadError;
