const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const { storeData, getHistories } = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };
    await storeData(id, data);
    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (err) {
    console.error("Error dalam prediksi:", err);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
}

async function getPredictHandler(request, h) {
  try {
    const histories = await getHistories();
    const response = h.response({
      status: "success",
      data: histories,
    });
    response.code(200);
    return response;
  } catch (err) {
    console.error("Error dalam mengambil data:", err);
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam mengambil data",
    });
    response.code(400);
    return response;
  }
}

module.exports = { postPredictHandler, getPredictHandler };
