const { Profile, FS } = require("../Profile");
const factors = ['1','2a','2b','3','4','5','6a','6b','7','8a','8b','9','a','b','c','d','e','f','g','h','aa','bb','cc','dd','ee','ff','gg','y','z', 'x',
           '1_1','1_2','1_3','2a_1','2a_2','2a_3','2b_1','2b_2','2b_3','3_1','3_2','3_3','4_1','4_2','4_3','5_1','5_2','5_3','6a_1','6a_2','6a_3','6b_1','6b_2','6b_3','7_1','7_2','7_3','8a_1','8a_2','8a_3','8b_1','8b_2','8b_3','9_1','9_2','9_3']
const colors = {
    gray: {
        bg: '#F8FAFC',
        color: "#475569",
        key: 'url(#grayBar)',
        weight: 400,
    },
    blue: {
        bg: '#EFF6FF',
        color: "#2563EB",
        key: 'url(#blueBar)',
        weight: 400,
    },
    yellow: {
        bg: '#FEFCE8',
        color: "#EAB308",
        key: 'url(#yellowBar)',
        weight: 600,
    },
    orange: {
        bg: '#FFF7ED',
        color: "#EA580C",
        key: 'url(#orangeBar)',
        weight: 600,
    },
    red: {
        bg: '#FFF1F2',
        color: "#E11D48",
        key: 'url(#redBar)',
        weight: 600,
    }
    
}
class MACI93 extends Profile {
  static pages = 4;

