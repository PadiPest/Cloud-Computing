const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

async function postUserData(userId, name, publicUrl) {
  const data = {
    userId: userId,
    name: name,
    pictureUrl: publicUrl,
  };

  const userCollection = db.collection("users");
  return userCollection.doc(userId).set(data);
}

async function getUserData(userId) {
  const userData = await db.collection("users").doc(userId).get();
  if (!userData.exists) {
    return;
  } else {
    return userData.data();
  }
}

async function editUserData(userId, data) {
  const checkData = await db.collection("users").doc(userId).get();
  if (!checkData.exists) {
    return;
  } else {
    return db.collection("users").doc(userId).update(data);
  }
}

module.exports = { postUserData, getUserData, editUserData };
