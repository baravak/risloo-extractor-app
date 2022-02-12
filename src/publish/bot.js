const https = require("https");
require('dotenv').config()

const token = process.env.TELEGRAM_BOT_TOKEN;

const data = JSON.stringify({
  chat_id: "-657288075",
  text: "Hello there",
});

const options = {
  hostname: "api.telegram.org",
  path: `/bot${token}/sendMessage`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
