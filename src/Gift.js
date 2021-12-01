const moment = require("moment-jalaali");

moment.locale("fa");
moment.loadPersian({ dialect: "persian-modern" });

class Gift {
  constructor(dataset, status) {
    this.id = dataset.id || "-";
    this.title = dataset.title || "-";
    this.code = dataset.code || "-";
    this.type = dataset.type || "-";
    this.value = dataset.value || "-";
    this.status = status;
    (this.started_at = (dataset.started_at && this._formatDate(dataset.started_at)) || "-"),
      (this.expires_at = (dataset.expires_at && this._formatDate(dataset.expires_at)) || ""),
      (this.region = {
        id: dataset.region?.id || "-",
        title: dataset.region?.detail?.title || "-",
      });
  }

  // Convert Given Timestamp to Proper Format for Gift
  _formatDate(timeStamp) {
    return moment(timeStamp * 1000).format("jDD / jMM / jYYYY");
  }
}

module.exports = Gift;
