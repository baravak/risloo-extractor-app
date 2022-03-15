const { Profile, FS } = require("../Profile");

class YBOCS93 extends Profile {
  // Number of pages
  static pages = 3;

  // Labels of the sample
  labels = {
    L1: { eng: "aggressive_obsession", fr: "پرخاشگری" },
    L2: { eng: "contamination_obsession", fr: "آلودگی" },
    L3: { eng: "sexual_obsession", fr: "جنسی" },
    L4: { eng: "hoarding_saving", fr: "احتکار" },
    L5: { eng: "religious", fr: "مذهبی" },
    L6: { eng: "symmetry_exactness", fr: "تقارن" },
    L7: { eng: "obsession_miscellaneous", fr: "متفرقه" },
    L8: { eng: "somatic", fr: "جسمی" },
    L9: { eng: "cleaning_washing", fr: "نظافت" },
    L10: { eng: "checking", fr: "وارسی" },
    L11: { eng: "repeating", fr: "تکرار" },
    L12: { eng: "counting", fr: "شمارش" },
    L13: { eng: "ordering_arranging", fr: "نظم" },
    L14: { eng: "hoarding_collecting", fr: "احتکار" },
    L15: { eng: "compulsive_miscellaneous", fr: "متفرقه" },
    L16: { eng: "obsession_severity", fr: "شدت وسواس" },
    L17: { eng: "report", fr: "تفسیر" },
  };

