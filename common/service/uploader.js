const cloudinary = require("cloudinary").v2;

class UploaderService {
  #cloudinaryConfig;

  constructor() {
    this.#cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
  }

  async uploadFiles(file, folder) {
    cloudinary.config(this.#cloudinaryConfig);
    try {
      if (!file) {
        return null;
      }
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      const res = await cloudinary.uploader.upload(dataURI, {
        folder,
      });
      return res.secure_url;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UploaderService };
