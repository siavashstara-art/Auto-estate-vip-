export type ListingCategory =
  | 'imported-cars'
  | 'domestic-cars'
  | 'apartments-penthouses'
  | 'villas-land'
  | 'presale-projects'
  | 'instant-barter';

export type AssetKind = 'car' | 'property';

export interface VehicleInspection {
  paintFree: boolean;
  chassisSealed: boolean;
  realMileageKm: number;
  year: string;
  gearboxHealth: string;
  engineHealth: string;
  certificateCode: string;
  zones: {
    hoodMicron: number;
    roofMicron: number;
    trunkMicron: number;
    frontLeftDoorMicron: number;
    frontRightDoorMicron: number;
    rearLeftFenderMicron: number;
    rearRightFenderMicron: number;
    statusNoteFa: string;
    statusNoteEn: string;
  };
}

export interface PropertyDeed {
  deedTypeFa: string;
  deedTypeEn: string;
  completionCertFa: string;
  completionCertEn: string;
  areaSqm: number;
  bedrooms: number;
  buildYear: string;
  registrationPlaque: string;
  residencyBonusFa: string;
  residencyBonusEn: string;
}

export interface LuxuryListing {
  id: string;
  category: ListingCategory;
  assetKind: AssetKind;
  featuredBarter: boolean;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  locationFa: string;
  locationEn: string;
  // Prices in Billion Tomans for Iran market, and USD/AED/EUR for International market
  priceTomanBillion: number;
  priceUsd: number;
  priceAed: number;
  priceEur: number;
  image: string;
  barterConditionFa: string;
  barterConditionEn: string;
  leasingTermsFa: string;
  leasingTermsEn: string;
  specsFa: string[];
  specsEn: string[];
  inspection?: VehicleInspection;
  propertyDeed?: PropertyDeed;
}

