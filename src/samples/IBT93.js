const { Mappings } = require("../Profile");
const PIES93 = require("./PIES93");

const labels = {
  L1: { eng: "da", fr: "توقع تأیید از دیگران", abbr: "DA" },
  L2: { eng: "hse", fr: "انتظارات بیش از حد خود", abbr: "HSE" },
  L3: { eng: "bp", fr: "سرزنش خود", abbr: "BP" },
  L4: { eng: "fr", fr: "واکنش همراه با ناکامی", abbr: "FR" },
  L5: { eng: "ei", fr: "بی‌مسئولیتی هیجانی", abbr: "EI" },
  L6: { eng: "ao", fr: "بیش دلواپسی اضطرابی", abbr: "AO" },
  L7: { eng: "pa", fr: "اجتناب از مشکل", abbr: "PA" },
  L8: { eng: "d", fr: "وابستگی", abbr: "D" },
  L9: { eng: "hc", fr: "درماندگی برای تغییر", abbr: "HC" },
  L10: { eng: "p", fr: "کمال‌گرایی", abbr: "P" },
  L11: { eng: "raw", fr: "نمره کل", abbr: "#" },
};

const customConfig = {
  sample: {
    name: "پرسشنامه باورهای غیرمنطقی جونز" /* Name of the sample */,
  },
  profile: {
    get dimensions() {
      return {
        width: 834 + 2 * this.padding.x,
        height: 670 + 2 * this.padding.y,
      }
    },
    padding: {
      x: 40,
      y: 8,
    },
  },
  raw: {
    maxValue: 500,
    offsetX: 80,
    ticks: {
      num: 5 /* Number of ticks */,
    },
    rect: {
      height: 670,
    },
  },
  items: {
    maxValue: 50,
    offsetY: 21,
    ticks: {
      num: 5 /* Number of ticks */,
    },
    body: {
      colors: [
        "#06B6D4",
        "#0EA5E9",
        "#6366F1",
        "#7C3AED",
        "#A855F7",
        "#D946EF",
        "#EC4899",
        "#F43F5E",
        "#F97316",
        "#FBBF24",
      ],
      opacityMappings: new Mappings()
        .addMapping("10", 0.6)
        .addMapping("11-20", 0.7)
        .addMapping("21-30", 0.8)
        .addMapping("31-40", 0.9)
        .addMapping("41-50", 1),
    },
    base: {
      rect: {
        width: 272,
      },
      colors: [
        "#39C5DE",
        "#3EB7EC",
        "#8385F4",
        "#9661F1",
        "#B978FA",
        "#E16BF3",
        "#F06EAE",
        "#F7647E",
        "#FB8F46",
        "#FCCC50",
      ],
    },
  },
  labels: Object.values(labels),
};

// This profile is completely identical to MMFAD9A

class IBT93 extends PIES93 {
  constructor(dataset, options, config = customConfig) {
    super(dataset, options, config);
  }
}

module.exports = IBT93;
