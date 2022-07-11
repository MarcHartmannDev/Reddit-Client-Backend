const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 4000;

app.use(cors());

app.listen(port, () => {
  console.log(`CORS-enabled Server started on port ${port}`);
});

console.log(process.env.SECRET_KEY);
