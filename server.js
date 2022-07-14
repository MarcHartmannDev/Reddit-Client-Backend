const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const checkToken = async (req, res, next) => {
  if (!process.env.TOKEN) {
    try {
      const newToken = await axios.post(
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

      process.env.TOKEN = newToken.data.access_token;

      setTimeout(() => {
        process.env.TOKEN = "";
      }, newToken.data.expires_in * 1000);
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

app.use(cors());
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
  )
);
app.use(checkToken);

const startpoint = "https://oauth.reddit.com";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/popular", async (req, res) => {
  try {
    const popular = await axios.get(
      `${startpoint}/subreddits/popular?limit=${req.query.limit}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
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

app.get("/api/hot", async (req, res) => {
  try {
    const top = await axios.get(`${startpoint}/hot?geo_filter=DE`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
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

app.get("/api/user", async (req, res) => {
  try {
    const user = await axios.get(
      `${startpoint}/api/user_data_by_account_ids?ids=${req.query.user}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
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

app.get("/api/comments", async (req, res) => {
  axios
    .get(`${startpoint}/comments?article=${req.query.article}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    })
    .then((response) => {
      res.status(200).json(response.data.data.children);
    })
    .catch((err) => {
      res
        .status(err.response.status)
        .header(err.response.header)
        .json(err.response.data);
    });
});

app.listen(port, () => {
  console.log(`CORS-enabled Server started on port ${port}`);
});
