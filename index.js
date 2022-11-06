const express = require("express");
const cors = require("cors");
const yt = require("youtube-search-without-api-key");
const ytdl = require("ytdl-core");
const _ = require('lodash');

const app = express();

app.use(cors({
  origin: true, // "true" will copy the domain of the request back
                // to the reply. If you need more control than this
                // use a function.

  credentials: true, // This MUST be "true" if your endpoint is
                     // authenticated via either a session cookie
                     // or Authorization header. Otherwise the
                     // browser will block the response.

  methods: 'POST,GET,PUT,OPTIONS,DELETE' // Make sure you're not blocking
                                         // pre-flight OPTIONS requests
}));

app.listen(3000);

app.get('/list', async (req, res) => {
  const { search } = req.query;
  const videos = await yt.search(search);
  res.json({ videos });
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

    title = encodeURIComponent(`${title}.mp3`);

    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    res.header("Content-Disposition", `attachment; filename=${title}`);    
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

    title = encodeURIComponent(`${title}.mp3`);

    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    res.header("Content-Disposition", `attachment; filename=${title}.mp4`);
    const video = ytdl(url, {
      format: "mp4",
      filter: 'audioandvideo',
      quality: 'highest' 
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

const log = (...msg) => {
  console.log(msg);
};