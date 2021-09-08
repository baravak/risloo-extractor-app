import { Profile, FS } from "../profile";

class OBQ4493 extends Profile {
  _calcContext() {
    const { spec, dataset, canvas } = this;

    const {
      length,
      maxValues,
    } = spec.parameters["OBQ4493"];

    const rectWidths = Object.entries(maxValues).map(entry => entry[1] * length);
    const dataWidths = Object.entries(maxValues).map((entry, index) => dataset.info[index] / entry * length)

    // console.log(rectWidths)
    // console.log(dataWidths)
  }
}

module.exports = OBQ4493;
