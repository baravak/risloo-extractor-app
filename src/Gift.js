const moment = require("moment-jalaali");

moment.locale("fa");
moment.loadPersian({ dialect: "persian-modern" });
const domainENVTitle = process.env.ENVTITLE || "ریسلو";

class Gift {
  constructor(gift, avatar) {
    this.ENVTitle = domainENVTitle;
    this.name = gift.code;
    this.title = gift.title || "-";
    this.code = gift.code.slice(10) || "-";
    this.type = gift.type || "-";
    this.value = gift.value || "-";
    (this.started_at = (gift.started_at && this._formatDate(gift.started_at)) || "-"),
      (this.expires_at = (gift.expires_at && this._formatDate(gift.expires_at)) || ""),
      (this.region = {
        id: gift.region.id || "-",
        type: gift.region.type,
        title: gift.region.detail.title || "-",
        avatarBase64: avatar && Buffer.from(avatar, "binary").toString("base64"),
      });
  }

  // Convert Given Timestamp to Proper Format for Gift
  _formatDate(timeStamp) {
    return moment(timeStamp * 1000).format("jDD / jMM / jYYYY");
  }
}

module.exports = Gift;
