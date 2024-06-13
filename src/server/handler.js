const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const InputError = require("../exceptions/InputError");

async function postPredictHandler(req, res, next) {
  try {
    if (!req.file) {
      next(new InputError(`Terjadi kesalahan input: Tidak ada file.`));
    }
    const image = req.file.buffer;
    const { model } = req.app.locals;

    predictionResult = await predictClassification(model, image, next);
    if (!predictionResult) {
      return;
    }

    const { confidenceScore, label } = predictionResult;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      confidenceScore: confidenceScore,
      createdAt: createdAt,
    };

    await storeData(id, data);

    res.status(201).send({
      status: "success",
      message:
        confidenceScore > 99
          ? "Model is predicted successfully."
          : "Model is predicted successfully but under threshold. Please use the correct picture",
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = postPredictHandler;
