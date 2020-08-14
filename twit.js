const Twitter = require("twitter-lite");
const fs = require("fs");

async function sendTweet(text, articleUrl) {
  const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });

  const uploadClient = new Twitter({
    subdomain: 'upload',
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });

  const image = fs.readFileSync("./test.png", "base64");
  try {
    const uploadResult = await uploadClient.post("media/upload", {
      media_data: image,
    });

    const tweet = text + "\n" + articleUrl;

    await client.post("statuses/update", {
      status: tweet,
      media_ids: uploadResult.media_id_string,
    });
  } catch (error) {
    console.log("err", error);
  }
}

module.exports = sendTweet;
