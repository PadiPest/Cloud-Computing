const express = require("express");
const router = express.Router();
const multer = require("multer");
const { postUploadHandler, postProfileHandler } = require("../server/handler");

const upload = multer({ limits: { fileSize: 10485760 } });

router.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

router.post("/upload", upload.single("image"), (req, res, next) => {
  postUploadHandler(req, res, next);
});

router.get("/profile/:userId", (req, res, next) => {
  postProfileHandler(req, res, next);
});

module.exports = router;
