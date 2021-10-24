import QRCode from "qrcode";
import { qrRender } from "./qrRender";

export default function qrCodeGenerator(data, options) {
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