const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

async function storeData(id, data) {
  const predictCollection = db.collection("predictions");
  return predictCollection.doc(id).set(data);
}

async function getHistories() {
  const predictCollection = db.collection("prediction");
  const snapshot = await predictCollection.get();

  if (snapshot.empty) {
    return "collection not found";
  }

  let histories = [];
  snapshot.forEach((doc) => {
    console.log("history:", doc.id, doc.data());
    histories.push(doc.data());
  });
  return histories;
}
module.exports = { storeData, getHistories };
