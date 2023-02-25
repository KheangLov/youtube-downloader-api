const express = require("express");
const expressSanitizer = require("express-sanitizer");
const cors = require("cors");
const yt = require("youtube-search-without-api-key");
const ytdl = require("ytdl-core");
const _ = require('lodash');
// const https = require("https");
// const fs = require("fs");

const app = express();
const youtubeUrl = "https://www.youtube.com/watch";

// const options = {
//   key: fs.readFileSync("./config/cert.key"),
//   cert: fs.readFileSync("./config/cert.crt"),
//   ca: fs.readFileSync("./config/ca.key"),
// };

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Mount express-sanitizer middleware here
app.use(expressSanitizer());
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// https.createServer(options, app).listen(3535, () => {
//   console.log(`HTTPS server started on port 3535`);
// });

app.get('/list', async (req, res) => {
  const { search } = req.query;
  const videos = await yt.search(search);
  console.log({ videos });
  res.json({ videos });
});

app.get("/mp3", async (req, res) => {
  try {
    const { videoId } = req.query;
    const url = `${youtubeUrl}?v=${videoId}`;

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

    title = encodeURIComponent(`${title}.mp3`);

    // res.setHeader('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    res.header("Content-Disposition", `attachment; filename=${title}`);    
    ytdl(url, {
      format: "mp3",
      filter: "audioonly",
      dlChunkSize: 5000000
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
  try {
    const { videoId } = req.query;
    const url = `${youtubeUrl}?v=${videoId}`;

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

    title = encodeURIComponent(`${title}.mp3`);

    // res.setHeader('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    res.header("Content-Disposition", `attachment; filename=${title}.mp4`);
    const video = ytdl(url, {
      format: "mp4",
      filter: 'audioandvideo',
      quality: 'highest',
      dlChunkSize: 5000000
    });
    video.pipe(res)
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "An error occured while processing this request.",
    });
  }
});
