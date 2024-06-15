const { Storage } = require("@google-cloud/storage");
const UploadError = require("../exceptions/UploadError");

function formatDate() {
  const fullDate = new Date();
  const year = fullDate.getFullYear().toString();
  let month = (fullDate.getMonth() + 1).toString();
  let date = fullDate.getDate().toString();

  month = month.length < 2 ? "0" + month : month;
  date = date.length < 2 ? "0" + date : date;

  return year + month + date;
}

async function uploadImage(image, userId, next) {
  const storage = new Storage();
  const bucket = storage.bucket(process.env.BUCKET_NAME);

  const date = formatDate();
  const fileName = `profile-picture-${date}.jpg`;
  const file = bucket.file(`users/${userId}/${fileName}`);

  file
    .createWriteStream({ resumable: false })
    .on("error", (err) => {
      next(new UploadError(err.message));
    })
    .on("finish", async () => {
      try {
        await file.makePublic();
      } catch (err) {
        next(err);
      }
    })
    .end(image);

  const publicUrl = file.publicUrl();
  return publicUrl;
}

module.exports = uploadImage;
