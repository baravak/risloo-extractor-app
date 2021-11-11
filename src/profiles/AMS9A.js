import { Profile, FS } from "../profile";
import AMS93 from "./AMS93";

// This profile is completely identical to AMS93

export default class AMS9A extends Profile {
  constructor(dataset, profileVariant, config = {}) {
    super();
    Object.assign(this, new AMS93(dataset, profileVariant, config))
  }
}
