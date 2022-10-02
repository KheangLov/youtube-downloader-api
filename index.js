const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const _ = require('lodash');

const PORT = 9090;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log("Server running at http://localhost:", PORT);
});

app.get("/mp3", async (req, res) => {
  try {
    const { url } = req.query;

    if (!ytdl.validateURL(url)) {
      return res.status(400).send({
        status: "failed",
        message: "Invalid url",
      });
    }

    let title = "audio";

    const info = await ytdl.getInfo(url);
    if (!_.isEmpty(info)) {
      title = info.videoDetails.title;
    }

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(url, {
      format: "mp3",
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "An error occured while processing this request.",
    });
  }
});

app.get("/mp4", async (req, res) => {
  log("Url: ", req.query.url);
  try {
    let url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send({
        status: "failed",
        message: "Invalid url",
      });
    }

    let title = "video";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (_, info) => {
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(url, { format: "mp4" }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "An error occured while processing this request.",
    });
  }
});

const log = (...msg) => {
  console.log(msg);
};