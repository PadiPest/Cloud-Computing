const { Firestore } = require("@google-cloud/firestore");

async function getUserData(userId) {
  const db = new Firestore();

  const userData = await db.collection("users").doc(userId).get();
  if (!userData.exists) {
    return undefined;
  } else {
    return userData.data();
  }
}

module.exports = getUserData;
