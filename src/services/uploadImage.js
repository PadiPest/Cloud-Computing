const { Storage } = require("@google-cloud/storage");
const UploadError = require("../exceptions/UploadError");

function formatDate() {
  const fullDate = new Date();
  const year = fullDate.getFullYear().toString();
  let month = (fullDate.getMonth() + 1).toString();
  let date = fullDate.getDate().toString();

  let hour = fullDate.getHours().toString();
  let minute = fullDate.getMinutes().toString();
  let second = fullDate.getSeconds().toString();

  month = month.length < 2 ? "0" + month : month;
  date = date.length < 2 ? "0" + date : date;

  hour = hour.length < 2 ? "0" + hour : hour;
  minute = minute.length < 2 ? "0" + minute : minute;
  second = second.length < 2 ? "0" + second : second;

  return year + month + date + "-" + hour + minute + second;
}

async function uploadImage(image, userId, next) {
  const storage = new Storage();
  const bucket = storage.bucket(process.env.BUCKET_NAME);

  const prefix = `users/${userId}`;
  const [files] = await bucket.getFiles({ prefix });

  const firstFilter = files.filter((file) =>
    file.name.startsWith(`users/${userId}/profile-picture`)
  );
  const secondFilter = firstFilter.filter((file) => file.name.endsWith(".jpg"));

  if (secondFilter.length > 0) {
    for (const file of secondFilter) {
      await file.delete();
    }
  }

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
