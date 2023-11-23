const QRCode = require("qrcode");
const { UploaderService } = require("./uploader");

class QRCodeService {
  constructor() {
    this.uploaderService = new UploaderService();
  }
  async generate(payload) {
    const text = `Name: ${payload?.firstName} ${payload?.middleName} ${payload?.lastName}
       Business Name: ${payload?.businessName}
       Business Address: ${payload?.businessAddress}`;

    const imageQR = QRCode.toString(
      text,
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      function (err, data) {
        if (err) throw err;
        console.log(data);
      }
    );

    const record = await this.uploaderService.uploadFiles(
      {
        fieldname: "qrCode",
        originalname: `${payload?.firstName}${payload?.lastName}-QRCode.svg`,
        encoding: "7bit",
        mimetype: "application/pdf",
        buffer: new Buffer.from(imageQR),
        size: 194525,
      },
      `qrCode/${payload?.id}`
    );
    return record;
  }
}
module.exports = { QRCodeService };
