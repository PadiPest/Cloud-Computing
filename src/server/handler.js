const InputError = require("../exceptions/InputError");
const uploadImage = require("../services/uploadImage");
const {
  postUserData,
  getUserData,
  editUserData,
} = require("../services/storeData");

async function postProfileHandler(req, res, next) {
  try {
    if (!req.file) {
      next(new InputError("Input Error: Tidak ada foto."));
      return;
    }
    if (!req.body.userId || !req.body.name) {
      next(new InputError("Input Error: Data tidak lengkap."));
      return;
    }

    const image = req.file.buffer;
    const userId = req.body.userId;
    const name = req.body.name;

    const publicUrl = await uploadImage(image, userId, next);

    await postUserData(userId, name, publicUrl);

    res.status(201).send({
      status: "success",
      message: "User profile saved.",
    });
  } catch (err) {
    next(err);
  }
}

async function getProfileHandler(req, res, next) {
  try {
    const userId = req.params.userId;

    const data = await getUserData(userId);

    if (!data) {
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

async function editProfileHandler(req, res, next) {
  try {
    const userId = req.params.userId;
    if (!req.body.name && !req.file) {
      next(new InputError("Input Error: Tidak ada data yang diubah."));
      return;
    }

    let data;
    if (req?.file) {
      const image = req.file.buffer;
      const publicUrl = await uploadImage(image, userId, next);
      data = { ...data, pictureUrl: publicUrl };
    }
    if (req.body?.name) {
      const name = req.body.name;
      data = { ...data, name: name };
    }

    const check = await editUserData(userId, data);

    if (!check) {
      res.status(404).send({
        status: "fail",
        message: "User not exist",
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "User profile edited",
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { postProfileHandler, getProfileHandler, editProfileHandler };
