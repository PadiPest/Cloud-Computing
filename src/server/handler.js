const InputError = require("../exceptions/InputError");
const uploadImage = require("../services/uploadImage");
const storeData = require("../services/storeData");
const getUserData = require("../services/getUserData");

async function postUploadHandler(req, res, next) {
  try {
    if (!req.file) {
      next(new InputError(`Terjadi kesalahan input: Tidak ada file.`));
    }
    const image = req.file.buffer;
    const userId = req.body.userId;
    const name = req.body.name;

    const publicUrl = await uploadImage(image, userId, next);

    await storeData(userId, name, publicUrl);

    res.status(201).send({
      status: "success",
      message: "User profile saved.",
    });
  } catch (err) {
    next(err);
  }
}

async function postProfileHandler(req, res, next) {
  try {
    const userId = req.params.userId;

    const data = await getUserData(userId);

    if (data === undefined) {
      res.status(404).send({
        status: "fail",
        message: "User not found.",
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "User data found.",
        data,
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { postUploadHandler, postProfileHandler };