  labels = {
    Lraw_1 : {eng: "raw_1", en:"1", fr: "درونگرا"},
    Lraw_2a : {eng: "raw_2a", en:"2a", fr: "اجتنابی"},
    Lraw_2b : {eng: "raw_2b", en:"2b", fr: "غمگین"},
    Lraw_3 : {eng: "raw_3", en:"3", fr: "مطیع"},
    Lraw_4 : {eng: "raw_4", en:"4", fr: "نمایشی"},
    Lraw_5 : {eng: "raw_5", en:"5", fr: "خودخواه"},
    Lraw_6a : {eng: "raw_6a", en:"6a", fr: "نظم‌گریز"},
    Lraw_6b : {eng: "raw_6b", en:"6b", fr: "زورگو"},
    Lraw_7 : {eng: "raw_7", en:"7", fr: "همنوا"},
    Lraw_8a : {eng: "raw_8a", en:"8a", fr: "مخالف‌خوان"},
    Lraw_8b : {eng: "raw_8b", en:"8b", fr: "خودخوارساز"},
    Lraw_9 : {eng: "raw_9", en:"9", fr: "گرایش مرزی"},

    Lraw_a : {eng: "raw_a", en:"a", fr: "آشفتگی هویت"},
    Lraw_b : {eng: "raw_b", en:"b", fr: "ناارزنده‌ساز"},
    Lraw_c : {eng: "raw_c", en:"c", fr: "عدم تأیید بدن"},
    Lraw_d : {eng: "raw_d", en:"d", fr: "نارضایتی جنسی"},
    Lraw_e : {eng: "raw_e", en:"e", fr: "ناامنی از همسالان"},
    Lraw_f : {eng: "raw_f", en:"f", fr: "عدم حساسیت اجتماعی"},
    Lraw_g : {eng: "raw_g", en:"g", fr: "اختلاف خانوادگی"},
    Lraw_h : {eng: "raw_h", en:"h", fr: "سوءاستفاده از کودکی"},
    Lraw_aa : {eng: "raw_aa", en:"aa", fr: "کژکاری خوردن"},
    Lraw_bb : {eng: "raw_bb", en:"bb", fr: "استعداد سوء مصرف مواد"},
    Lraw_cc : {eng: "raw_cc", en:"cc", fr: "آمادگی انحراف"},
    Lraw_dd : {eng: "raw_dd", en:"dd", fr: "گرایش تکانش‌گری"},
    Lraw_ee : {eng: "raw_ee", en:"ee", fr: "احساسات اضطرابی"},
    Lraw_ff : {eng: "raw_ff", en:"ff", fr: "عاطفه افسرده"},
    Lraw_gg : {eng: "raw_gg", en:"gg", fr: "تمایل خودکشی"},

    Lraw_x : {eng: "raw_x", en:"x", fr: "خوارسازی"},
    Lraw_y : {eng: "raw_y", en:"y", fr: "خودافشایی"},
    Lraw_z : {eng: "raw_z", en:"z", fr: "مطلوب بودن"},


    Lraw_1_1 : {eng: "raw_1_1", en:"1-1", fr: "خونسردی ابرازی"},
    Lraw_1_2 : {eng: "raw_1_2", en:"1-2", fr: "بی‌تفاوتی مزاجی"},
    Lraw_1_3 : {eng: "raw_1_3", en:"1-3", fr: "عدم برانگیختگی بین‌فردی"},
    Lraw_2a_1 : {eng: "raw_2a_1", en:"2a-1", fr: "بدخلقی ابرازی"},
    Lraw_2a_2 : {eng: "raw_2a_2", en:"2a-2", fr: "تنفر بین‌فردی"},
    Lraw_2a_3 : {eng: "raw_2a_3", en:"2a-3", fr: "خودانگاره بیگانه"},
    Lraw_2b_1 : {eng: "raw_2b_1", en:"2b-1", fr: "غمزدگی مزاجی"},
    Lraw_2b_2 : {eng: "raw_2b_2", en:"2b-2", fr: "تسلی‌ناپذیری ابرازی"},
    Lraw_2b_3 : {eng: "raw_2b_3", en:"2b-3", fr: "شکاکیت شناختی"},
    Lraw_3_1 : {eng: "raw_3_1", en:"3-1", fr: "اطاعت بین‌فردی"},
    Lraw_3_2 : {eng: "raw_3_2", en:"3-2", fr: "صلح‌جویی مزاجی"},
    Lraw_3_3 : {eng: "raw_3_3", en:"3-3", fr: "بی‌‌عرضگی ابرازی"},
    Lraw_4_1 : {eng: "raw_4_1", en:"4-1", fr: "جستجوی توجه بین‌فردی"},
    Lraw_4_2 : {eng: "raw_4_2", en:"4-2", fr: "خودانگاره معاشرتی"},
    Lraw_4_3 : {eng: "raw_4_3", en:"4-3", fr: "دمدمی بودن شناختی"},
    Lraw_5_1 : {eng: "raw_5_1", en:"5-1", fr: "خودانگاره ستودنی"},
    Lraw_5_2 : {eng: "raw_5_2", en:"5-2", fr: "توسعه شناختی"},
    Lraw_5_3 : {eng: "raw_5_3", en:"5-3", fr: "انفجاری بودن بین‌فردی"},
    Lraw_6a_1 : {eng: "raw_6a_1", en:"6a-1", fr: "تکانشگری ابرازی"},
    Lraw_6a_2 : {eng: "raw_6a_2", en:"6a-2", fr: "مکانیزم رفتارکردن"},
    Lraw_6a_3 : {eng: "raw_6a_3", en:"6a-3", fr: "لاابالی‌گری بین‌فردی"},
    Lraw_6b_1 : {eng: "raw_6b_1", en:"6b-1", fr: "دلخوری بین‌فردی"},
    Lraw_6b_2 : {eng: "raw_6b_2", en:"6b-2", fr: "ابراز غیرمنتظره"},
    Lraw_6b_3 : {eng: "raw_6b_3", en:"6b-3", fr: "مکانیزم انزوا"},
    Lraw_7_1 : {eng: "raw_7_1", en:"7-1", fr: "نظم‌ ابرارزی"},
    Lraw_7_2 : {eng: "raw_7_2", en:"7-2", fr: "احترام بین‌فردی"},
    Lraw_7_3 : {eng: "raw_7_3", en:"7-3", fr: "خود‌انگاره خودخواه"},
    Lraw_8a_1 : {eng: "raw_8a_1", en:"8a-1", fr: "خودانگاره از خود ناراضی"},
    Lraw_8a_2 : {eng: "raw_8a_2", en:"8a-2", fr: "رنجیدگی ابرازی"},
    Lraw_8a_3 : {eng: "raw_8a_3", en:"8a-3", fr: "معکوس بودن بین‌فردی"},
    Lraw_8b_1 : {eng: "raw_8b_1", en:"8b-1", fr: "خجالتی بودن شناختی"},
    Lraw_8b_2 : {eng: "raw_8b_2", en:"8b-2", fr: "خودانگاره سزاوار نبودن"},
    Lraw_8b_3 : {eng: "raw_8b_3", en:"8b-3", fr: "بیمار بودن مزاجی"},
    Lraw_9_1 : {eng: "raw_9_1", en:"9-1", fr: "ضعف مزاجی"},
    Lraw_9_2 : {eng: "raw_9_2", en:"9-2", fr: "دمدمی بودن شناختی"},
    Lraw_9_3 : {eng: "raw_9_3", en:"9-3", fr: "خود انگاره نامطمئن"},


    Lv : {eng: "v"},

    Lbr_1 : {eng: "br_1"},
    Lbr_2a : {eng: "br_2a"},
    Lbr_2b : {eng: "br_2b"},
    Lbr_3 : {eng: "br_3"},
    Lbr_4 : {eng: "br_4"},
    Lbr_5 : {eng: "br_5"},
    Lbr_6a : {eng: "br_6a"},
    Lbr_6b : {eng: "br_6b"},
    Lbr_7 : {eng: "br_7"},
    Lbr_8a : {eng: "br_8a"},
    Lbr_8b : {eng: "br_8b"},
    Lbr_9 : {eng: "br_9"},
    Lbr_a : {eng: "br_a"},
    Lbr_b : {eng: "br_b"},
    Lbr_c : {eng: "br_c"},
    Lbr_d : {eng: "br_d"},
    Lbr_e : {eng: "br_e"},
    Lbr_f : {eng: "br_f"},
    Lbr_g : {eng: "br_g"},
    Lbr_h : {eng: "br_h"},
    Lbr_aa : {eng: "br_aa"},
    Lbr_bb : {eng: "br_bb"},
    Lbr_cc : {eng: "br_cc"},
    Lbr_dd : {eng: "br_dd"},
    Lbr_ee : {eng: "br_ee"},
    Lbr_ff : {eng: "br_ff"},
    Lbr_gg : {eng: "br_gg"},

    Lbr_x : {eng: "br_x"},
    Lbr_y : {eng: "br_y"},
    Lbr_z : {eng: "br_z"},


    Lbr_1_1 : {eng: "br_1_1"},
    Lbr_1_2 : {eng: "br_1_2"},
    Lbr_1_3 : {eng: "br_1_3"},
    Lbr_2a_1 : {eng: "br_2a_1"},
    Lbr_2a_2 : {eng: "br_2a_2"},
    Lbr_2a_3 : {eng: "br_2a_3"},
    Lbr_2b_1 : {eng: "br_2b_1"},
    Lbr_2b_2 : {eng: "br_2b_2"},
    Lbr_2b_3 : {eng: "br_2b_3"},
    Lbr_3_1 : {eng: "br_3_1"},
    Lbr_3_2 : {eng: "br_3_2"},
    Lbr_3_3 : {eng: "br_3_3"},
    Lbr_4_1 : {eng: "br_4_1"},
    Lbr_4_2 : {eng: "br_4_2"},
    Lbr_4_3 : {eng: "br_4_3"},
    Lbr_5_1 : {eng: "br_5_1"},
    Lbr_5_2 : {eng: "br_5_2"},
    Lbr_5_3 : {eng: "br_5_3"},
    Lbr_6a_1 : {eng: "br_6a_1"},
    Lbr_6a_2 : {eng: "br_6a_2"},
    Lbr_6a_3 : {eng: "br_6a_3"},
    Lbr_6b_1 : {eng: "br_6b_1"},
    Lbr_6b_2 : {eng: "br_6b_2"},
    Lbr_6b_3 : {eng: "br_6b_3"},
    Lbr_7_1 : {eng: "br_7_1"},
    Lbr_7_2 : {eng: "br_7_2"},
    Lbr_7_3 : {eng: "br_7_3"},
    Lbr_8a_1 : {eng: "br_8a_1"},
    Lbr_8a_2 : {eng: "br_8a_2"},
    Lbr_8a_3 : {eng: "br_8a_3"},
    Lbr_8b_1 : {eng: "br_8b_1"},
    Lbr_8b_2 : {eng: "br_8b_2"},
    Lbr_8b_3 : {eng: "br_8b_3"},
    Lbr_9_1 : {eng: "br_9_1"},
    Lbr_9_2 : {eng: "br_9_2"},
    Lbr_9_3 : {eng: "br_9_3"},


    Lxstatus : {eng: "xstatus"},
    Lbrstatus : {eng: "brstatus"},
    Lstatus : {eng: "status"},
  };

