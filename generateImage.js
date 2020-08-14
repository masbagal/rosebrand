const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

module.exports = async function generateImage(text) {
  const canvas = createCanvas(500, 275);
  const context = canvas.getContext("2d");

  const sawah = await loadImage("./sawah.png");
  context.drawImage(sawah, 0, 0, 500, 275);

  const logo = await loadImage("./rosebrand.png");
  context.drawImage(logo, 20, 10, 80, 60);

  context.font = "bold 25px Arial";
  context.fillStyle = "red";
  context.textAlign = "left";
  context.fillText(text.toUpperCase(), 110, 50);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./test.png", buffer);
};