export const LUXURY_LISTINGS: LuxuryListing[] = [
  {
    id: 'ae-01',
    category: 'imported-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'مرسدس بنز S500 L AMG Line مدل ۲۰۲۴',
    titleEn: '2024 Mercedes-Benz S500 L AMG Line',
    subtitleFa: 'فول آپشن ۴MATIC · سیستم صوتی Burmester 4D · پلاک ملی / گذر و منطقه آزاد',
    subtitleEn: 'Full Option 4MATIC · Burmester 4D Surround · Showroom Condition',
    locationFa: 'تهران، فرشته (گالری رویال) / دبی، شیخ زاید',
    locationEn: 'Fereshteh, Tehran / Sheikh Zayed Rd, Dubai',
    priceTomanBillion: 28.5,
    priceUsd: 165000,
    priceAed: 605000,
    priceEur: 152000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'قابل تهاتر با پنت‌هاوس یا آپارتمان سند تک‌برگ منطقه ۱ تهران یا ویلا لواسان',
    barterConditionEn: 'Eligible for Barter with District 1 Penthouse or Lavasan Luxury Villa',
    leasingTermsFa: '۵۰٪ نقد + ۱۲ فقره چک صیادی ثبتی ماهانه',
    leasingTermsEn: '50% Down Payment + 12 Monthly Post-Dated Cheques',
    specsFa: ['بدون رنگ (پلمپ کمپانی)', 'کارکرد: ۱,۸۰۰ کیلومتر واقعی', 'شاسی و ستون ۱۰۰٪ پلمپ'],
    specsEn: ['100% Original Factory Paint', 'Mileage: 1,800 km Verified', 'Sealed Chassis & Pillars'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 1800,
      year: '2024 / ۱۴۰۳',
      gearboxHealth: '۱۰۰٪ سالم (9G-TRONIC پلمپ)',
      engineHealth: '۱۰۰٪ سالم (۶ سیلندر خطی توربو EQ Boost)',
      certificateCode: 'AE-INSP-99401',
      zones: {
        hoodMicron: 112,
        roofMicron: 108,
        trunkMicron: 110,
        frontLeftDoorMicron: 115,
        frontRightDoorMicron: 114,
        rearLeftFenderMicron: 116,
        rearRightFenderMicron: 115,
        statusNoteFa: 'تمامی قطعات بدنه فابریک کارخانه با کاور محافظتی PPF مات؛ بدون کوچک‌ترین لیسه یا صافکاری.',
        statusNoteEn: 'All body panels retain factory paint thickness (108-116μm) with full-body satin PPF protection.',
      },
    },
  },
  {
    id: 'ae-02',
    category: 'apartments-penthouses',
    assetKind: 'property',
    featuredBarter: true,
    titleFa: 'پنت‌هاوس ۴۲۰ متری الهیه با تراس گاردن اختصاصی',
    titleEn: '420 sqm Sky Penthouse in Elahiyeh / Dubai Marina View',
    subtitleFa: '۴ خواب مستر رویال · ۳ پارکینگ سندی باکس · لابی مجلل و استخر چهارفصل',
    subtitleEn: '4 Royal Master Suites · 3 Box Parkings · Private Rooftop Pool',
    locationFa: 'تهران، الهیه، خیابان خزر شمالی / دبی مارینا',
    locationEn: 'Elahiyeh, Tehran / Dubai Marina',
    priceTomanBillion: 92.0,
    priceUsd: 1450000,
    priceAed: 5325000,
    priceEur: 1340000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'تهاتر تا ۶۰٪ مبلغ با ۲ یا ۳ دستگاه خودروی لوکس وارداتی + مابه‌التفاوت نقدی یا چک صیادی',
    barterConditionEn: 'Barter up to 60% with 2-3 Luxury Vehicles + Cash / Check Balance',
    leasingTermsFa: '۶۰٪ همزمان با عقد قرارداد + ۳۰٪ اقساط ۶ ماهه + ۱۰٪ محضر',
    leasingTermsEn: '60% Upon Contract + 30% over 6 Months + 10% Title Transfer',
    specsFa: ['سند تک‌برگ شخصی (آماده محضر)', 'پایان‌کار ۱۴۰۳ شهرداری منطقه ۱', '۴۲۰ متر بنا + ۸۰ متر تراس'],
    specsEn: ['Single-Page Freehold Title Deed', '2024 Municipal Completion Cert', '420 sqm Interior + 80 sqm Terrace'],
    propertyDeed: {
      deedTypeFa: 'سند تک‌برگ شش‌دانگ ملکیت (بدون رهن و بازداشت)',
      deedTypeEn: 'Freehold Single-Page Title Deed (Zero Encumbrance)',
      completionCertFa: 'گواهی پایان‌کار و عدم خلافی صادر شده در مهر ۱۴۰۳',
      completionCertEn: 'Municipal Completion & Clearance Certificate (Issued Oct 2024)',
      areaSqm: 420,
      bedrooms: 4,
      buildYear: '1403 / 2024',
      registrationPlaque: 'ثبت شمیرانات — پلاک ثبتی ۱۴۸۲/۹۴',
      residencyBonusFa: 'واجد شرایط دریافت اقامت طلایی ۱۰ ساله امارات (در صورت انتخاب واحد معادل دبی مارینا)',
      residencyBonusEn: 'Eligible for 10-Year UAE Golden Visa (Dubai Marina Twin Portfolio Option)',
    },
  },
  {
    id: 'ae-03',
    category: 'imported-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'پورشه ماکان GTS پکیج کربن مدل ۲۰۲۳',
    titleEn: '2023 Porsche Macan GTS Carbon Package',
    subtitleFa: 'موتور ۲.۹ لیتری توئین‌توربو ۴۴۰ اسب‌بخار · کرونو پکیج · سیستم اگزوز اسپرت',
    subtitleEn: '2.9L Twin-Turbo V6 440 HP · Sport Chrono · Active Sport Exhaust',
    locationFa: 'تهران، نیاوران / استانبول، شیشلی',
    locationEn: 'Niavaran, Tehran / Sisli, Istanbul',
    priceTomanBillion: 19.8,
    priceUsd: 118000,
    priceAed: 433000,
    priceEur: 109000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'معاوضه مستقیم با آپارتمان ۱۲۰ تا ۱۵۰ متری شمال تهران یا زمین سنددار کردان',
    barterConditionEn: 'Direct Swap with 120-150 sqm North Tehran Apartment or Kordan Plot',
    leasingTermsFa: '۵۵٪ نقد + ۱۰ فقره چک صیادی ثبتی',
    leasingTermsEn: '55% Down Payment + 10 Registered Installment Cheques',
    specsFa: ['بدون رنگ و خط و خش', 'کارکرد: ۸,۴۰۰ کیلومتر', 'گیربکس PDK پلمپ با رزومه نمایندگی'],
    specsEn: ['Zero Paintwork · Showroom Spec', 'Mileage: 8,400 km', 'PDK Transmission Factory Sealed'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 8400,
      year: '2023 / ۱۴۰۲',
      gearboxHealth: '۱۰۰٪ سالم (۷ سرعته دوکلاچه PDK)',
      engineHealth: '۱۰۰٪ سالم (۶ سیلندر بای‌تربو ۴۴۰ اسب‌بخار)',
      certificateCode: 'AE-INSP-88219',
      zones: {
        hoodMicron: 118,
        roofMicron: 110,
        trunkMicron: 114,
        frontLeftDoorMicron: 117,
        frontRightDoorMicron: 116,
        rearLeftFenderMicron: 119,
        rearRightFenderMicron: 118,
        statusNoteFa: 'بدنه کاملاً بدون رنگ، شاسی جلو و عقب پلمپ، تست دیاگ پورشه بدون ارور.',
        statusNoteEn: '100% factory paintwork, front and rear chassis rails intact, zero diagnostic fault codes.',
      },
    },
  },
  {
    id: 'ae-04',
    category: 'instant-barter',
    assetKind: 'property',
    featuredBarter: true,
    titleFa: 'آپارتمان ۱۲۰ متری نوساز سعادت‌آباد (ویژه تهاتر با ۲ خودرو)',
    titleEn: '120 sqm Luxury Apartment in Saadat Abad (2-Car Barter Special)',
    subtitleFa: '۲ خواب مستر · طبقه ۶ جنوبی غرق نور · فرنیش کامل بوش آلمان',
    subtitleEn: '2 Master Bedrooms · 6th Floor South-Facing · Full Bosch Kitchen',
    locationFa: 'تهران، سعادت‌آباد، میدان کاج / آلانیا، ترکیه',
    locationEn: 'Saadat Abad, Tehran / Alanya Waterfront, Turkey',
    priceTomanBillion: 21.6,
    priceUsd: 340000,
    priceAed: 1248000,
    priceEur: 312000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'پیشنهاد ویژه: معاوضه با ۲ دستگاه خودروی وارداتی یا چینی صفر + نقد (تطبیق فوری)',
    barterConditionEn: 'Special Offer: Swap with 2 Imported/New Vehicles + Cash Difference',
    leasingTermsFa: '۷۰٪ خودرو یا نقد + ۳۰٪ چک صیادی ۶ ماهه',
    leasingTermsEn: '70% Vehicle/Cash + 30% 6-Month Registered Checks',
    specsFa: ['سند تک‌برگ آماده انتقال', 'پایان‌کار ۱۴۰۳', '۲ پارکینگ سندی کنار هم'],
    specsEn: ['Single-Page Deed Ready', '2024 Completion Cert', '2 Side-by-Side Deeded Parkings'],
    propertyDeed: {
      deedTypeFa: 'سند تک‌برگ شش‌دانگ مسکونی (آزاد و قابل انتقال فوری)',
      deedTypeEn: 'Freehold Residential Single-Page Deed (Ready for Instant Transfer)',
      completionCertFa: 'گواهی پایان‌کار شهرداری منطقه ۲ تهران',
      completionCertEn: 'District 2 Municipality Completion Certificate',
      areaSqm: 120,
      bedrooms: 2,
      buildYear: '1403 / 2024',
      registrationPlaque: 'ثبت غرب تهران — پلاک ثبتی ۲۳۱۰/۱۱۸',
      residencyBonusFa: 'قابل تبدیل به واحد ساحلی ترکیه جهت اخذ اقامت دائمی خانواده',
      residencyBonusEn: 'Convertible to Turkish Coastal Residence Portfolio for Family Residency',
    },
  },
  {
    id: 'ae-05',
    category: 'villas-land',
    assetKind: 'property',
    featuredBarter: true,
    titleFa: 'ویلا دوبلکس مدرن ۸۵۰ متری شهرک برند کردان / متل قو',
    titleEn: '850 sqm Modern Duplex Villa in Gated Kordan / Caspian Coast',
    subtitleFa: '۵۵۰ متر بنای تریبلکس · استخر آبگرم چهارفصل · سند شش‌دانگ عرصه و اعیان',
    subtitleEn: '550 sqm Triplex Architecture · Heated Infinity Pool · Full Six-Dang Deed',
    locationFa: 'کردان، شهرک برند زعفرانیه / قبرس شمالی، گیرنه',
    locationEn: 'Kordan Gated Estate / Kyrenia, Northern Cyprus',
    priceTomanBillion: 44.0,
    priceUsd: 690000,
    priceAed: 2530000,
    priceEur: 635000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'تهاتر کامل با خودروی لوکس (بنز، بی‌ام‌و، لندکروزر) یا آپارتمان کوچک‌تر در تهران',
    barterConditionEn: 'Full Barter with Luxury SUVs (Mercedes, BMW, Land Cruiser) or Tehran Flat',
    leasingTermsFa: '۵۰٪ نقد یا خودرو + ۵۰٪ اقساط ۱۲ ماهه با چک صیادی',
    leasingTermsEn: '50% Cash or Vehicle + 50% in 12 Monthly Checks',
    specsFa: ['سند تک‌برگ عرصه و اعیان', 'انشعابات قانونی کنتور مجزا', 'نگهبانی ۲۴ ساعته شهرک'],
    specsEn: ['Full Land & Building Deed', 'Legal Utility Meters', '24/7 Gated Security'],
    propertyDeed: {
      deedTypeFa: 'سند تک‌برگ شش‌دانگ عرصه و اعیان (باغ‌ویلا مسکونی)',
      deedTypeEn: 'Full Freehold Land & Villa Title Deed',
      completionCertFa: 'پایان‌کار بخشداری و جهاد کشاورزی (تغییر کاربری قانونی)',
      completionCertEn: 'Official Completion & Legal Residential Zoning Permit',
      areaSqm: 850,
      bedrooms: 5,
      buildYear: '1402 / 2023',
      registrationPlaque: 'ثبت ساوجبلاغ — پلاک ثبتی ۷۷۴/۱۲',
      residencyBonusFa: 'امکان معاوضه هم‌ارزش با ویلای ساحلی قبرس شمالی به همراه اقامت فوری',
      residencyBonusEn: 'Direct Swap Option with Northern Cyprus Beachfront Villa + Residency',
    },
  },
  {
    id: 'ae-06',
    category: 'imported-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'بی‌ام‌و 740Li xDrive فیس‌لیفت نیوکیس',
    titleEn: 'BMW 740Li xDrive Executive Lounge',
    subtitleFa: 'پکیج M-Sport · تئاتر اسکرین عقب · سیستم تعلیق بادی هوشمند · سقف اسکای‌لانژ',
    subtitleEn: 'M-Sport Package · Rear Theatre Screen · Adaptive Air Suspension · Sky Lounge',
    locationFa: 'تهران، زعفرانیه / دبی، داون‌تاون',
    locationEn: 'Zafaranieh, Tehran / Downtown Dubai',
    priceTomanBillion: 24.2,
    priceUsd: 142000,
    priceAed: 521000,
    priceEur: 131000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'معاوضه با آپارتمان مسکونی، مغازه تجاری یا ۲ دستگاه خودروی صفر کیلومتر',
    barterConditionEn: 'Barter with Residential Apartment, Commercial Retail or 2 New Cars',
    leasingTermsFa: '۵۰٪ پیش‌پرداخت + ۱۸ قسط ماهانه با چک صیادی بنفش',
    leasingTermsEn: '50% Down Payment + 18 Monthly Registered Sayadi Checks',
    specsFa: ['بدون رنگ (گواهی عبادی)', 'کارکرد: ۱۲,۰۰۰ کیلومتر', 'فول رادار و وکیوم چهار درب'],
    specsEn: ['100% Paint-Free Certified', 'Mileage: 12,000 km', 'Full Radar & Soft-Close Doors'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 12000,
      year: '2023 / ۱۴۰۲',
      gearboxHealth: '۱۰۰٪ سالم (۸ سرعته Steptronic اسپرت)',
      engineHealth: '۱۰۰٪ سالم (۳.۰ لیتری TwinPower Turbo)',
      certificateCode: 'AE-INSP-77310',
      zones: {
        hoodMicron: 120,
        roofMicron: 115,
        trunkMicron: 118,
        frontLeftDoorMicron: 121,
        frontRightDoorMicron: 119,
        rearLeftFenderMicron: 122,
        rearRightFenderMicron: 120,
        statusNoteFa: 'کارشناسی رسمی رنگ و فنی با برگه هولوگرام‌دار؛ شاسی، سینی و ستون‌ها کاملاً فابریک.',
        statusNoteEn: 'Hologram-certified inspection; all chassis rails, pillars, and panels 100% original.',
      },
    },
  },
  {
    id: 'ae-07',
    category: 'domestic-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'فونیکس تیگو ۸ پرو مکس IE دو دیفرانسیل صفر خشک ۱۴۰۳',
    titleEn: '2024 Fownix Tiggo 8 Pro Max IE AWD (Zero KM)',
    subtitleFa: 'موتور ۲.۰ لیتری توربو GDI · ۷ نفره لوکس · گارانتی ۷ ساله فعال · تحویل روز',
    subtitleEn: '2.0L Turbo GDI AWD · 7-Seater Luxury SUV · 7-Year Active Factory Warranty',
    locationFa: 'تهران، سعادت‌آباد (اتوگالری مرکزی)',
    locationEn: 'Saadat Abad Central Showroom, Tehran',
    priceTomanBillion: 3.45,
    priceUsd: 54000,
    priceAed: 198000,
    priceEur: 49800,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'بهترین گزینه جهت دادن به عنوان پیش‌پرداخت تهاتر آپارتمان یا ویلا (معاوضه ۱ یا ۲ دستگاه)',
    barterConditionEn: 'Ideal High-Liquidity Asset for Apartment/Villa Barter Down Payment',
    leasingTermsFa: '۴۵٪ نقد + ۲۴ قسط ماهانه با چک صیادی (تحویل ۱ ساعته)',
    leasingTermsEn: '45% Down Payment + 24 Monthly Sayadi Checks (1-Hour Delivery)',
    specsFa: ['صفر کیلومتر خشک (پلاک شده)', 'بدون رنگ · پلمپ کارخانه', 'سند آزاد آماده تعویض پلاک'],
    specsEn: ['Zero KM Brand New', 'Factory Sealed Paint & Body', 'Title Ready for Instant Transfer'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 45,
      year: '1403 / 2024',
      gearboxHealth: '۱۰۰٪ سالم (۷ سرعته دوکلاچه تر WDCT)',
      engineHealth: '۱۰۰٪ سالم (۲۵۴ اسب‌بخار ۳۹۰ نیوتن‌متر)',
      certificateCode: 'AE-INSP-66104',
      zones: {
        hoodMicron: 105,
        roofMicron: 102,
        trunkMicron: 104,
        frontLeftDoorMicron: 106,
        frontRightDoorMicron: 105,
        rearLeftFenderMicron: 107,
        rearRightFenderMicron: 106,
        statusNoteFa: 'خودرو صفر خشک کارخانه، تحویل مستقیم از نمایندگی روی خودروبر به پارکینگ نمایشگاه.',
        statusNoteEn: 'Brand-new zero-km showroom delivery transported via flatbed carrier.',
      },
    },
  },
  {
    id: 'ae-08',
    category: 'presale-projects',
    assetKind: 'property',
    featuredBarter: true,
    titleFa: 'پروژه پیش‌فروش برج باغ رویال ولنجک / دبی کریک هاربر',
    titleEn: 'Off-Plan Royal Garden Tower Velenjak / Dubai Creek Harbour',
    subtitleFa: 'واحدهای ۱۸۰ تا ۳۲۰ متری · تحویل ۱۲ ماهه · سازنده برند گرید A با تضمین محضری',
    subtitleEn: '180–320 sqm Residences · 12-Month Handover · Grade-A Developer Escrow',
    locationFa: 'تهران، ولنجک، خیابان سیزدهم / دبی کریک هاربر',
    locationEn: 'Velenjak 13th St, Tehran / Dubai Creek Harbour',
    priceTomanBillion: 36.0,
    priceUsd: 580000,
    priceAed: 2130000,
    priceEur: 535000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'پیش‌پرداخت قابل تهاتر با خودروی صفر یا کارکرده + اقساط ۱۸ ماهه بدون بهره بر اساس پیشرفت پروژه',
    barterConditionEn: 'Down Payment Payable via Vehicle Barter + 18-Month 0% Construction Installments',
    leasingTermsFa: '۴۰٪ پیش‌پرداخت (نقد یا خودرو) + ۵۰٪ اقساط ۱۸ ماهه + ۱۰٪ تحویل و سند',
    leasingTermsEn: '40% Down (Cash/Car) + 50% 18-Month Installments + 10% on Handover',
    specsFa: ['پیش‌سند رسمی محضری با کد رهگیری', 'پروانه ساختمانی و اسکلت تکمیل‌شده (۸۰٪ پیشرفت)', 'سود تضمینی ساخت + ارزش افزوده منطقه'],
    specsEn: ['Notarized Pre-Deed with Escrow Code', '80% Structural Completion', 'High Capital Appreciation Guarantee'],
    propertyDeed: {
      deedTypeFa: 'سند مادر شش‌دانگ + تنظیم قرارداد پیش‌فروش رسمی در دفترخانه اسناد رسمی',
      deedTypeEn: 'Master Freehold Deed + Official Notarized Off-Plan Escrow Contract',
      completionCertFa: 'پروانه ساختمانی قطعی و تاییدیه مهندسین ناظر (مرحله نازک‌کاری)',
      completionCertEn: 'Approved Building Permit & Structural Engineering Sign-Off (80% Complete)',
      areaSqm: 210,
      bedrooms: 3,
      buildYear: 'تحویل ۱۴۰۴ / 2025',
      registrationPlaque: 'ثبت شمیرانات — پلاک ثبتی ۱۹۰۵/۴۴',
      residencyBonusFa: 'واجد شرایط ویزای طلایی ۱۰ ساله دبی با پیش‌پرداخت ۲۰٪ در پروژه همتا',
      residencyBonusEn: 'Qualifies for 10-Year UAE Golden Visa with 20% Down in Twin Dubai Project',
    },
  },
  {
    id: 'ae-09',
    category: 'imported-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'تویوتا لندکروزر سری ۳۰۰ VXR توئین‌توربو ۲۰۲۴',
    titleEn: '2024 Toyota Land Cruiser 300 Series VXR Twin-Turbo',
    subtitleFa: 'موتور ۳.۵ لیتری ۶ سیلندر توئین‌توربو · کیت فابریک VXR · کولباکس و ۳ مانیتور',
    subtitleEn: '3.5L V6 Twin-Turbo · Full VXR Executive Spec · Coolbox & Rear Entertainment',
    locationFa: 'کیش / دبی، العویر (بازار بین‌المللی و گذر موقت)',
    locationEn: 'Kish Free Zone / Al Aweer Auto Market, Dubai',
    priceTomanBillion: 16.5,
    priceUsd: 112000,
    priceAed: 411000,
    priceEur: 103000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'تهاتر فوری با زمین ساحلی شمال، آپارتمان تهران یا تسویه ارزی/ریالی',
    barterConditionEn: 'Instant Barter with Coastal Land, Tehran Apartment or Multi-Currency Settlement',
    leasingTermsFa: '۵۰٪ نقد + ۱۲ قسط ماهانه (تحویل فوری)',
    leasingTermsEn: '50% Down Payment + 12 Monthly Installments (Immediate Delivery)',
    specsFa: ['صفر کیلومتر (پلمپ کمپانی)', 'شاسی نردبانی TNGA-F پلمپ', 'گارانتی بین‌المللی الفطیم'],
    specsEn: ['Zero KM Factory New', 'TNGA-F Ladder Frame Intact', 'Al-Futtaim International Warranty'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 120,
      year: '2024 / ۱۴۰۳',
      gearboxHealth: '۱۰۰٪ سالم (۱۰ سرعته اتوماتیک هوشمند)',
      engineHealth: '۱۰۰٪ سالم (۴۰۹ اسب‌بخار ۶۵۰ نیوتن‌متر)',
      certificateCode: 'AE-INSP-55091',
      zones: {
        hoodMicron: 110,
        roofMicron: 108,
        trunkMicron: 109,
        frontLeftDoorMicron: 112,
        frontRightDoorMicron: 111,
        rearLeftFenderMicron: 113,
        rearRightFenderMicron: 112,
        statusNoteFa: 'رنگ صدفی اورجینال کارخانه ژاپن؛ بدون کوچک‌ترین خط و خش یا رنگ‌شدگی.',
        statusNoteEn: 'Original Japanese Pearl White factory paintwork; zero blemishes or touch-ups.',
      },
    },
  },
  {
    id: 'ae-10',
    category: 'domestic-cars',
    assetKind: 'car',
    featuredBarter: true,
    titleFa: 'کی‌ام‌سی T9 پیکاپ دوکابین اتوماتیک صفر ۱۴۰۳ + دیگنیتی پرستیژ',
    titleEn: '2024 KMC T9 4WD Pickup + Dignity Prestige Twin Package',
    subtitleFa: 'پکیج ۲ دستگاهی خودروی صفر داخلی ویژه تهاتر با آپارتمان (قابل خرید تکی یا زوجی)',
    subtitleEn: 'Twin Zero-KM Domestic SUV & Pickup Bundle Optimized for Real Estate Barter',
    locationFa: 'تهران، شهرک راه آهن (اتوگالری وی‌آی‌پی)',
    locationEn: 'Shahrak-e Rahahan VIP Auto Gallery, Tehran',
    priceTomanBillion: 5.2,
    priceUsd: 82000,
    priceAed: 301000,
    priceEur: 75500,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',
    barterConditionFa: 'پکیج طلایی معاوضه با آپارتمان یا ویلا بدون افت قیمت نقدشوندگی',
    barterConditionEn: 'Golden Barter Bundle for Apartment/Villa Swap with Instant Liquidity',
    leasingTermsFa: '۴۰٪ پیش‌پرداخت + اقساط ۶ تا ۲۴ ماهه با چک صیادی',
    leasingTermsEn: '40% Down Payment + 6 to 24 Months Sayadi Check Installments',
    specsFa: ['هر دو دستگاه صفر خشک ۱۴۰۳', 'برگه کارشناسی ۱۰۰٪ بدون رنگ', 'تحویل همزمان با وکالت تعویض پلاک'],
    specsEn: ['Both Units 2024 Zero KM', '100% Paint-Free Certified', 'Immediate Delivery & Plate Power of Attorney'],
    inspection: {
      paintFree: true,
      chassisSealed: true,
      realMileageKm: 30,
      year: '1403 / 2024',
      gearboxHealth: '۱۰۰٪ سالم (اتوماتیک ۸ سرعته ZF)',
      engineHealth: '۱۰۰٪ سالم (توربوشارژ GDI پلمپ کارخانه)',
      certificateCode: 'AE-INSP-44802',
      zones: {
        hoodMicron: 104,
        roofMicron: 101,
        trunkMicron: 103,
        frontLeftDoorMicron: 105,
        frontRightDoorMicron: 104,
        rearLeftFenderMicron: 106,
        rearRightFenderMicron: 105,
        statusNoteFa: 'پکیج کارشناسی‌شده با تضمین سلامت ۱۰۰٪ بدنه و شاسی در قولنامه رسمی نمایشگاه.',
        statusNoteEn: 'Showroom guaranteed 100% body and chassis integrity written in official contract.',
      },
    },
  },
];

