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
      let b64, dataURI, group, res;
      if (file.length > 0) {
        res = await Promise.all(
          file.map(async (item) => {
            console.log(
              "🚀 ~ file: uploader.js:24 ~ UploaderService ~ file.map ~ item:",
              item
            );
            b64 = Buffer.from(item.buffer).toString("base64");
            dataURI = "data:" + item.mimetype + ";base64," + b64;
            group = item.fieldname;
            const { folder, secure_url } = await cloudinary.uploader.upload(
              dataURI,
              {
                folder: item.fieldname,
              }
            );
            return { folder, secure_url };
          })
        );
      } else {
        b64 = Buffer.from(file.buffer).toString("base64");
        dataURI = "data:" + file.mimetype + ";base64," + b64;
        const data = await cloudinary.uploader.upload(dataURI, {
          folder,
        });
        res = data.secure_url;
      }

      return res;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UploaderService };