  profileSpec = {
    sample: {
      name: "پرسشنامه بالینی نوجوانان میلون",
      multiProfile: false,
      questions: false,
      defaultFields: true,
      fields: [],
    },
    profile: {
      get dimensions() {
        return {
          width: 903 + 2 * this.padding.x,
          height: 714 + 2 * this.padding.y,
        }
      },
      padding: {
        x: 0,
        y: 0,
      },
    },

    labels: Object.values(this.labels)
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      dataset,
    } = this;
    const personality = dataset.score.slice(0, 11).map((f, i) => {
        const br = dataset.score[67 + i].mark ?? 0
        return {
            label: f.label.en.toUpperCase(),
            fa: f.label.fr,
            raw: f.mark ?? 0,
            br,
            pixel: br2pixel(br),
            style: findStyle(br)
        }
    })
    const border = {
        label: dataset.score[11].label.en.toUpperCase(),
        fa: dataset.score[11].label.fr,
        raw: dataset.score[11].mark ?? 0,
        br: dataset.score[78].mark ?? 0,
        pixel: br2pixel(dataset.score[78].mark ?? 0),
        style: findStyle(dataset.score[78].mark ?? 0)
    }
    const warnings = dataset.score.slice(12, 20).map((f, i) => {
        return {
            label: f.label.en.toUpperCase(),
            fa: f.label.fr,
            raw: f.mark ?? 0,
            br: dataset.score[79 + i].mark ?? 0,
            pixel: br2pixel(dataset.score[79 + i].mark ?? 0),
            style: findStyle(dataset.score[79 + i].mark ?? 0)
    }
    })
    const clinical = dataset.score.slice(20, 27).map((f, i) => {
        return {
            label: f.label.en.toUpperCase(),
            fa: f.label.fr,
            raw: f.mark ?? 0,
            br: dataset.score[87 + i].mark ?? 0,
            pixel: br2pixel(dataset.score[87 + i].mark ?? 0),
            style: findStyle(dataset.score[87 + i].mark ?? 0)
        }
    })
    const correction = dataset.score.slice(27, 30).map((f, i) => {
        return {
            label: f.label.en.toUpperCase(),
            fa: f.label.fr,
            raw: f.mark ?? 0,
            br: dataset.score[94 + i].mark ?? 0,
            pixel: br2pixel(dataset.score[94 + i].mark ?? 0),
            style: colors.blue
        }
    })
    const grasman = [...personality, border].map((rr, i) => {
        const index = 30 + (3*i)
        return {
            label: rr.label,
            fa: rr.fa,
            br: rr.br,
            style: findStyleg(rr.br),
            subs: dataset.score.slice(index, index + 3).map(((r, i) => {
                const br = dataset.score[index + 67 + i]
                return {
                    label: r.label.en.toUpperCase(),
                    fa: r.label.fr,
                    raw: r.mark ?? 0,
                    br: br.mark ?? 0,
                    pixel: br2pixelg(br.mark ?? 0),
                    style: br.mark >= 75 && rr.br >= 65  ? findStyleg(rr.br).subs.critical : findStyleg(rr.br).subs.mute
        
                }
            }))
        }
    }).sort((a, b) => {
        if(a.br > b.br) return -1
        if(a.br < b.br) return 1
        return 0
    })
    const bcolor= [{value: 0, bg:'#ECFDF5', fill:"#059669", text:'معتبر'},{value: 1, bg:'#FEFCE8', fill:"#CA8A04", text:'تفسیر با احتیاط'},{value: 2, bg:'#FEF2F2', fill:"#DC2626", text:'نامعتبر'}]
    const status = {
        v: bcolor[dataset.score[66].mark ?? 0],
        x: dataset.score[133].mark ?? 0,
        br: dataset.score[134].mark ?? 0,
        mark: dataset.score[135].mark ?? 0
    }
    
