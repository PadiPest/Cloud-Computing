const { Firestore } = require("@google-cloud/firestore");

async function storeData(userId, name, publicUrl) {
  const db = new Firestore();

  const data = {
    userId: userId,
    name: name,
    pictureUrl: publicUrl,
  };

  const userCollection = db.collection("users");
  return userCollection.doc(userId).set(data);
}

module.exports = storeData;
