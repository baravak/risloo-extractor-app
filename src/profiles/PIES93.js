import { Profile, FS } from "../profile";

const defaultSpec = {
  PIES93: {
    labels: {
      hope: {
        abbr: 'HO',
        fr: 'امید',
      },
      will: {
        abbr: 'W',
        fr: 'اراده (خواسته)',
      },
      purpose: {
        abbr: 'PU',
        fr: 'هدف‌مندی',
      },
      competence: {
        abbr: 'CO',
        fr: 'شایستگی',
      },
      fidelity: {
        abbr: 'FI',
        fr: 'صداقت (وفاداری)',
      },
      love: {
        abbr: 'LO',
        fr: 'عشق',
      },
      care: {
        abbr: 'CA',
        fr: 'مراقبت',
      },
      wisdom: {
        abbr: 'WI',
        fr: 'خرد (فرزانگی)',
      },
      raw: {
        abbr: '#',
        fr: 'نمره کل',
      }
    }
  }
};

class PIES93 extends Profile {

  constructor(dataset, config = {}) {
    super(dataset, config, defaultSpec);
  }

  _calcContext() {

  }

}

module.exports = PIES93;