    return [
        {correction, personality, status, border, titleAppend: ' - 1' },
        {warnings, status, clinical, titleAppend: ' - 2'},
        {grasman: grasman.slice(0, 6), titleAppend: ' - گراسمن 1'},
        {grasman: grasman.slice(6), titleAppend: ' - گراسمن 2'}
    ];
  }
}
function br2pixel(br){
    if(br >= 115){
        return 360
    } else if(br >= 85){
        return 270 + ((br - 85) * 3)
    } else if(br >= 75) {
        return 180 + ((br - 75) * 9)
    } else if(br >= 60){
        return 90 + ((br - 60) * 6)
    }
    return br * 1.5
}
function br2pixelg(br){
    if(br >= 60){
        return 60 + ((br - 60) * 6)
    }
    return br
}
function findStyle(br){
    if(br < 60){
        return colors.gray
    }
    if(br < 75){
        return colors.yellow
    }
    if(br < 85){
        return colors.orange
    }
    return colors.red
}

const gcolor = {
    gray: {
        bg: '#F8FAFC',
        border: '#E2E8F0',
        color: '#475569',
        subs: {
            mute: {
                key: 'url(#coldGrayBar)',
                bg: '#F8FAFC',
                color: '#475569',
                weight: 400
            }
        }
    },
    yellow: {
        bg: '#FEFCE8',
        border: '#FEF08A',
        color: '#EAB308',
        subs: {
            mute: {
                key: 'url(#hotGrayBar)',
                bg: '#FAFAFA',
                color: '#52525B',
                weight: 400
            },
            critical: colors.yellow
        }
    },
    orange: {
        bg: '#FFF7ED',
        border: '#FED7AA',
        color: '#EA580C',
        subs: {
            mute: {
                key: 'url(#hotGrayBar)',
                bg: '#FAFAFA',
                color: '#52525B',
                weight: 400
            },
            critical: colors.orange
        }
    },
    red: {
        bg: '#FFF1F2',
        border: '#FECDD3',
        color: '#E11D48',
        subs: {
            mute: {
                key: 'url(#hotGrayBar)',
                bg: '#FAFAFA',
                color: '#52525B',
                weight: 400
            },
            critical: colors.red
        }
    }
}
function findStyleg(br){
    if(br < 65){
        return gcolor.gray
    }
    if(br < 75){
        return gcolor.yellow
    }
    if(br < 85){
        return gcolor.orange
    }
    return gcolor.red
}
module.exports = MACI93;
