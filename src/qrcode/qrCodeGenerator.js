const QRCode = require("qrcode");
const { qrRender } = require("./qrRender");

function qrCodeGenerator(data, options) {
  const opts = {
    color: "colored",
    logo: "none",
    ...options
  };
  const qrSvg = qrRender(
    QRCode.create(data, { errorCorrectionLevel: "Q" }),
    opts
  );
  return qrSvg;
}

module.exports = qrCodeGenerator;