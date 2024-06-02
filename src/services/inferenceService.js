const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    console.log(prediction);
    const score = await prediction.data();
    console.log(score);
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Bacterialblight", "Blast", "Brownspot", "Tungro"];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    return { confidenceScore, label };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
