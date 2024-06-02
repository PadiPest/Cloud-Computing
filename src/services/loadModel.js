const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  return tf.loadGraphModel(
    "file://../vertex-model/2024-06-02T16$137$110.591089Z/model.json"
  );
}

module.exports = loadModel;
