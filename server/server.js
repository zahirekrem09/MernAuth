const express = require("express");
const cors = require("cors");
const connectDatabase = require("./helpers/db/connectDatabase");
const customErrorHandler = require("./middlewares/error/customErrorHandler");
require("dotenv").config();
const router = require("./routes/router");
//db Connect
connectDatabase();
// create express app
const app = express();
//cors midd.
app.use(cors());
//Express Body Parser midd.
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api", router);

//Error Handler
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`App started on ${PORT} - ${process.env.NODE_ENV}`);
});
