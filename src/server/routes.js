const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postProfileHandler,
  getProfileHandler,
  editProfileHandler,
} = require("../server/handler");

const upload = multer({ limits: { fileSize: 10485760 } });

router.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

router.post("/profiles", upload.single("image"), (req, res, next) => {
  postProfileHandler(req, res, next);
});

router.get("/profiles/:userId", (req, res, next) => {
  getProfileHandler(req, res, next);
});

router.put("/profiles/:userId", upload.single("image"), (req, res, next) => {
  editProfileHandler(req, res, next);
});

module.exports = router;
