require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const cors = require("cors");
const { okResp, errResp } = require("./helpers/response/response-helper");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: [
      "X-Set-Cookie",
      //...
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "bpb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);
// if (process.env.NODE_ENV === "production") {
app.set("trust proxy", 1);
//   sess.cookie.secure = true;
// }
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
