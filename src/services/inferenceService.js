const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image, next) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([256, 256])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Bacterialblight", "Blast", "Brownspot", "Tungro"];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    return { confidenceScore, label };
  } catch (err) {
    next(new InputError(`Terjadi kesalahan input: ${err.message}`));
  }
}

module.exports = predictClassification;
