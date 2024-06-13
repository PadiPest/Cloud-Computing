const express = require("express");
const router = express.Router();
const multer = require("multer");
const postPredictHandler = require("../server/handler");

const upload = multer({ limits: { fileSize: 5242880 } });

router.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

router.post("/predict", upload.single("image"), (req, res, next) => {
  postPredictHandler(req, res, next);
});

module.exports = router;
