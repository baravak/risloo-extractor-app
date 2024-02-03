const { Profile } = require("../Profile");
class YPI93 extends Profile {
  // Number of pages
  static pages = 2;

  // Labels of the sample
    labels = {
    L1_fs: { eng: "ab_father_score", group: 1},
    L1_fp: { eng: "ab_father_percentage", group: 1},
    L1_ms: { eng: "ab_mother_score", group: 1},
    L1_mp: { eng: "ab_mother_percentage", group: 1},

    L2_fs: { eng: "ma_father_score", group: 1},
    L2_fp: { eng: "ma_father_percentage", group: 1},
    L2_ms: { eng: "ma_mother_score", group: 1},
    L2_mp: { eng: "ma_mother_percentage", group: 1},

    L3_fs: { eng: "ed_father_score", group: 1},
    L3_fp: { eng: "ed_father_percentage", group: 1},
    L3_ms: { eng: "ed_mother_score", group: 1},
    L3_mp: { eng: "ed_mother_percentage", group: 1},

    L4_fs: { eng: "ds_father_score", group: 1},
    L4_fp: { eng: "ds_father_percentage", group: 1},
    L4_ms: { eng: "ds_mother_score", group: 1},
    L4_mp: { eng: "ds_mother_percentage", group: 1},


    L5_fs: { eng: "ai_father_score", group: 2},
    L5_fp: { eng: "ai_father_percentage", group: 2},
    L5_ms: { eng: "ai_mother_score", group: 2},
    L5_mp: { eng: "ai_mother_percentage", group: 2},

    L6_fs: { eng: "vu_father_score", group: 2},
    L6_fp: { eng: "vu_father_percentage", group: 2},
    L6_ms: { eng: "vu_mother_score", group: 2},
    L6_mp: { eng: "vu_mother_percentage", group: 2},

    L7_fs: { eng: "eu_father_score", group: 2},
    L7_fp: { eng: "eu_father_percentage", group: 2},
    L7_ms: { eng: "eu_mother_score", group: 2},
    L7_mp: { eng: "eu_mother_percentage", group: 2},

    L8_fs: { eng: "fa_father_score", group: 2},
    L8_fp: { eng: "fa_father_percentage", group: 2},
    L8_ms: { eng: "fa_mother_score", group: 2},
    L8_mp: { eng: "fa_mother_percentage", group: 2},


    L9_fs: { eng: "et_father_score", group: 3},
    L9_fp: { eng: "et_father_percentage", group: 3},
    L9_ms: { eng: "et_mother_score", group: 3},
    L9_mp: { eng: "et_mother_percentage", group: 3},

    L1_fs0: { eng: "is_father_score", group: 3},
    L1_fp0: { eng: "is_father_percentage", group: 3},
    L1_ms0: { eng: "is_mother_score", group: 3},
    L1_mp0: { eng: "is_mother_percentage", group: 3},

    
    L1_fs1: { eng: "sb_father_score", group: 4},
    L1_fp1: { eng: "sb_father_percentage", group: 4},
    L1_ms1: { eng: "sb_mother_score", group: 4},
    L1_mp1: { eng: "sb_mother_percentage", group: 4},

    L1_fs2: { eng: "ss_father_score", group: 4},
    L1_fp2: { eng: "ss_father_percentage", group: 4},
    L1_ms2: { eng: "ss_mother_score", group: 4},
    L1_mp2: { eng: "ss_mother_percentage", group: 4},

    L1_fs3: { eng: "as_father_score", group: 4},
    L1_fp3: { eng: "as_father_percentage", group: 4},
    L1_ms3: { eng: "as_mother_score", group: 4},
    L1_mp3: { eng: "as_mother_percentage", group: 4},

    
    L1_fs4: { eng: "np_father_score", group: 5},
    L1_fp4: { eng: "np_father_percentage", group: 5},
    L1_ms4: { eng: "np_mother_score", group: 5},
    L1_mp4: { eng: "np_mother_percentage", group: 5},

    L1_fs5: { eng: "ei_father_score", group: 5},
    L1_fp5: { eng: "ei_father_percentage", group: 5},
    L1_ms5: { eng: "ei_mother_score", group: 5},
    L1_mp5: { eng: "ei_mother_percentage", group: 5},

    L1_fs6: { eng: "us_father_score", group: 5},
    L1_fp6: { eng: "us_father_percentage", group: 5},
    L1_ms6: { eng: "us_mother_score", group: 5},
    L1_mp6: { eng: "us_mother_percentage", group: 5},

    L1_fs7: { eng: "pu_father_score", group: 5},
    L1_fp7: { eng: "pu_father_percentage", group: 5},
    L1_ms7: { eng: "pu_mother_score", group: 5},
    L1_mp7: { eng: "pu_mother_percentage", group: 5},

  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "آزمون روان‌بنه‌های یانگ - 90 سؤالی" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: [] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 903 + 2 * this.padding.x,
          height: 714 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 14,
        y: 20,
      },
    },

    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
        dataset,
      } = this;
    const factors = ['ed','ab','ma','vu','ai','ds','fa','sb','ss','us','et','is','eu','np','ei','pu','as'];
    const mod = ["father", "mother"]
    const items = {}
    dataset.score.forEach(f => {
        const sp = f.label.eng.split('_')
        if(items[sp[0]] === undefined){
            items[sp[0]] = {
                en: sp[0].toUpperCase(),
                max: fD[sp[0]].max,
                title: fD[sp[0]].fr,
                father: {
                critical : [[], []],
                score: 0,
                    percentage: 0,
                },
                mother: {
                critical : [[], []],
                score: 0,
                    percentage: 0,
                },
            }
        }
        if(sp[2] === 'percentage'){
            items[sp[0]][sp[1]][sp[2]] = Math.round(f.mark * 100)
        }else{
            items[sp[0]][sp[1]][sp[2]] = f.mark
        }

    })
    dataset.questions.forEach((e, i) => {
        const id = Math.round((i-1) /2) + 1
        const fs = Items[id]
        const user_answered = parseInt(e.user_answered)
        if(fs === 'ed'){
            if(user_answered === 1){
                items[fs][mod[i % 2]].critical[1].push(id)
            }
            if(user_answered === 2){
                items[fs][mod[i % 2]].critical[0].push(id)
            }
        }else{
            if(user_answered === 5){
                items[fs][mod[i % 2]].critical[0].push(id)
            }
            if(user_answered === 6){
                items[fs][mod[i % 2]].critical[1].push(id)
            }
        }
    })
    for(const f in items){
        const fi = items[f]
        items[f].father.critical = criticaler(fi.father.critical, 'father', f === 'ed')
        items[f].mother.critical = criticaler(fi.mother.critical, 'mother', f === 'ed')
    }
    return [
        {
            titleAppend: ' - صفحه ۱',
            g1: {
                factors: [items.ab, items.ma, items.ed, items.ds]
            },
            g2: {
                factors: [items.ai, items.vu, items.eu, items.fa]
            },
            g3: {
                factors: [items.et, items.is]
            }
        },
        {
            titleAppend: ' - صفحه ۲',
            g4: {
                factors: [items.sb, items.ss, items.as]
            },
            g5: {
                factors: [items.np, items.ei, items.us, items.pu]
            },
        }
    ];
  }
}
const modeCriticalColor ={
    father : {
        p1 : {
            a: '#2563EB',
            b: '#EFF6FF',
        },
        p2 : {
            a: '#1D4ED8',
            b: '#DBEAFE',
        }
    },
    mother : {
        p1 : {
            a: '#C026D3',
            b: '#FDF4FF',
        },
        p2 : {
            a: '#A21CAF',
            b: '#FAE8FF',
        }
    }
}
function criticaler(data, mod, reverse){
    let left = 0
    const result = []
    const lines = []
    if(data[0].length > 0){
        result.push({
            left,
            text: `گ${reverse ? 2 : 5}`,
            bg: modeCriticalColor[mod].p1.a,
            fill: '#FFFFFF',
            w: 35
        })
        left += 37
        data[0].forEach(d => {
            result.push({
                left,
                text: d,
                bg: modeCriticalColor[mod].p1.b,
                fill: modeCriticalColor[mod].p1.a,
                w: 24
        })
            left += 26
        })
        lines.push({start: 5, end: left-5})
    }
    if(data[1].length > 0){
        if(left !== 0){
            left += 8
        }
        const fl = left + 5

        result.push({
            left,
            text: `گ${reverse ? 1 : 6}`,
            bg: modeCriticalColor[mod].p2.a,
            fill: '#FFFFFF',
            w: 35
        })
        left += 37
        data[1].forEach(d => {
            result.push({
                left,
                text: d,
                bg: modeCriticalColor[mod].p2.b,
                fill: modeCriticalColor[mod].p2.a,
                w: 24
            })
            left += 26
        })
        lines.push({start: fl, end: left-5})

    }
    return {result, lines}
}
module.exports = YPI93;
const f1= 'ed'
const f2= 'ab'
const f3= 'ma'
const f4= 'vu'
const f5= 'ai'
const f6= 'ds'
const f7= 'fa'
const f8= 'sb'
const f9= 'ss'
const f10= 'us'
const f11= 'et'
const f12= 'is'
const f13= 'eu'
const f14= 'np'
const f15= 'ei'
const f16= 'pu'
const f17= 'as'

