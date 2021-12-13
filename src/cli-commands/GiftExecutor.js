const fs = require("fs/promises");
const path = require("path");
const Executor = require("./Executor");
const { GIFT_STATUS } = require("./utilities/RES_STATUS");
const Gift = require("../Gift");
const { loadStdin } = require("./utilities/BaseOps");

class GiftExecutor extends Executor {
  giftTemplateFile = path.join(__dirname, "..", "..", "views", "gift.hbs");

  constructor(options) {
    super(options);

    this._addTemplatePromise();
    this._addAvatarPromise();

    this._gift();
  }

  _addTemplatePromise() {
    const { promises, giftTemplateFile } = this;

    promises["template"] = fs.readFile(giftTemplateFile);
  }

  _addAvatarPromise() {
    const { promises } = this;

    promises["avatar"] = loadStdin("binary");
  }

  _gift() {
    const { promises, response, benchmarker } = this;

    promises["gift"] = this._createGift().then(() => {
      if (benchmarker) {
        benchmarker.end();
        response.setTime(benchmarker.totalTime);
      }
      response.setStatus(GIFT_STATUS["SUCCESS"]);
    });
  }

  async _createGift() {
    const { promises } = this;

    return Promise.all([promises.input, promises.avatar])
      .then(([dataset, avatar]) => new Gift(dataset, avatar))
      .then((ctx) => this._renderAndCreateOutputs([ctx], [promises.template], ctx.name, ["PNG"]));
  }
}

module.exports = GiftExecutor;
