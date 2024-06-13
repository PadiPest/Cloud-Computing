require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const loadModel = require("../services/loadModel");
const routes = require("../server/routes");
const InputError = require("../exceptions/InputError");

(async () => {
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  const port = process.env.PORT || 8080;

  const model = await loadModel();
  app.locals.model = model;

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", routes);

  app.use((err, req, res, next) => {
    if (err instanceof InputError) {
      res.status(err.statusCode).send({
        status: "fail",
        message: `${err.message}. Silakan gunakan foto lain.`,
      });
    } else if (err.message === "File too large") {
      res.status(413).send({
        status: "fail",
        message: err.message,
      });
    } else {
      res.status(500).send({
        status: "fail",
        message: `Error: ${err.message}`,
      });
    }
  });

  app.listen(port, () => {
    console.log(`Server start at: http://${host}:${port}`);
  });
})();