const fD = {
    ab: {fr: "رهاشدگی (بی‌ثباتی)", max: 24},
    ma: {fr: "بی‌اعتمادی (سوءاستفاده)", max: 24},
    ed: {fr: "محرومیت عاطفی", max: 30},
    ds: {fr: "نقص (شرم)", max: 24},
    ai: {fr: "وابستگی (بی‌کفایتی)", max: 18},
    vu: {fr: "آسیب‌پذیری در برابر خطر", max: 24},
    eu: {fr: "گرفتارشدگی (خودتحول‌نایافتگی)", max: 24},
    fa: {fr: "شکست", max: 24},
    et: {fr: "محق‌بودن (خودبزرگ‌بینی)", max: 24},
    is: {fr: "خودمهارگری ناکافی", max: 24},
    sb: {fr: "انقیاد (اطاعت)", max: 24},
    ss: {fr: "از خودگذشتگی", max: 24},
    as: {fr: "تأییدخواهی یا تصدیق‌خواهی", max: 24},
    np: {fr: "منفی‌خوانی یا بدبینی", max: 24},
    ei: {fr: "بیش‌مهارگری (بازداری هیجانی)", max: 30},
    us: {fr: "استانداردهای سخت‌گیرانه", max: 42},
    pu: {fr: "تنبیه‌گری", max: 24},
}

const Items = {
    1:f1, 2:f1, 3:f1, 4:f1, 5:f1,
    6:f2,7:f2,8:f2,9:f2,
    10:f3,11:f3,12:f3,13:f3,
    14:f4,15:f4,16:f4,17:f4,
    18:f5,19:f5,20:f5,
    21:f6,22:f6,23:f6,24:f6,
    25:f7,26:f7,27:f7,28:f7,
    29:f8,30:f8,31:f8,32:f8,
    33:f9,34:f9,35:f9,36:f9,
    37:f10,38:f10,39:f10,40:f10,41:f10,42:f10,43:f10,
    44:f11,45:f11,46:f11,47:f11,
    48:f12,49:f12,50:f12,51:f12,
    52:f13,53:f13,54:f13,55:f13,
    56:f14,57:f14,58:f14,59:f14,
    60:f15,61:f15,62:f15,63:f15,64:f15,
    65:f16,66:f16,67:f16,68:f16,
    69:f17,70:f17,71:f17,72:f17
}