  // Questions alternate titles and categories
  questionsAppendix = [
    {
      num: 1,
      title: "آسیب به خود",
      cat: "پرخاشگری",
    },
    {
      num: 2,
      title: "آسیب به دیگری",
      cat: "پرخاشگری",
    },
    {
      num: 3,
      title: "تصاویر خشن",
      cat: "پرخاشگری",
    },
    {
      num: 4,
      title: "کلمات مستهجن",
      cat: "پرخاشگری",
    },
    {
      num: 5,
      title: "اعمال شرم‌آور",
      cat: "پرخاشگری",
    },
    {
      num: 6,
      title: "تکانه ناخواسته",
      cat: "پرخاشگری",
    },
    {
      num: 7,
      title: "دزدی",
      cat: "پرخاشگری",
    },
    {
      num: 8,
      title: "آسیب یا بی‌دقتی",
      cat: "پرخاشگری",
    },
    {
      num: 9,
      title: "باعث حادثه",
      cat: "پرخاشگری",
    },
    {
      num: 10,
      title: "حساسیت فضولات",
      cat: "آلودگی",
    },
    {
      num: 11,
      title: "کثیفی، میکروب، نجاست",
      cat: "آلودگی",
    },
    {
      num: 12,
      title: "آلوده کننده محیط",
      cat: "آلودگی",
    },
    {
      num: 13,
      title: "پاک کننده‌ها",
      cat: "آلودگی",
    },
    {
      num: 14,
      title: "حیوانات",
      cat: "آلودگی",
    },
    {
      num: 15,
      title: "چسبناک",
      cat: "آلودگی",
    },
    {
      num: 16,
      title: "بیماری از آلودگی",
      cat: "آلودگی",
    },
    {
      num: 17,
      title: "آلوده کردن دیگران",
      cat: "آلودگی",
    },
    {
      num: 18,
      title: "تکانه جنسی",
      cat: "جنسی",
    },
    {
      num: 19,
      title: "جنسی کودکان",
      cat: "جنسی",
    },
    {
      num: 20,
      title: "همجنس‌بازی",
      cat: "جنسی",
    },
    {
      num: 21,
      title: "پرخاشگری جنسی",
      cat: "جنسی",
    },
    {
      num: 22,
      title: "جمع کردن اشیاء",
      cat: "احتکار",
    },
    {
      num: 23,
      title: "توهین به مقدسات",
      cat: "مذهبی",
    },
    {
      num: 24,
      title: "اخلاقیات",
      cat: "مذهبی",
    },
    {
      num: 25,
      title: "تقارن، دقت",
      cat: "تقارن",
    },
    {
      num: 26,
      title: "به خاطر سپاری موارد خاص",
      cat: "متفرقه",
    },
    {
      num: 27,
      title: "بیان کلمات خاص",
      cat: "متفرقه",
    },
    {
      num: 28,
      title: "بیان نادرست عبارات",
      cat: "متفرقه",
    },
    {
      num: 29,
      title: "گم کردن اشیاء",
      cat: "متفرقه",
    },
    {
      num: 30,
      title: "تصویر ذهنی خنثی",
      cat: "متفرقه",
    },
    {
      num: 31,
      title: "کلمه آهنگ نامفهوم",
      cat: "متفرقه",
    },
    {
      num: 32,
      title: "صدا نجوا خاص",
      cat: "متفرقه",
    },
    {
      num: 33,
      title: "اعداد شانسی",
      cat: "متفرقه",
    },
    {
      num: 34,
      title: "معنای رنگ",
      cat: "متفرقه",
    },
    {
      num: 35,
      title: "ترس خرافی",
      cat: "متفرقه",
    },
    {
      num: 36,
      title: "نگران بیماری",
      cat: "جسمی",
    },
    {
      num: 37,
      title: "بد شکلی بدن",
      cat: "جسمی",
    },
    {
      num: 38,
      title: "دست شستن",
      cat: "پرخاشگری",
    },
    {
      num: 39,
      title: "آداب افراطی",
      cat: "پرخاشگری",
    },
    {
      num: 40,
      title: "تمیز کردن اشیاء بی‌جان",
      cat: "پرخاشگری",
    },
    {
      num: 41,
      title: "اقدام برای اجتناب",
      cat: "پرخاشگری",
    },
    {
      num: 42,
      title: "آسیب به دیگری",
      cat: "وارسی",
    },
    {
      num: 43,
      title: "آسیب به خود",
      cat: "وارسی",
    },
    {
      num: 44,
      title: "حادثه وحشتناک",
      cat: "وارسی",
    },
    {
      num: 45,
      title: "ارتکاب به اشتباه",
      cat: "وارسی",
    },
    {
      num: 46,
      title: "جنبه‌های بدنی",
      cat: "وارسی",
    },
    {
      num: 47,
      title: "دوباره خوانی",
      cat: "تکرار",
    },
    {
      num: 48,
      title: "فعالیت روزمره",
      cat: "تکرار",
    },
    {
      num: 49,
      title: "شمارش",
      cat: "شمارش",
    },
    {
      num: 50,
      title: "نظم و ترتیب",
      cat: "نظم",
    },
    {
      num: 51,
      title: "احتکار",
      cat: "احتکار",
    },
    {
      num: 52,
      title: "آداب ذهنی",
      cat: "متفرقه",
    },
    {
      num: 53,
      title: "اطمینان، صحبت",
      cat: "متفرقه",
    },
    {
      num: 54,
      title: "لمس اشیاء",
      cat: "متفرقه",
    },
    {
      num: 55,
      title: "اجتناب از اشیاء",
      cat: "متفرقه",
    },
    {
      num: 56,
      title: "تشریفات غذا",
      cat: "متفرقه",
    },
    {
      num: 57,
      title: "رفتار خرافی",
      cat: "متفرقه",
    },
    {
      num: 58,
      title: "کندن مو",
      cat: "متفرقه",
    },
    {
      num: 1,
      title: "وقت صرف شده",
      cat: "شدت\nوسواس",
    },
    {
      num: 2,
      title: "اثر روی کارکرد",
      cat: "شدت\nوسواس",
    },
    {
      num: 3,
      title: "ایجاد پریشانی",
      cat: "شدت\nوسواس",
    },
    {
      num: 4,
      title: "تلاش برای مقاومت",
      cat: "شدت\nوسواس",
    },
    {
      num: 5,
      title: "توان کنترل",
      cat: "شدت\nوسواس",
    },
    {
      num: 6,
      title: "وقت صرف شده",
      cat: "شدت\nاجبار",
    },
    {
      num: 7,
      title: "اثر روی کارکرد",
      cat: "شدت\nاجبار",
    },
    {
      num: 8,
      title: "ایجاد پریشانی",
      cat: "شدت\nاجبار",
    },
    {
      num: 9,
      title: "تلاش برای مقاومت",
      cat: "شدت\nاجبار",
    },
    {
      num: 10,
      title: "توان کنترل",
      cat: "شدت\nاجبار",
    },
    {
      num: 11,
      title: "-",
      cat: "نیرومندی باور",
    },
    {
      num: 12,
      title: "-",
      cat: "اجتناب",
    },
    {
      num: 13,
      title: "-",
      cat: "-",
    },
    {
      num: 14,
      title: "-",
      cat: "-",
    },
  ];

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه یل‌براون وسواس" /* Name of the sample */,
      multiProfile: true /* Whether the sample has multiple profiles or not */,
      questions: true /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return [
          {
            width: 723 + 2 * this.padding[0].x,
            height: 645 + 2 * this.padding[0].y,
          },
          {
            width: 903 + 2 * this.padding[1].x,
            height: 714 + 2 * this.padding[1].y,
          },
          {
            width: 903 + 2 * this.padding[2].x,
            height: 714 + 2 * this.padding[2].y,
          },
        ];
      },
      padding: [
        {
          x: 0,
          y: 36,
        },
        {
          x: 0,
          y: 0,
        },
        {
          x: 0,
          y: 0,
        },
      ],
    },
    /* "raw" is the general term used for total data element in the profile */
    raw: {
      interprets: {
        sub_clinical: "غیر بالینی",
        mild: "خفیف",
        moderate: "متوسط",
        severe: "شدید",
        extreme: "خیلی شدید",
      },
      stops: [0, 7, 15, 23, 31, 54],
      heightCoeff: 10,
    },
    page1: {
      /* "items" is the general term used for independent data elements to be drawn in the profile */
      items: {
        offsetY: 32 /* Horizontal offset between two top items */,
        get distanceY() {
          return this.offsetY + this.rect.body.height;
        } /* Horizontal distance between two top items */,
        maxValues: {
          [this.labels.L1.eng]: 36,
          [this.labels.L2.eng]: 32,
          [this.labels.L3.eng]: 16,
          [this.labels.L4.eng]: 4,
          [this.labels.L5.eng]: 8,
          [this.labels.L6.eng]: 4,
          [this.labels.L7.eng]: 40,
          [this.labels.L8.eng]: 8,
          [this.labels.L9.eng]: 16,
          [this.labels.L10.eng]: 20,
          [this.labels.L11.eng]: 8,
          [this.labels.L12.eng]: 4,
          [this.labels.L13.eng]: 4,
          [this.labels.L14.eng]: 4,
          [this.labels.L15.eng]: 28,
        } /* Maximum value of items */,
        rect: {
          base: {
            height: 4,
          },
          body: {
            height: 8,
            brs: {
              tl: 0,
              tr: 4,
              bl: 0,
              br: 0,
            },
          },
          widthCoeff: 6,
        },
      },
    },
    questionItems: {
      answers: [
        { fill: "#D4D4D8", fr: "صدق نمی‌کند" },
        { fill: "#FBBF24", fr: "خیلی کم" },
        { fill: "#F97316", fr: "کم" },
        { fill: "#EC4899", fr: "زیاد" },
        { fill: "#B91C1C", fr: "خیلی زیاد" },
      ],
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
      spec: { parameters: spec },
      dataset,
      questionsAppendix: QA,
    } = this;

    // Deconstructing the Spec of the Profile
    const { raw: rawSpec, page1: page1Spec, questionItems: questionItemsSpec } = spec;

    // Separate Raw Data from the Dataset
    const rawData = dataset.score.slice(-2);

    // Gathering required info for raw
    const raw = {
      mark: rawData[0].mark,
      interpret: {
        eng: rawData[1].mark,
        fr: rawSpec.interprets[rawData[1].mark],
      },
    };

    // Gathering required info for questions
    const questionItemsPart1Count = questionItemsSpec.answers.map((answerSpec, index) => ({
      answer: index,
      ...answerSpec,
      count: 0,
    }));
    const questionItemsPart1 = dataset.questions.slice(0, 58).map((question, index) => {
      questionItemsPart1Count[question.user_answered - 1].count++;
      return {
        ...QA[index],
        answer: question.user_answered - 1,
        fill: questionItemsSpec.answers[question.user_answered - 1].fill,
      };
    });
    const questionItemsPart2 = dataset.questions.slice(58).map((question, index) => ({
      ...QA[index + 58],
      answer: question.user_answered - 1,
      fill: questionItemsSpec.answers[question.user_answered - 1].fill,
    }));

    const questionItemsPart1Sorted = [...questionItemsPart1].sort((q1, q2) => q2.answer - q1.answer);

    // Gathering required info for page 1 items
    const page1Items = dataset.score.slice(0, 15).map((data, index) => ({
      label: data.label,
      mark: data.mark,
      maxValue: page1Spec.items.maxValues[data.label.eng],
      width: {
        base: page1Spec.items.maxValues[data.label.eng] * page1Spec.items.rect.widthCoeff,
        body: data.mark * page1Spec.items.rect.widthCoeff,
      },
    }));

    return [
      { items: page1Items, raw, suicideThoughts: questionItemsPart2[13].answer },
      {
        titleAppend: " - مرتب شده بر اساس سؤالات",
        questionItemsPart1Count,
        questionItemsPart1,
        questionItemsPart2,
        raw,
      },
      {
        titleAppend: " - مرتب شده بر اساس پاسخ‌ها",
        questionItemsPart1Count,
        questionItemsPart1Sorted,
        questionItemsPart2,
        raw,
      },
    ];
  }
}

module.exports = YBOCS93;
