import express from "express";
import fetch from "node-fetch";

const app = express();

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/captions", async (req, res) => {
  try {
    const v = req.query.v;
    const lang = req.query.lang;
    const type = req.query.type;
    if (!v) return res.status(400).send("Missing v");

    let url;
    if (type === "list") {
      url = `https://video.google.com/timedtext?type=list&v=${v}`;
    } else {
      if (!lang) return res.status(400).send("Missing lang");
      url = `https://video.google.com/timedtext?lang=${lang}&v=${v}`;
    }

    const r = await fetch(url);
    const text = await r.text();
    res.setHeader("Content-Type", "application/xml");
    res.send(text);
  } catch (e) {
    res.status(500).send("Proxy Error: " + e.message);
  }
});

export default app;