export interface VipTier {
  level: number;
  nameFa: string;
  nameEn: string;
  priceFa: string;
  priceEn: string;
  commissionBonus: string;
  featuresFa: string[];
  featuresEn: string[];
  highlighted?: boolean;
}

export const VIP_TIERS: VipTier[] = [
  {
    level: 1,
    nameFa: 'سطح ۱: برنز (مشاورین مستقل)',
    nameEn: 'Tier 1: Bronze (Independent Agent)',
    priceFa: '۲.۹ میلیون تومان / ماه',
    priceEn: '$49 / month',
    commissionBonus: '۱۰٪ پورسانت معرفی',
    featuresFa: ['ثبت تا ۱۵ آگهی لوکس خودرو و ملک', 'دسترسی به ماشین‌حساب اقساط و کمیسیون', 'خروجی استوری‌ساز با واترمارک استاندارد'],
    featuresEn: ['Up to 15 Luxury Car & Property Listings', 'Leasing & Commission Calculators', 'Standard HD Story Poster Export'],
  },
  {
    level: 2,
    nameFa: 'سطح ۲: نقره‌ای (نمایشگاه و دفتر املاک)',
    nameEn: 'Tier 2: Silver (Showroom & Agency)',
    priceFa: '۵.۸ میلیون تومان / ماه',
    priceEn: '$99 / month',
    commissionBonus: '۱۸٪ پورسانت معرفی',
    featuresFa: ['ثبت تا ۵۰ آگهی ویژه با تگ کارشناسی دیجیتال', 'موتور هوشمند تطبیق خودکار تهاتر', 'استوری‌ساز اختصاصی با لوگو و شماره گالری شما'],
    featuresEn: ['Up to 50 Listings with Digital Inspection Cards', 'Smart Barter Match Engine Access', 'Custom Branded 1080x1920 Story Maker'],
  },
  {
    level: 3,
    nameFa: 'سطح ۳: طلایی (اتوگالری و هلدینگ VIP)',
    nameEn: 'Tier 3: Gold (VIP Gallery & Holding)',
    priceFa: '۹.۵ میلیون تومان / ماه',
    priceEn: '$179 / month',
    commissionBonus: '۲۵٪ پورسانت فروش White-Label',
    featuresFa: ['آگهی نامحدود در بازار ایران و بین‌الملل (دبی/ترکیه)', 'دستیار هوش مصنوعی کارشناس قرارداد و تهاتر', 'صدور آنی پیش‌فاکتور رسمی لیزینگ واتساپ'],
    featuresEn: ['Unlimited Iran & International (Dubai/Turkey) Listings', 'AI Contract & Barter Valuation Advisor', 'Instant WhatsApp Leasing Pro-Forma Generator'],
    highlighted: true,
  },
  {
    level: 4,
    nameFa: 'سطح ۴: پلاتینیوم (نمایندگی White-Label)',
    nameEn: 'Tier 4: Platinum (White-Label Franchise)',
    priceFa: '۱۸.۵ میلیون تومان / ماه',
    priceEn: '$349 / month',
    commissionBonus: '۳۵٪ پورسانت فروش مستقیم',
    featuresFa: ['دامنه و برند اختصاصی نمایشگاه شما (White-Label کامل)', 'اپلیکیشن اختصاصی PWA و خروجی اندروید APK/AAB', 'پنل مدیریت چک‌های صیادی و مشتریان VIP'],
    featuresEn: ['Custom Showroom Domain & Full White-Label Branding', 'Dedicated PWA & Android APK/AAB Package', 'Sayadi Check & VIP Client CRM Suite'],
  },
  {
    level: 5,
    nameFa: 'سطح ۵: رویال نیومتاورسیتی (FBNM Enterprise)',
    nameEn: 'Tier 5: Royal NewMetaverCity (FBNM Enterprise)',
    priceFa: '۳۵.۰ میلیون تومان / ماه',
    priceEn: '$690 / month',
    commissionBonus: '۴۵٪ پورسانت باشگاه ویزیتورها',
    featuresFa: ['اتصال مستقیم به اکوسیستم آفرینش و توان استیج FBNM', 'حق انحصاری فروش سورس و اعطای نمایندگی استانی', 'پشتیبانی VIP اختصاصی و درگاه پرداخت بین‌المللی'],
    featuresEn: ['Full Creation Ecosystem & Tavan Stage FBNM Integration', 'Provincial Sub-Licensing & Source Distribution Rights', 'Dedicated 24/7 Concierge & Multi-Currency Gateway'],
  },
];
