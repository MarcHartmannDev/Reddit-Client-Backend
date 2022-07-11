const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 4000;

app.use(cors());

const startpoint = "https://oauth.reddit.com";

app.get("/access_token", async (req, res, next) => {
  try {
    const requestToken = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      "grant_type=client_credentials",
      {
        auth: {
          username: process.env.APP_ID,
          password: process.env.SECRET_KEY,
        },
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

    res.status(200).json(requestToken.data);
  } catch (error) {
    res
      .status(error.response.status)
      .header(error.response.header)
      .json(error.response.data);
  }
});

app.get("/popular", async (req, res, next) => {
  try {
    const popular = await axios.get(
      `${startpoint}/subreddits/popular?limit=${req.query.limit}`,
      {
        headers: {
          Authorization: `Bearer ${req.query.token}`,
        },
      }
    );

    res.status(200).json(popular.data);
  } catch (error) {
    res
      .status(error.response.status)
      .header(error.response.header)
      .json(error.response.data);
  }
});

app.get("/hot", async (req, res, next) => {
  try {
    const top = await axios.get(`${startpoint}/hot`, {
      headers: {
        Authorization: `Bearer ${req.query.token}`,
      },
    });

    res.status(200).json(top.data);
  } catch (error) {
    res
      .status(error.response.status)
      .header(error.response.header)
      .json(error.response.data);
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const user = await axios.get(
      `${startpoint}/api/user_data_by_account_ids?ids=${req.query.user}`,
      {
        headers: {
          Authorization: `Bearer ${req.query.token}`,
        },
      }
    );

    res.status(200).json(user.data);
  } catch (error) {
    res
      .status(error.response.status)
      .header(error.response.header)
      .json(error.response.data);
    console.log(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`CORS-enabled Server started on port ${port}`);
});
