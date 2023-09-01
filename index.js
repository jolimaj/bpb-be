require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const cors = require("cors");
const { okResp, errResp } = require("./helpers/response/response-helper");

const app = express();
app.use(bodyParser.json());

//session middleware
app.use(
  sessions({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "keyboard cat",
  })
);

app.use(cookieParser());

app.use(cors({ credentials: true, origin: process.env.API_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.success = (status, responseCodes, data) => {
    const output = okResp(status, responseCodes, data);
    res.status(status).json(output);
  };
  res.error = (status, responseCodes, data) => {
    const output = errResp(status, responseCodes, data);
    res.status(status).json(output);
  };
  next();
});

app.use("/", require("./routes"));

app.use("*", (req, res) => {
  res.status(404).send("Not Found.");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
