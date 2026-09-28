import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Calculator,
  Car,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  GitBranch,
  Globe,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  LUXURY_LISTINGS,
  LuxuryListing,
  ListingCategory,
  VIP_TIERS,
} from './data/listingsData';
import { usePWAInstall } from './hooks/usePWAInstall';
import { InspectionModal } from './components/InspectionModal';
import { StoryMakerModal } from './components/StoryMakerModal';

type MarketMode = 'iran' | 'intl';
type IntlCurrency = 'AED' | 'USD' | 'EUR';
type LangMode = 'fa' | 'en';

export default function App() {
  // 1. Market & Language State
  const [market, setMarket] = useState<MarketMode>('iran');
  const [intlCurrency, setIntlCurrency] = useState<IntlCurrency>('AED');
  const [lang, setLang] = useState<LangMode>('fa');
  const isFa = lang === 'fa';

  useEffect(() => {
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = isFa ? 'fa' : 'en';
  }, [isFa]);

  // 2. PWA & Modals State
  const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWAInstall();
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedInspectionListing, setSelectedInspectionListing] = useState<LuxuryListing | null>(null);
  const [selectedStoryListing, setSelectedStoryListing] = useState<LuxuryListing | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // 3. Showcase Filter State
  const [activeCategory, setActiveCategory] = useState<'all' | ListingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Smart Barter Match Engine State
  const [myAssetType, setMyAssetType] = useState<'property' | 'car'>('property');
  const [myAssetTitle, setMyAssetTitle] = useState(
    'آپارتمان ۱۲۰ متری نوساز سعادت‌آباد (سند تک‌برگ)'
  );
  const [myAssetValueBillion, setMyAssetValueBillion] = useState<number>(21.6);
  const [myExtraCashBillion, setMyExtraCashBillion] = useState<number>(2.5);
  const [preferredTargetType, setPreferredTargetType] = useState<'all' | 'car' | 'property'>('car');

  // 5. Dual Calculator State (Leasing + Legal Commission)
  const [calcTab, setCalcTab] = useState<'leasing' | 'commission'>('leasing');
  const [leasingVehiclePrice, setLeasingVehiclePrice] = useState<number>(19.8); // Billion Toman (or x10k USD)
  const [leasingVehicleTitle, setLeasingVehicleTitle] = useState<string>(
    'پورشه ماکان GTS پکیج کربن مدل ۲۰۲۳'
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(50);
  const [leasingMonths, setLeasingMonths] = useState<number>(12);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState<number>(3.5);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Legal Commission Calculator State
  const [dealType, setDealType] = useState<'property-sale' | 'auto-sale'>('property-sale');
  const [dealTotalBillion, setDealTotalBillion] = useState<number>(28.5);

  // 6. AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'سلام! من کارشناس هوشمند خودرو، املاک لوکس و معاملات تهاتر AutoEstate VIP هستم. می‌توانید درباره فرمول معاوضه آپارتمان با خودرو، شرایط اقساط با چک صیادی ثبتی، کارشناسی رنگ و بدنه یا خرید ملک در دبی و ترکیه با ویزای طلایی سوال خود را بپرسید.',
    },
  ]);

  // 7. VIP & Marketers Club State
  const [selectedVipTier, setSelectedVipTier] = useState<number | null>(null);
  const [marketerSalesCount, setMarketerSalesCount] = useState<number>(8);
  const [marketerPlanPrice, setMarketerPlanPrice] = useState<number>(18.5); // Million Toman
  const [marketerPhone, setMarketerPhone] = useState('09120000000');
  const [copiedRefLink, setCopiedRefLink] = useState(false);

  // 8. GitHub Direct Push State
  const [ghToken, setGhToken] = useState('');
  const [ghOwner, setGhOwner] = useState('');
  const [ghRepo, setGhRepo] = useState('autoestate-vip');
  const [ghBranch, setGhBranch] = useState('main');
  const [ghStatus, setGhStatus] = useState<{
    loading: boolean;
    error?: string;
    successUrl?: string;
    filesCount?: number;
  }>({ loading: false });

  // Price Formatter Helper
  const formatPrice = (listing: LuxuryListing): string => {
    if (market === 'iran') {
      return isFa
        ? `${listing.priceTomanBillion.toLocaleString('fa-IR')} میلیارد تومان`
        : `${listing.priceTomanBillion.toLocaleString('en-US')}B Toman`;
    }
    if (intlCurrency === 'AED') {
      return `${listing.priceAed.toLocaleString('en-US')} AED`;
    }
    if (intlCurrency === 'EUR') {
      return `€${listing.priceEur.toLocaleString('en-US')}`;
    }
    return `$${listing.priceUsd.toLocaleString('en-US')}`;
  };

  const formatNumericValue = (billionToman: number): string => {
    if (market === 'iran') {
      return isFa
        ? `${billionToman.toFixed(2)} میلیارد تومان`
        : `${billionToman.toFixed(2)}B Toman`;
    }
    // Convert roughly for display when in international mode (1B Toman ~ 16,000 USD / 58,700 AED / 14,700 EUR)
    if (intlCurrency === 'AED') {
      return `${Math.round(billionToman * 58700).toLocaleString('en-US')} AED`;
    }
    if (intlCurrency === 'EUR') {
      return `€${Math.round(billionToman * 14700).toLocaleString('en-US')}`;
    }
    return `$${Math.round(billionToman * 16000).toLocaleString('en-US')}`;
  };

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return LUXURY_LISTINGS.filter((item) => {
      const matchesCat =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        (activeCategory === 'instant-barter' && item.featuredBarter);
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.titleFa.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.locationFa.toLowerCase().includes(q) ||
        item.locationEn.toLowerCase().includes(q) ||
        item.barterConditionFa.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  // Smart Barter Match Engine Computations
  const barterMatches = useMemo(() => {
    const totalBudget = myAssetValueBillion + myExtraCashBillion;
    const candidates = LUXURY_LISTINGS.filter((item) =>
      preferredTargetType === 'all' ? true : item.assetKind === preferredTargetType
    );

    const singleMatches = candidates.map((item) => {
      const diff = myAssetValueBillion - item.priceTomanBillion;
      const absDiff = Math.abs(diff);
      const matchScore = Math.max(
        62,
        Math.min(99, Math.round(100 - (absDiff / Math.max(myAssetValueBillion, item.priceTomanBillion)) * 60))
      );
      return {
        type: 'single' as const,
        titleFa: isFa ? item.titleFa : item.titleEn,
        subtitleFa: isFa ? item.barterConditionFa : item.barterConditionEn,
        targetValueBillion: item.priceTomanBillion,
        cashDifferenceBillion: diff, // positive = user receives cash, negative = user pays cash
        withinTotalBudget: item.priceTomanBillion <= totalBudget,
        matchScore,
        items: [item],
      };
    });

    // Also compute 2-Car Combination Packages when user wants to swap an Apartment/Villa for 2 Cars + Cash
    const carItems = LUXURY_LISTINGS.filter((i) => i.assetKind === 'car');
    const comboMatches: typeof singleMatches = [];
    if (preferredTargetType !== 'property' && carItems.length >= 2) {
      for (let i = 0; i < carItems.length; i++) {
        for (let j = i + 1; j < carItems.length; j++) {
          const c1 = carItems[i];
          const c2 = carItems[j];
          const combinedVal = Number((c1.priceTomanBillion + c2.priceTomanBillion).toFixed(2));
          const diff = Number((myAssetValueBillion - combinedVal).toFixed(2));
          const absDiff = Math.abs(diff);
          if (absDiff <= myAssetValueBillion * 0.65) {
            const matchScore = Math.max(
              75,
              Math.min(99, Math.round(100 - (absDiff / Math.max(myAssetValueBillion, combinedVal)) * 55))
            );
            comboMatches.push({
              type: 'single',
              titleFa: isFa
                ? `پکیج ۲ دستگاه خودرو: ${c1.titleFa} + ${c2.titleFa}`
                : `2-Vehicle Barter Bundle: ${c1.titleEn} + ${c2.titleEn}`,
              subtitleFa: isFa
                ? 'پیشنهاد هوشمند موتور تهاتر: تبدیل ملک به ۲ خودروی نقدشونده بازار + تسویه نقدی'
                : 'Smart Barter Combo: Swap Property for 2 High-Liquidity Vehicles + Cash Settlement',
              targetValueBillion: combinedVal,
              cashDifferenceBillion: diff,
              withinTotalBudget: combinedVal <= totalBudget,
              matchScore,
              items: [c1, c2],
            });
          }
        }
      }
    }

    return [...comboMatches, ...singleMatches].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  }, [myAssetValueBillion, myExtraCashBillion, preferredTargetType, isFa]);

  // Leasing Calculations
  const leasingBreakdown = useMemo(() => {
    const downPayment = (leasingVehiclePrice * downPaymentPercent) / 100;
    const principalLoan = Math.max(0, leasingVehiclePrice - downPayment);
    const totalInterest = principalLoan * (monthlyInterestRate / 100) * leasingMonths;
    const totalRepayment = principalLoan + totalInterest;
    const monthlyCheck = leasingMonths > 0 ? totalRepayment / leasingMonths : 0;
    const totalFinalPrice = downPayment + totalRepayment;
    const pledgedDangs = Math.min(5, Math.max(1, Math.round(((100 - downPaymentPercent) / 100) * 6)));

    return {
      downPayment,
      principalLoan,
      totalInterest,
      totalRepayment,
      monthlyCheck,
      totalFinalPrice,
      pledgedDangs,
    };
  }, [leasingVehiclePrice, downPaymentPercent, leasingMonths, monthlyInterestRate]);

  // Legal Commission Calculations
  const commissionBreakdown = useMemo(() => {
    // Union rate: 0.25% per side for real estate, 1% per side for luxury auto gallery
    const ratePerSide = dealType === 'property-sale' ? 0.0025 : 0.01;
    const baseCommissionPerSide = dealTotalBillion * ratePerSide;
    const vatPerSide = baseCommissionPerSide * 0.1; // 10% VAT
    const notaryFee = dealType === 'property-sale' ? dealTotalBillion * 0.0015 : dealTotalBillion * 0.002;
    const totalPerSide = baseCommissionPerSide + vatPerSide;
    const combinedAgencyRevenue = totalPerSide * 2;

    return {
      ratePercent: ratePerSide * 100,
      baseCommissionPerSide,
      vatPerSide,
      notaryFee,
      totalPerSide,
      combinedAgencyRevenue,
    };
  }, [dealType, dealTotalBillion]);

  const handleCopyLeasingInvoice = () => {
    const text = isFa
      ? `📋 *برگه پیش‌فاکتور رسمی فروش اقساطی (لیزینگ چک صیادی) — AutoEstate VIP*\n` +
        `────────────────────\n` +
        `🚘 *مشخصات خودرو:* ${leasingVehicleTitle}\n` +
        `💰 *قیمت نقدی روز:* ${formatNumericValue(leasingVehiclePrice)}\n` +
        `💵 *پیش‌پرداخت نقدی (${downPaymentPercent}٪):* ${formatNumericValue(leasingBreakdown.downPayment)}\n` +
        `🏦 *مانده وام لیزینگ:* ${formatNumericValue(leasingBreakdown.principalLoan)}\n` +
        `📅 *تعداد اقساط:* ${leasingMonths} فقره چک صیادی ثبتی بنفش\n` +
        `🧾 *مبلغ هر چک ماهانه:* ${formatNumericValue(leasingBreakdown.monthlyCheck)}\n` +
        `🔐 *وضعیت سند:* ${6 - leasingBreakdown.pledgedDangs} دانگ قطعی به نام خریدار (${leasingBreakdown.pledgedDangs} دانگ در رهن تا پاس شدن آخرین چک)\n` +
        `────────────────────\n` +
        `🌐 اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM`
      : `📋 *AutoEstate VIP Official Leasing Pro-Forma Invoice*\n` +
        `Vehicle: ${leasingVehicleTitle}\n` +
        `Cash Price: ${formatNumericValue(leasingVehiclePrice)}\n` +
        `Down Payment (${downPaymentPercent}%): ${formatNumericValue(leasingBreakdown.downPayment)}\n` +
        `Tenure: ${leasingMonths} Monthly Post-Dated Cheques\n` +
        `Monthly Installment: ${formatNumericValue(leasingBreakdown.monthlyCheck)}`;

    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 3000);
  };

  // AI Assistant Submit Handler
  const handleSendAiQuestion = async (customPrompt?: string) => {
    const question = (customPrompt ?? aiPrompt).trim();
    if (!question || aiLoading) return;

    setAiMessages((prev) => [...prev, { role: 'user', text: question }]);
    if (!customPrompt) setAiPrompt('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: question,
          market,
          lang,
          contextData: {
            activeBarterAsset: myAssetTitle,
            activeBarterValueBillion: myAssetValueBillion,
            leasingVehicleTitle,
            leasingVehiclePrice,
          },
        }),
      });
      const data = await response.json();
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.reply ||
            (isFa
              ? 'پاسخ کارشناس آماده است. لطفاً از ماشین‌حساب تهاتر یا اقساط جهت بررسی دقیق اعداد استفاده فرمایید.'
              : 'Expert advisory ready. Use the Barter Match Engine above for exact numbers.'),
        },
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: isFa
            ? 'پاسخگوی خودکار آفلاین فعال است: در معاملات تهاتر ملک با خودرو، پیشنهاد می‌شود ۶۰٪ ارزش ملک را با ۲ دستگاه خودروی لوکس یا صفر کیلومتر و ۴۰٪ الباقی را با چک صیادی ثبتی تسویه نمایید.'
            : 'Offline Expert Advisor: For property-to-car barter deals, we recommend settling 60% via 2 high-liquidity vehicles and 40% via registered escrow checks.',
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // GitHub Direct Push Handler
  const handleDirectPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setGhStatus({ loading: true });
    try {
      const res = await fetch('/api/github/direct-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: ghToken,
          owner: ghOwner,
          repo: ghRepo,
          branch: ghBranch,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setGhStatus({ loading: false, error: data.error || 'خطا در پوش مستقیم گیت‌هاب' });
      } else {
        setGhStatus({
          loading: false,
          successUrl: data.repoUrl,
          filesCount: data.filesCount,
        });
      }
    } catch {
      setGhStatus({ loading: false, error: 'خطا در برقراری ارتباط با سرور' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F5F5F0] flex flex-col">
      {/* 0. Slim Top Ecosystem Banner + 1-Click Market & Language Switches */}
      <div className="bg-[#12141D] border-b border-[#D4AF37]/25 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#D4AF37] font-medium truncate">
            <span>
              {isFa
                ? 'اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM'
                : 'Creation Ecosystem | NewMetaverCity World | Tavan Stage FBNM'}
            </span>
            {!isOnline && (
              <span className="text-amber-400 font-semibold">
                · {isFa ? 'حالت آفلاین PWA فعال' : 'Offline PWA Mode'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 1-Click Market Switch: Iran vs International (Dubai & Turkey) */}
            <div className="inline-flex items-center bg-[#0B0C10] p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setMarket('iran')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  market === 'iran'
                    ? 'bg-[#D4AF37] text-[#0B0C10]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isFa
                  ? 'بازار ایران (تومان / چک صیادی / تهاتر)'
                  : 'Iran Market (Toman / Sayadi)'}
              </button>
              <button
                onClick={() => setMarket('intl')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  market === 'intl'
                    ? 'bg-[#D4AF37] text-[#0B0C10]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isFa
                  ? 'بازار بین‌المللی دبی و ترکیه (AED / USD / EUR)'
                  : 'Dubai & Turkey Intl (AED / USD / EUR)'}
              </button>
            </div>

            {/* Currency Switcher when in International Mode */}
            {market === 'intl' && (
              <div className="inline-flex items-center bg-[#0B0C10] p-0.5 rounded-lg border border-[#D4AF37]/40">
                {(['AED', 'USD', 'EUR'] as IntlCurrency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setIntlCurrency(cur)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                      intlCurrency === cur
                        ? 'bg-white/15 text-[#D4AF37]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            )}

            {/* 1-Click Bilingual Switch (FA RTL / EN LTR) */}
            <button
              onClick={() => setLang(isFa ? 'en' : 'fa')}
              className="px-2.5 py-1 rounded-lg bg-[#0B0C10] border border-white/15 text-[11px] font-semibold text-zinc-200 hover:border-[#D4AF37] transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isFa ? 'English (LTR)' : 'فارسی (RTL)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#D4AF37] font-display-luxury whitespace-nowrap shrink-0"
          >
            AutoEstate VIP
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <button
              onClick={() => scrollToSection('showcase-section')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              {isFa ? 'ویترین خودرو و ملک' : 'Luxury Showcase'}
            </button>
            <button
              onClick={() => scrollToSection('barter-engine-section')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              {isFa ? 'موتور تطبیق تهاتر' : 'Barter Match Engine'}
            </button>
            <button
              onClick={() => scrollToSection('calculator-section')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              {isFa ? 'ماشین‌حساب اقساط و کمیسیون' : 'Leasing & Commission'}
            </button>
            <button
              onClick={() => scrollToSection('ai-advisor-section')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              {isFa ? 'کارشناس هوش مصنوعی' : 'AI Advisor'}
            </button>
            <button
              onClick={() => scrollToSection('vip-club-section')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              {isFa ? 'اشتراک VIP و ویزیتورها' : 'VIP & White-Label'}
            </button>
          </nav>

          {/* Zone 3: 2 primary actions (1-Click PWA Install + APK/GitHub Direct Push) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {!isInstalled && (
              <button
                onClick={async () => {
                  if (isInstallable) {
                    await install();
                  } else {
                    setShowPwaModal(true);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#0B0C10] text-xs font-bold hover:bg-[#e3c14d] transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{isFa ? 'نصب ۱-کلیکی اپ (PWA)' : '1-Click Install App'}</span>
              </button>
            )}
            <button
              onClick={() => setShowDeployModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#181B26] border border-[#D4AF37]/40 text-[#F5F5F0] text-xs font-semibold hover:border-[#D4AF37] transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <GitBranch className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{isFa ? 'خروجی اندروید و گیت‌هاب' : 'Android APK & GitHub'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-16">
        {/* SECTION 1: Storefront Hero Campaign */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#141722] via-[#10121B] to-[#1D1911] border border-[#D4AF37]/30 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-semibold text-[#D4AF37] tracking-wide">
                {market === 'iran'
                  ? isFa
                    ? 'ویژه بازار ایران · معاملات تومان، چک صیادی ثبتی و تهاتر همزمان ملک و خودرو'
                    : 'Iran Luxury Market · Toman, Registered Sayadi Checks & Instant Auto-Property Barter'
                  : isFa
                  ? 'بازار بین‌المللی دبی، استانبول و قبرس · خرید ملک و خودرو با اقامت طلایی (AED / USD / EUR)'
                  : 'International Dubai & Turkey Market · Luxury Real Estate & Supercars (AED / USD / EUR)'}
              </div>

              <h1
                className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-white leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {isFa
                  ? 'اتواستیت وی‌آی‌پی؛ سامانه هوشمند نمایشگاه خودرو، املاک لوکس و تطبیق خودکار تهاتر'
                  : 'AutoEstate VIP: Intelligent Luxury Auto Showroom, Real Estate & Barter Match Engine'}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
                {isFa
                  ? 'ارزش خودرو یا آپارتمان خود را وارد کنید تا هوش مصنوعی سامانه، بهترین گزینه‌های معاوضه (ملک با خودرو یا بالعکس) و مابه‌التفاوت دقیق نقدی یا اقساط چک صیادی را در کسری از ثانیه محاسبه کند.'
                  : 'Input your vehicle or real estate valuation to automatically match verified barter listings, compute exact cash differences, and generate 1080×1920 showroom story posters in one click.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('barter-engine-section')}
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-sm hover:bg-[#e3c14d] transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>
                    {isFa ? 'ورود به موتور هوشمند تطبیق تهاتر' : 'Launch Smart Barter Match Engine'}
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection('calculator-section')}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Calculator className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {isFa
                      ? 'ماشین‌حساب اقساط چک صیادی و کمیسیون'
                      : 'Leasing & Commission Calculator'}
                  </span>
                </button>
              </div>

              {/* Unboxed quantitative trust metrics */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400 tabular-nums">
                <span>
                  <strong className="text-white">۱۰+</strong>{' '}
                  {isFa ? 'آگهی کارشناسی‌شده آماده تحویل و محضر' : 'Verified Showroom & Deed Listings'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-[#D4AF37]">۶ تا ۲۴ ماه</strong>{' '}
                  {isFa ? 'لیزینگ با چک صیادی بنفش' : 'Registered Check Leasing'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-emerald-400">1080×1920 HD</strong>{' '}
                  {isFa ? 'استوری‌ساز ۱-کلیکی اتوگالری' : '1-Click Canvas Story Studio'}
                </span>
              </div>
            </div>

            {/* Hero Right Visual Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden bg-[#0B0C10] border border-[#D4AF37]/40 shadow-2xl">
                <div className="relative aspect-[16/10] bg-[#161924]">
                  <img
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
                    alt="Mercedes-Benz S500 L AMG Line & Penthouse Barter"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/30 to-transparent" />
                  <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-xs text-[#D4AF37] font-semibold">
                        {isFa ? 'پیشنهاد ویژه تهاتر روز' : 'Featured Barter Deal of the Day'}
                      </div>
                      <div className="text-base font-bold text-white">
                        {isFa
                          ? 'مرسدس بنز S500 L مدل ۲۰۲۴ ⇄ پنت‌هاوس الهیه'
                          : '2024 Mercedes S500 L ⇄ Elahiyeh Penthouse'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-3 bg-[#12141C]">
                  <div className="text-xs text-zinc-300">
                    {isFa
                      ? 'برگه کارشناسی ۱۰۰٪ بدون رنگ + سند تک‌برگ آماده انتقال'
                      : '100% Paint-Free Certified + Freehold Title Deed'}
                  </div>
                  <button
                    onClick={() => setSelectedStoryListing(LUXURY_LISTINGS[0])}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold hover:bg-[#D4AF37] hover:text-[#0B0C10] transition-colors whitespace-nowrap"
                  >
                    {isFa ? 'تست استوری‌ساز HD' : 'Try Story Maker'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Showcase of 10 Real Luxury Listings */}
        <section id="showcase-section" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isFa
                  ? '۰۱. ویترین اختصاصی خودروهای لوکس، املاک سنددار و پیشنهادهای تهاتر'
                  : '01. Verified Luxury Auto, Real Estate & Barter Inventory'}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                {isFa
                  ? 'همراه با کارت کارشناسی دیجیتال رنگ و شاسی خودرو، استعلام سند تک‌برگ ملک و خروجی ۱-کلیکی استوری اینستاگرام'
                  : 'Complete with ultrasonic paint thickness inspection cards, freehold deed verification, and 1-click HD Story export'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute top-3 right-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFa
                    ? 'جستجوی بنز، پورشه، پنت‌هاوس، ویلا کردان...'
                    : 'Search Mercedes, Porsche, Penthouse...'
                }
                className="w-full pr-10 pl-3.5 py-2 rounded-xl bg-[#141722] border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#12141D] rounded-xl border border-white/10 overflow-x-auto">
            {[
              { id: 'all', labelFa: 'همه آگهی‌ها (۱۰)', labelEn: 'All Listings (10)' },
              { id: 'imported-cars', labelFa: 'خودروهای وارداتی و لوکس', labelEn: 'Imported & Luxury Cars' },
              { id: 'domestic-cars', labelFa: 'خودروهای صفر و کارکرده داخلی', labelEn: 'Domestic New & Used' },
              { id: 'apartments-penthouses', labelFa: 'آپارتمان و پنت‌هاوس', labelEn: 'Apartments & Penthouses' },
              { id: 'villas-land', labelFa: 'ویلا و زمین شمال / کردان', labelEn: 'Villas & Land (North/Kordan)' },
              { id: 'presale-projects', labelFa: 'پروژه‌های پیش‌فروش ساختمانی', labelEn: 'Off-Plan Construction' },
              { id: 'instant-barter', labelFa: 'پیشنهادهای ویژه تهاتر فوری', labelEn: 'Instant Barter Specials' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as 'all' | ListingCategory)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-[#D4AF37] text-[#0B0C10] shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isFa ? tab.labelFa : tab.labelEn}
              </button>
            ))}
          </div>

          {/* 3-Column Luxury Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const specs = isFa ? item.specsFa : item.specsEn;
              const isImgBroken = brokenImages[item.id];

              return (
                <article
                  key={item.id}
                  className="group rounded-2xl bg-[#131620] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Image Container (4:3 aspect ratio with zero-broken-image fallback) */}
                  <div className="relative aspect-[4/3] bg-[#181B26] overflow-hidden">
                    {!isImgBroken ? (
                      <img
                        src={item.image}
                        alt={isFa ? item.titleFa : item.titleEn}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#181B26] to-[#241E12]">
                        <Car className="w-10 h-10 text-[#D4AF37] mb-2" />
                        <span className="text-sm font-bold text-white">
                          {isFa ? item.titleFa : item.titleEn}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131620] via-transparent to-black/30" />

                    {/* Top 1-line subtle status label */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between text-[11px] font-semibold">
                      <span className="px-2.5 py-1 rounded-md bg-black/75 text-[#D4AF37] backdrop-blur-sm">
                        {item.assetKind === 'car'
                          ? isFa
                            ? 'کارشناسی بدنه: بدون رنگ و شاسی پلمپ'
                            : 'Certified: 100% Paint-Free'
                          : isFa
                          ? 'سند تک‌برگ آماده محضر'
                          : 'Freehold Single Deed'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Unboxed Metadata Line */}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                        <span>{isFa ? item.locationFa : item.locationEn}</span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">
                        {isFa ? item.titleFa : item.titleEn}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {isFa ? item.subtitleFa : item.subtitleEn}
                      </p>

                      {/* Unboxed inspection / deed specs separated by middle dot */}
                      <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-emerald-400 font-medium">
                        {specs.map((s, idx) => (
                          <React.Fragment key={idx}>
                            <span>{s}</span>
                            {idx < specs.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-600">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/10">
                      {/* Price & Barter Condition */}
                      <div>
                        <div className="text-xs text-zinc-400">
                          {market === 'iran'
                            ? isFa
                              ? 'قیمت نقدی / پایه تهاتر:'
                              : 'Iran Market Price:'
                            : isFa
                            ? `قیمت بین‌المللی (${intlCurrency}):`
                            : `International Price (${intlCurrency}):`}
                        </div>
                        <div className="text-lg font-extrabold text-[#D4AF37] tabular-nums mt-0.5">
                          {formatPrice(item)}
                        </div>
                        <div className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                          {isFa ? item.barterConditionFa : item.barterConditionEn}
                        </div>
                      </div>

                      {/* 3 Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedInspectionListing(item)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {item.assetKind === 'car'
                              ? isFa
                                ? 'برگه کارشناسی رنگ'
                                : 'Inspection Card'
                              : isFa
                              ? 'سند و پایان‌کار'
                              : 'Deed & Permit'}
                          </span>
                        </button>

                        <button
                          onClick={() => setSelectedStoryListing(item)}
                          className="px-3 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0B0C10] border border-[#D4AF37]/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>{isFa ? 'استوری‌ساز HD' : 'HD Story Maker'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (item.assetKind === 'car') {
                            setLeasingVehiclePrice(item.priceTomanBillion);
                            setLeasingVehicleTitle(isFa ? item.titleFa : item.titleEn);
                            setCalcTab('leasing');
                            scrollToSection('calculator-section');
                          } else {
                            setMyAssetType('property');
                            setMyAssetTitle(isFa ? item.titleFa : item.titleEn);
                            setMyAssetValueBillion(item.priceTomanBillion);
                            setPreferredTargetType('car');
                            scrollToSection('barter-engine-section');
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-[#1C202E] hover:bg-[#252A3C] text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          {item.assetKind === 'car'
                            ? isFa
                              ? 'محاسبه اقساط چک صیادی این خودرو'
                              : 'Calculate Leasing Installments'
                            : isFa
                            ? 'تطبیق خودکار تهاتر این ملک با خودرو'
                            : 'Match Barter Vehicles for This Property'}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Smart Barter Match Engine (موتور هوشمند تطبیق خودکار تهاتر) */}
        <section
          id="barter-engine-section"
          className="rounded-3xl bg-[#121520] border border-[#D4AF37]/40 p-6 sm:p-8 lg:p-10 space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isFa
                  ? '۰۲. موتور هوشمند تطبیق خودکار تهاتر (معاوضه ملک با خودرو یا زمین)'
                  : '02. Smart Barter Match Engine (Property ⇄ Vehicle Swap)'}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                {isFa
                  ? 'ارزش ملک یا خودروی خود را وارد کنید؛ سیستم به صورت خودکار آگهی‌های تکی یا پکیج‌های ۲ خودرویی قابل معاوضه و مابه‌التفاوت دقیق نقدی را محاسبه می‌کند.'
                  : 'Enter your property or car valuation to automatically discover single or multi-vehicle barter matches and exact cash settlement differences.'}
              </p>
            </div>

            {/* 1-Click Preset Barter Scenarios */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setMyAssetType('property');
                  setMyAssetTitle('آپارتمان ۱۲۰ متری سعادت‌آباد');
                  setMyAssetValueBillion(21.6);
                  setMyExtraCashBillion(2.0);
                  setPreferredTargetType('car');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1A1E2E] border border-[#D4AF37]/30 text-xs text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0C10] font-semibold transition-colors whitespace-nowrap"
              >
                {isFa
                  ? 'سناریو ۱: آپارتمان ۱۲۰ متری ⇄ ۲ خودروی وارداتی + نقد'
                  : 'Preset 1: 120sqm Flat ⇄ 2 Cars + Cash'}
              </button>
              <button
                onClick={() => {
                  setMyAssetType('car');
                  setMyAssetTitle('مرسدس بنز S500 L + پورشه ماکان');
                  setMyAssetValueBillion(48.3);
                  setMyExtraCashBillion(5.0);
                  setPreferredTargetType('property');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1A1E2E] border border-white/15 text-xs text-zinc-300 hover:border-[#D4AF37] font-semibold transition-colors whitespace-nowrap"
              >
                {isFa
                  ? 'سناریو ۲: ۲ خودروی لوکس ⇄ ویلا کردان / آپارتمان'
                  : 'Preset 2: 2 Luxury Cars ⇄ Kordan Villa'}
              </button>
            </div>
          </div>

          {/* Input Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B0C10] p-5 rounded-2xl border border-white/10">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                {isFa ? 'نوع دارایی فعلی شما:' : 'Your Current Asset Type:'}
              </label>
              <select
                value={myAssetType}
                onChange={(e) => setMyAssetType(e.target.value as 'property' | 'car')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="property">
                  {isFa ? 'ملک (آپارتمان / ویلا / زمین)' : 'Real Estate (Apartment / Villa / Land)'}
                </option>
                <option value="car">
                  {isFa ? 'خودرو (وارداتی / لوکس / صفر داخلی)' : 'Vehicle (Luxury / Imported / SUV)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                {isFa ? 'عنوان یا مشخصات دارایی شما:' : 'Your Asset Title / Model:'}
              </label>
              <input
                type="text"
                value={myAssetTitle}
                onChange={(e) => setMyAssetTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                {isFa
                  ? 'ارزش کارشناسی دارایی شما (میلیارد تومان):'
                  : 'Your Asset Value (Billion Toman Eq.):'}
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={myAssetValueBillion}
                onChange={(e) => setMyAssetValueBillion(Math.max(0.5, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-[#D4AF37]/50 text-sm font-bold text-[#D4AF37] tabular-nums focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                {isFa ? 'هدف معاوضه (دارایی درخواستی):' : 'Desired Barter Target:'}
              </label>
              <select
                value={preferredTargetType}
                onChange={(e) =>
                  setPreferredTargetType(e.target.value as 'all' | 'car' | 'property')
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="car">
                  {isFa ? 'معاوضه با خودرو (تکی یا پکیج ۲ دستگاه)' : 'Swap for Vehicles (Single or 2-Car Bundle)'}
                </option>
                <option value="property">
                  {isFa ? 'معاوضه با آپارتمان، پنت‌هاوس یا ویلا' : 'Swap for Apartment, Penthouse or Villa'}
                </option>
                <option value="all">{isFa ? 'همه موارد (ملک و خودرو)' : 'All Eligible Assets'}</option>
              </select>
            </div>
          </div>

          {/* Matching Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>
                {isFa
                  ? `نتایج تطبیق خودکار برای «${myAssetTitle}» به ارزش ${formatNumericValue(myAssetValueBillion)}:`
                  : `Automated Barter Matches for "${myAssetTitle}" (${formatNumericValue(myAssetValueBillion)}):`}
              </span>
              <span className="text-[#D4AF37] font-semibold">
                {isFa ? 'مرتب‌شده بر اساس بالاترین درصد هم‌ارزشی' : 'Ranked by Valuation Fit'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barterMatches.map((match, idx) => {
                const isReceiveCash = match.cashDifferenceBillion >= 0;
                const absCash = Math.abs(match.cashDifferenceBillion);

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#161926] border border-white/10 hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-emerald-400 font-bold tabular-nums">
                          {isFa
                            ? `${match.matchScore}٪ تطبیق هوشمند تهاتر`
                            : `${match.matchScore}% Barter Fit`}
                        </span>
                        <span className="text-zinc-400 tabular-nums">
                          {isFa ? 'ارزش مورد معاوضه:' : 'Target Value:'}{' '}
                          <strong className="text-white">
                            {formatNumericValue(match.targetValueBillion)}
                          </strong>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{match.titleFa}</h4>
                      <p className="text-xs text-zinc-400">{match.subtitleFa}</p>
                    </div>

                    {/* Exact Cash Difference Settlement Box */}
                    <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-zinc-300">
                        {absCash < 0.05
                          ? isFa
                            ? 'تطبیق ۱۰۰٪ سر به سر (بدون مابه‌التفاوت نقدی)'
                            : '100% Even Swap (Zero Cash Difference)'
                          : isReceiveCash
                          ? isFa
                            ? 'مابه‌التفاوت نقدی که شما دریافت می‌کنید (سرانه نقدی):'
                            : 'Cash Balance You Receive:'
                          : isFa
                          ? 'مابه‌التفاوت نقدی/چک صیادی که شما پرداخت می‌کنید:'
                          : 'Cash / Check Balance You Pay:'}
                      </div>
                      <div
                        className={`text-sm font-extrabold tabular-nums ${
                          absCash < 0.05
                            ? 'text-[#D4AF37]'
                            : isReceiveCash
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {absCash < 0.05
                          ? isFa
                            ? '۰ تومان (معاوضه پایاپای)'
                            : 'Even Trade'
                          : `${isReceiveCash ? '+' : '-'} ${formatNumericValue(absCash)}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: Dual Calculator (Leasing Installments + Legal Commission) */}
        <section
          id="calculator-section"
          className="rounded-3xl bg-[#131620] border border-white/10 p-6 sm:p-8 lg:p-10 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isFa
                  ? '۰۳. ماشین‌حساب دوگانه اقساط لیزینگ خودرو و کمیسیون قانونی املاک'
                  : '03. Dual Auto Leasing & Legal Real Estate Commission Calculator'}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                {isFa
                  ? 'محاسبه دقیق اقساط ۶ تا ۲۴ ماهه با چک صیادی ثبتی + صدور برگه پیش‌فاکتور واتساپ و محاسبه حق‌العمل قانونی اتحادیه'
                  : 'Calculate 6–24 month registered check installments with 1-click WhatsApp invoice export & union commission fees'}
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-[#0B0C10] border border-white/10 shrink-0">
              <button
                onClick={() => setCalcTab('leasing')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  calcTab === 'leasing'
                    ? 'bg-[#D4AF37] text-[#0B0C10]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isFa ? 'اقساط لیزینگ خودرو (چک صیادی)' : 'Auto Leasing (Sayadi Checks)'}
              </button>
              <button
                onClick={() => setCalcTab('commission')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  calcTab === 'commission'
                    ? 'bg-[#D4AF37] text-[#0B0C10]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isFa ? 'کمیسیون قانونی املاک و قولنامه' : 'Legal Commission & Notary'}
              </button>
            </div>
          </div>

          {calcTab === 'leasing' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-5 bg-[#0B0C10] p-6 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    {isFa ? 'انتخاب خودرو از ویترین یا ورود دستی:' : 'Select Showroom Vehicle:'}
                  </label>
                  <select
                    value={leasingVehicleTitle}
                    onChange={(e) => {
                      const found = LUXURY_LISTINGS.find(
                        (l) => l.titleFa === e.target.value || l.titleEn === e.target.value
                      );
                      setLeasingVehicleTitle(e.target.value);
                      if (found) setLeasingVehiclePrice(found.priceTomanBillion);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {LUXURY_LISTINGS.filter((i) => i.assetKind === 'car').map((car) => (
                      <option key={car.id} value={isFa ? car.titleFa : car.titleEn}>
                        {isFa ? car.titleFa : car.titleEn} ({formatPrice(car)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {isFa ? 'قیمت نقدی خودرو (میلیارد تومان):' : 'Vehicle Cash Price (Billion Toman):'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={leasingVehiclePrice}
                      onChange={(e) =>
                        setLeasingVehiclePrice(Math.max(0.5, Number(e.target.value) || 0))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-[#D4AF37]/50 text-sm font-bold text-[#D4AF37] tabular-nums focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {isFa
                        ? `درصد پیش‌پرداخت نقدی (${downPaymentPercent}٪):`
                        : `Down Payment (${downPaymentPercent}%):`}
                    </label>
                    <input
                      type="range"
                      min="35"
                      max="80"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#D4AF37] mt-2"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500 tabular-nums">
                      <span>35%</span>
                      <span>50%</span>
                      <span>80%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {isFa ? 'مدت بازپرداخت (تعداد چک صیادی):' : 'Installment Tenure (Months):'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[6, 12, 18, 24].map((m) => (
                        <button
                          key={m}
                          onClick={() => setLeasingMonths(m)}
                          className={`py-2 rounded-xl text-xs font-bold tabular-nums transition-colors ${
                            leasingMonths === m
                              ? 'bg-[#D4AF37] text-[#0B0C10]'
                              : 'bg-[#141722] text-zinc-300 border border-white/10 hover:border-[#D4AF37]'
                          }`}
                        >
                          {m} {isFa ? 'ماه' : 'Mo'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {isFa ? 'کارمزد ماهانه لیزینگ / نمایشگاه (٪):' : 'Monthly Financing Rate (%):'}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="1"
                      max="8"
                      value={monthlyInterestRate}
                      onChange={(e) =>
                        setMonthlyInterestRate(Math.max(0.5, Number(e.target.value) || 0))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/15 text-sm font-bold text-white tabular-nums focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pro-Forma Output & WhatsApp Export */}
              <div className="lg:col-span-6 bg-gradient-to-br from-[#171A26] to-[#1E1A12] p-6 rounded-2xl border border-[#D4AF37]/40 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isFa
                        ? 'برگه پیش‌فاکتور رسمی لیزینگ با چک صیادی ثبتی'
                        : 'Official Leasing Pro-Forma Breakdown'}
                    </h3>
                    <p className="text-xs text-[#D4AF37]">{leasingVehicleTitle}</p>
                  </div>
                  <FileCheck2 className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <div className="grid grid-cols-2 gap-3 tabular-nums">
                  <div className="p-3.5 rounded-xl bg-[#0B0C10]/80 border border-white/10">
                    <div className="text-xs text-zinc-400">
                      {isFa
                        ? `پیش‌پرداخت نقدی (${downPaymentPercent}٪)`
                        : `Cash Down Payment (${downPaymentPercent}%)`}
                    </div>
                    <div className="text-base font-extrabold text-white mt-1">
                      {formatNumericValue(leasingBreakdown.downPayment)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B0C10]/80 border border-[#D4AF37]/40">
                    <div className="text-xs text-zinc-400">
                      {isFa
                        ? `مبلغ هر چک صیادی (${leasingMonths} ماهه)`
                        : `Monthly Check (${leasingMonths}x)`}
                    </div>
                    <div className="text-base font-extrabold text-[#D4AF37] mt-1">
                      {formatNumericValue(leasingBreakdown.monthlyCheck)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B0C10]/80 border border-white/10">
                    <div className="text-xs text-zinc-400">
                      {isFa ? 'اصل تسهیلات باقی‌مانده' : 'Financed Principal'}
                    </div>
                    <div className="text-sm font-bold text-zinc-200 mt-1">
                      {formatNumericValue(leasingBreakdown.principalLoan)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B0C10]/80 border border-white/10">
                    <div className="text-xs text-zinc-400">
                      {isFa ? 'تمامی قیمت تمام‌شده (نقد + اقساط)' : 'Total Contract Value'}
                    </div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {formatNumericValue(leasingBreakdown.totalFinalPrice)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-300 bg-[#0B0C10]/60 p-3.5 rounded-xl border border-white/5">
                  {isFa
                    ? `وضعیت سند و پلاک: پلاک خودرو از روز اول به نام خریدار تعویض شده و ${
                        6 - leasingBreakdown.pledgedDangs
                      } دانگ قطعی می‌گردد (${leasingBreakdown.pledgedDangs} دانگ در رهن نمایشگاه تا تسویه آخرین چک صیادی).`
                    : `Title Status: License plate registered to buyer on Day 1; ${leasingBreakdown.pledgedDangs}/6 title share pledged until final check clearance.`}
                </div>

                <button
                  onClick={handleCopyLeasingInvoice}
                  className="w-full py-3 px-5 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-xs sm:text-sm hover:bg-[#e3c14d] transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>
                    {copiedInvoice
                      ? isFa
                        ? 'پیش‌فاکتور رسمی کپی شد! آماده ارسال در واتساپ'
                        : 'Pro-Forma Invoice Copied for WhatsApp!'
                      : isFa
                      ? 'کپی و صدور برگه پیش‌فاکتور لیزینگ برای واتساپ نمایشگاه'
                      : 'Copy Official Leasing Pro-Forma for WhatsApp'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Legal Commission Inputs */}
              <div className="lg:col-span-6 space-y-4 bg-[#0B0C10] p-6 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    {isFa ? 'نوع قرارداد و مبایعه‌نامه:' : 'Contract Type:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDealType('property-sale')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                        dealType === 'property-sale'
                          ? 'bg-[#D4AF37] text-[#0B0C10]'
                          : 'bg-[#141722] text-zinc-300 border border-white/10'
                      }`}
                    >
                      {isFa ? 'مبایعه‌نامه املاک (تعرفه ۰.۲۵٪)' : 'Real Estate Deed (0.25%)'}
                    </button>
                    <button
                      onClick={() => setDealType('auto-sale')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                        dealType === 'auto-sale'
                          ? 'bg-[#D4AF37] text-[#0B0C10]'
                          : 'bg-[#141722] text-zinc-300 border border-white/10'
                      }`}
                    >
                      {isFa ? 'قولنامه اتوگالری (تعرفه ۱٪)' : 'Auto Showroom Contract (1%)'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    {isFa ? 'مبلغ کل معامله (میلیارد تومان):' : 'Total Transaction Value (Billion Toman):'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={dealTotalBillion}
                    onChange={(e) =>
                      setDealTotalBillion(Math.max(0.5, Number(e.target.value) || 0))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-[#D4AF37]/50 text-sm font-bold text-[#D4AF37] tabular-nums focus:outline-none"
                  />
                </div>
              </div>

              {/* Legal Commission Output */}
              <div className="lg:col-span-6 bg-[#0B0C10] p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4 tabular-nums">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                  {isFa
                    ? 'ریز محاسبات قانونی کمیسیون، مالیات بر ارزش افزوده و حق ثبت'
                    : 'Official Commission, 10% VAT & Notary Fee Breakdown'}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141722] border border-white/10">
                    <div className="text-xs text-zinc-400">
                      {isFa
                        ? `کمیسیون پایه هر طرف (${commissionBreakdown.ratePercent}٪)`
                        : `Base Commission / Side (${commissionBreakdown.ratePercent}%)`}
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {(commissionBreakdown.baseCommissionPerSide * 1000).toFixed(1)}{' '}
                      {isFa ? 'میلیون تومان' : 'M Toman'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141722] border border-white/10">
                    <div className="text-xs text-zinc-400">
                      {isFa ? 'مالیات ارزش افزوده (۱۰٪ قانونی)' : '10% Value Added Tax (VAT)'}
                    </div>
                    <div className="text-sm font-bold text-amber-400 mt-1">
                      {(commissionBreakdown.vatPerSide * 1000).toFixed(1)}{' '}
                      {isFa ? 'میلیون تومان' : 'M Toman'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141722] border border-[#D4AF37]/40">
                    <div className="text-xs text-zinc-400">
                      {isFa ? 'سهم پرداختی نهایی خریدار (با مالیات)' : 'Total Payable by Buyer'}
                    </div>
                    <div className="text-base font-extrabold text-[#D4AF37] mt-1">
                      {(commissionBreakdown.totalPerSide * 1000).toFixed(1)}{' '}
                      {isFa ? 'میلیون تومان' : 'M Toman'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141722] border border-emerald-500/30">
                    <div className="text-xs text-zinc-400">
                      {isFa ? 'مجموع دریافتی بنگاه از دو طرف' : 'Total Agency Commission (Both Sides)'}
                    </div>
                    <div className="text-base font-extrabold text-emerald-400 mt-1">
                      {(commissionBreakdown.combinedAgencyRevenue * 1000).toFixed(1)}{' '}
                      {isFa ? 'میلیون تومان' : 'M Toman'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 5: AI Auto & Real Estate Expert Assistant */}
        <section
          id="ai-advisor-section"
          className="rounded-3xl bg-gradient-to-br from-[#131622] to-[#1A1710] border border-[#D4AF37]/40 p-6 sm:p-8 lg:p-10 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {isFa
                    ? '۰۴. دستیار هوش مصنوعی کارشناس خودرو، املاک و حقوقی تهاتر'
                    : '04. AI Automotive, Real Estate & Barter Legal Advisor'}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isFa
                    ? 'متصل به Gemini API سرور (`/api/ai-assistant`) + موتور پاسخگوی خودکار آفلاین'
                    : 'Powered by Server-Side Gemini API (/api/ai-assistant) + Offline Expert Engine'}
                </p>
              </div>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                isFa ? 'فرمول تهاتر آپارتمان با ۲ خودرو چیست؟' : 'How to barter an apartment for 2 cars?',
                isFa ? 'شرایط اقساط با چک صیادی بنفش' : 'Sayadi check leasing rules',
                isFa ? 'خرید ملک در دبی با ویزای طلایی ۱۰ ساله' : 'Dubai Golden Visa property rules',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendAiQuestion(q)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B0C10] text-xs text-zinc-300 border border-white/10 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Window */}
          <div className="bg-[#0B0C10] rounded-2xl border border-white/10 p-4 sm:p-5 space-y-4 max-h-80 overflow-y-auto">
            {aiMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#D4AF37] text-[#0B0C10] font-semibold'
                      : 'bg-[#161924] text-zinc-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="text-xs text-[#D4AF37] animate-pulse">
                {isFa
                  ? 'کارشناس هوشمند در حال تحلیل بازار و قوانین معاملاتی...'
                  : 'AI Senior Advisor is analyzing market metrics...'}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAiQuestion();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={
                isFa
                  ? 'سوال خود را درباره قیمت‌گذاری خودرو، قولنامه تهاتر، چک صیادی یا ملک دبی بنویسید...'
                  : 'Ask about car inspection, property barter contracts, leasing or Dubai Golden Visa...'
              }
              className="flex-1 px-4 py-3 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-sm hover:bg-[#e3c14d] transition-colors flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isFa ? 'ارسال سوال' : 'Ask Expert'}</span>
            </button>
          </form>
        </section>

        {/* SECTION 6: VIP Subscription (Tiers 1 to 5) & White-Label Marketers Club */}
        <section id="vip-club-section" className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFa
                ? '۰۵. سطوح اشتراک VIP نمایشگاه‌داران (۱ تا ۵) و باشگاه ویزیتورهای پورسانتی'
                : '05. Showroom VIP Subscriptions (Tiers 1–5) & White-Label Marketers Club'}
            </h2>
            <p className="text-sm text-zinc-400">
              {isFa
                ? 'امکان دریافت نسخه اختصاصی White-Label با نام و دامنه اتوگالری یا آژانس املاک شما + کسب درآمد میلیونی ویژه ویزیتورها'
                : 'Deploy your own White-Label Auto & Real Estate platform or earn up to 45% recurring commission in our Visitors Club'}
            </p>
          </div>

          {/* 5 VIP Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {VIP_TIERS.map((tier) => (
              <div
                key={tier.level}
                className={`rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-[#1F1C14] to-[#13151F] border-[#D4AF37] shadow-xl'
                    : 'bg-[#131620] border-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#D4AF37]">
                    {tier.commissionBonus}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {isFa ? tier.nameFa : tier.nameEn}
                  </h3>
                  <div className="text-base font-extrabold text-[#F5F5F0] tabular-nums">
                    {isFa ? tier.priceFa : tier.priceEn}
                  </div>
                  <ul className="space-y-2 pt-2 border-t border-white/10 text-xs text-zinc-300">
                    {(isFa ? tier.featuresFa : tier.featuresEn).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedVipTier(tier.level)}
                  className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    tier.highlighted
                      ? 'bg-[#D4AF37] text-[#0B0C10] hover:bg-[#e3c14d]'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {selectedVipTier === tier.level
                    ? isFa
                      ? '✓ سطح انتخاب‌شده شما'
                      : '✓ Selected Tier'
                    : isFa
                    ? `فعال‌سازی سطح ${tier.level}`
                    : `Select Tier ${tier.level}`}
                </button>
              </div>
            ))}
          </div>

          {/* Commission Marketers Club (باشگاه ویزیتورهای پورسانتی فروش White-Label) */}
          <div className="rounded-3xl bg-[#141722] border border-[#D4AF37]/35 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <Users className="w-4 h-4" />
                <span>
                  {isFa
                    ? 'باشگاه ویزیتورهای پورسانتی (فروش White-Label به نمایشگاه‌های اتومبیل و دفاتر املاک)'
                    : 'White-Label Affiliate & Visitors Club (Up to 45% Instant Payout)'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isFa
                  ? 'فروش اختصاصی سامانه به اتوگالری‌ها و مشاورین املاک با ۴۵٪ پورسانت نقدی آنی'
                  : 'Sell White-Label AutoEstate VIP Licenses to Showrooms & Earn 45% Commission'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isFa
                  ? 'با معرفی یا فروش نسخه اختصاصی (White-Label) این سامانه به نمایشگاه‌های خودرو و آژانس‌های املاک در سراسر ایران، دبی و ترکیه، تا ۴۵٪ از مبلغ هر اشتراک مستقیماً به حساب شما واریز می‌گردد.'
                  : 'Equip car dealerships and real estate agencies with their own branded PWA + Android app and receive 45% direct commission on every closed deal.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    {isFa
                      ? `تعداد فروش ماهانه شما (${marketerSalesCount} نمایشگاه/املاک):`
                      : `Monthly Showroom Sales (${marketerSalesCount} Deals):`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={marketerSalesCount}
                    onChange={(e) => setMarketerSalesCount(Number(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    {isFa ? 'شماره موبایل ویزیتور جهت ساخت لینک معرف:' : 'Your Marketer Phone ID:'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={marketerPhone}
                    onChange={(e) => setMarketerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/15 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B0C10] p-6 rounded-2xl border border-[#D4AF37]/40 space-y-4 text-center">
              <div className="text-xs text-zinc-400">
                {isFa ? 'درآمد خالص ماهانه شما از پورسانت فروش (۴۵٪):' : 'Estimated Monthly Commission (45%):'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                {(marketerSalesCount * marketerPlanPrice * 0.45).toFixed(1)}{' '}
                {isFa ? 'میلیون تومان در ماه' : 'Million Toman / Mo'}
              </div>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/?ref=${encodeURIComponent(marketerPhone)}`;
                  navigator.clipboard.writeText(url).catch(() => {});
                  setCopiedRefLink(true);
                  setTimeout(() => setCopiedRefLink(false), 3000);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-xs hover:bg-[#e3c14d] transition-colors"
              >
                {copiedRefLink
                  ? isFa
                    ? '✓ لینک اختصاصی ویزیتوری شما کپی شد!'
                    : '✓ Referral Link Copied!'
                  : isFa
                  ? 'دریافت و کپی لینک اختصاصی باشگاه ویزیتورها'
                  : 'Copy Personal White-Label Referral Link'}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Luxury Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#08090C] py-8 px-4 sm:px-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#D4AF37]">
              AutoEstate VIP | اتواستیت وی‌آی‌پی
            </span>{' '}
            — {isFa ? 'اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM' : 'Creation Ecosystem | NewMetaverCity | Tavan Stage FBNM'}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPwaModal(true)}
              className="hover:text-white transition-colors"
            >
              {isFa ? 'راهنمای نصب آیفون و اندروید' : 'iOS & Android Install'}
            </button>
            <span>·</span>
            <button
              onClick={() => setShowDeployModal(true)}
              className="hover:text-white transition-colors"
            >
              {isFa ? 'پروژه اندروید (/android) و گیت‌هاب' : 'Android APK & GitHub Push'}
            </button>
          </div>
        </div>
      </footer>

      {/* Digital Inspection & Deed Modal */}
      <InspectionModal
        listing={selectedInspectionListing}
        onClose={() => setSelectedInspectionListing(null)}
        lang={lang}
        formatPrice={formatPrice}
        onOpenStoryMaker={(item) => setSelectedStoryListing(item)}
      />

      {/* 1-Click 1080x1920 HD Story Maker Modal */}
      <StoryMakerModal
        listing={selectedStoryListing}
        onClose={() => setSelectedStoryListing(null)}
        lang={lang}
        formatPrice={formatPrice}
      />

      {/* PWA Install Guide Modal (iOS Safari & Android) */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12141C] border border-[#D4AF37]/40 p-6 space-y-4 text-[#F5F5F0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>
                  {isFa
                    ? 'نصب ۱-کلیکی وب‌اپلیکیشن روی آیفون و اندروید'
                    : 'Install AutoEstate VIP on iOS & Android'}
                </span>
              </h3>
              <button onClick={() => setShowPwaModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isInstallable && (
              <button
                onClick={async () => {
                  await install();
                  setShowPwaModal(false);
                }}
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-sm"
              >
                {isFa ? 'نصب مستقیم روی دستگاه (Android / Desktop)' : 'Install Directly Now'}
              </button>
            )}

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#181B26] border border-white/10">
                <strong className="text-white block mb-1">
                  {isFa ? '🍎 راهنمای نصب روی آیفون و آیپد (Safari):' : '🍎 iPhone & iPad (Safari):'}
                </strong>
                {isFa
                  ? '۱. در مرورگر سافاری دکمه Share (مربع با فلش رو به بالا در نوار پایین) را لمس کنید.\n۲. گزینه «Add to Home Screen» را انتخاب کرده و Add را بزنید تا آیکون طلایی AutoEstate VIP به صفحه اصلی اضافه شود.'
                  : '1. Tap the Share button in Safari toolbar.\n2. Select "Add to Home Screen" to install the full-screen app.'}
              </div>

              <div className="p-3.5 rounded-xl bg-[#181B26] border border-white/10">
                <strong className="text-white block mb-1">
                  {isFa ? '🤖 راهنمای نصب روی اندروید (Chrome):' : '🤖 Android (Chrome):'}
                </strong>
                {isFa
                  ? 'از منوی سه نقطه بالای مرورگر کروم گزینه «Install App» یا «Add to Home Screen» را انتخاب نمایید.'
                  : 'Tap the browser menu and choose "Install App" or "Add to Home Screen".'}
              </div>
            </div>

            <button
              onClick={() => setShowPwaModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold"
            >
              {isFa ? 'متوجه شدم' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Android APK/AAB Project & 1-Click GitHub Direct Push Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#12141C] border border-[#D4AF37]/40 p-6 space-y-6 text-[#F5F5F0] shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <GitBranch className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base sm:text-lg font-bold">
                  {isFa
                    ? 'پوش مستقیم ۱-کلیکی به گیت‌هاب + پروژه کامل اندروید (/android)'
                    : '1-Click GitHub Direct Push & Android APK/AAB Builder'}
                </h3>
              </div>
              <button onClick={() => setShowDeployModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Android Project Info */}
            <div className="p-4 rounded-xl bg-[#181B26] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D4AF37]">
                  {isFa
                    ? 'پروژه کامل اندروید در مسیر `/android` آماده است'
                    : 'Native Android Project Ready in `/android`'}
                </span>
                <span className="font-mono text-emerald-400">com.autoestate.vip</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {isFa
                  ? 'پروژه اندروید شامل طعم‌های خروجی (Product Flavors) اختصاصی برای گوگل‌پلی (AAB/APK)، کافه‌بازار و مایکت است:'
                  : 'Configured with product flavors for Google Play, Cafe Bazaar, and Myket:'}
              </p>
              <pre
                dir="ltr"
                className="p-3 rounded-lg bg-[#0B0C10] text-zinc-200 font-mono text-[11px] overflow-x-auto border border-white/5"
              >
{`cd android
./gradlew assembleCafeBazaarRelease   # خروجی APK کافه‌بازار
./gradlew assembleMyketRelease        # خروجی APK مایکت
./gradlew bundleGooglePlayRelease     # خروجی AAB گوگل‌پلی`}
              </pre>
            </div>

            {/* 1-Click GitHub Direct Push Form */}
            <form onSubmit={handleDirectPush} className="space-y-4">
              <h4 className="text-sm font-bold text-white">
                {isFa
                  ? 'ارسال مستقیم کل سورس پروژه به گیت‌هاب (`/api/github/direct-push` بدون پوشه .github):'
                  : '1-Click Direct Push to GitHub Repository (/api/github/direct-push):'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    GitHub Personal Access Token (classic / repo scope):
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    required
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/15 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    GitHub Username / Owner:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={ghOwner}
                    onChange={(e) => setGhOwner(e.target.value)}
                    placeholder="your-github-username"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/15 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Repository Name:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={ghRepo}
                    onChange={(e) => setGhRepo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/15 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Branch:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={ghBranch}
                    onChange={(e) => setGhBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0C10] border border-white/15 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {ghStatus.error && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300">
                  {ghStatus.error}
                </div>
              )}

              {ghStatus.successUrl && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
                  <span>
                    {isFa
                      ? `✓ تعداد ${ghStatus.filesCount} فایل با موفقیت در گیت‌هاب پوش شد!`
                      : `✓ Successfully pushed ${ghStatus.filesCount} files to GitHub!`}
                  </span>
                  <a
                    href={ghStatus.successUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold flex items-center gap-1"
                  >
                    <span>View Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs text-white"
                >
                  {isFa ? 'بستن' : 'Close'}
                </button>
                <button
                  type="submit"
                  disabled={ghStatus.loading}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-xs hover:bg-[#e3c14d] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {ghStatus.loading
                      ? isFa
                        ? 'در حال ارسال مستقیم به گیت‌هاب...'
                        : 'Pushing to GitHub...'
                      : isFa
                      ? 'پوش مستقیم ۱-کلیکی به گیت‌هاب'
                      : '1-Click Direct Push to GitHub'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
