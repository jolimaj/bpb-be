const { PDFDocument, StandardFonts, getStringWidth } = require("pdf-lib");
const pdfFile = process.env.PDF_CERTIFICATE;
const { UploaderService } = require("./uploader");

class PDFAttach {
  constructor() {
    this.uploaderService = new UploaderService();
  }

  async createPDF(payload) {
    const existingPdfBytes = await fetch(pdfFile).then((res) =>
      res.arrayBuffer()
    );

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    firstPage.drawText(`${payload?.businessName}`, {
      x: (firstPage.getWidth() - payload?.businessName.length * (26 / 2)) / 2,
      y: height - 265,
      size: 26,
      font: helveticaFont,
      center: 1,
    });
    const subTitle = `${payload?.firstName} ${payload?.middleName} ${payload?.lastName}`;
    firstPage.drawText(subTitle, {
      x: (firstPage.getWidth() - subTitle.length * (20 / 2)) / 2,
      y: height - 285,
      size: 20,
      font: helveticaFont,
      center: 1,
    });
    const address = payload?.businessAddress;
    firstPage.drawText(address, {
      x: (firstPage.getWidth() - address.length * (20 / 2)) / 2,
      y: height - 300,
      size: 18,
      font: helveticaFont,
      center: 1,
    });
    const date = payload?.approvedDate;
    firstPage.drawText(date, {
      x: 55,
      y: height - 375,
      size: 12,
      font: helveticaFont,
      left: 0,
    });
    const filesPDF = await pdfDoc.save();

    const record = await this.uploaderService.uploadFiles(
      {
        fieldname: "locationalClearance",
        originalname: `${payload?.firstName}${payload?.lastName}-BPLOPermit.pdf`,
        encoding: "7bit",
        mimetype: "application/pdf",
        buffer: new Buffer.from(filesPDF),
        size: 194525,
      },
      `permit/${payload?.id}`
    );
    return record;
  }
}
module.exports = { PDFAttach };
