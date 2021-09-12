import { Profile, FS } from "../profile";

class OBQ4493 extends Profile {
  _calcContext() {
    const { spec, dataset, canvas } = this;

    const {
      length,
      maxValues,
      itemPositions,
    } = spec.parameters["OBQ4493"];

    const num = dataset.score.values.length;

    const rectWidths = Object.entries(maxValues).map(entry => 2 * entry[1] * length);
    const dataWidths = Object.entries(maxValues).map((entry, index) => Math.abs(dataset.score.values[index]) * length);
    const dataMirrorAndFill = dataset.score.values.map(item => item > 0 ? { mirror: 1, fill: "#991B1B"} : { mirror: -1, fill: "#007BA4"}) 

    return {
      num,
      itemPositions,
      rectWidths,
      dataWidths,
      dataMirrorAndFill
    }
  }
}

module.exports = OBQ4493;
