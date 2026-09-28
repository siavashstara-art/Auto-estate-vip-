import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileCheck2, Gauge, Wrench, Building2, Award } from 'lucide-react';
import { LuxuryListing } from '../data/listingsData';

interface InspectionModalProps {
  listing: LuxuryListing | null;
  onClose: () => void;
  lang: 'fa' | 'en';
  formatPrice: (listing: LuxuryListing) => string;
  onOpenStoryMaker: (listing: LuxuryListing) => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  listing,
  onClose,
  lang,
  formatPrice,
  onOpenStoryMaker,
}) => {
  if (!listing) return null;
  const isFa = lang === 'fa';
  const insp = listing.inspection;
  const deed = listing.propertyDeed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#12141C] border border-[#D4AF37]/40 text-[#F5F5F0] shadow-2xl overflow-hidden my-8">
        {/* Top Gold Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1A1D28] via-[#221E15] to-[#1A1D28] border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#F5F5F0]">
                {insp
                  ? isFa
                    ? 'برگه کارشناسی دیجیتال رنگ، بدنه و شاسی خودرو'
                    : 'Digital Vehicle Paint, Body & Chassis Inspection Sheet'
                  : isFa
                  ? 'شناسنامه ثبتی، سند تک‌برگ و پایان‌کار ملک'
                  : 'Official Title Deed & Municipal Completion Certificate'}
              </h3>
              <p className="text-xs text-[#D4AF37] tabular-nums">
                {insp
                  ? `${isFa ? 'کد هولوگرام کارشناسی:' : 'Inspection Certificate ID:'} ${insp.certificateCode}`
                  : `${isFa ? 'پلاک ثبتی:' : 'Registration Plaque:'} ${deed?.registrationPlaque}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div>
              <h4 className="text-xl font-bold text-white">
                {isFa ? listing.titleFa : listing.titleEn}
              </h4>
              <p className="text-sm text-zinc-400 mt-1">
                {isFa ? listing.locationFa : listing.locationEn}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-zinc-400">
                {isFa ? 'ارزش کارشناسی روز:' : 'Verified Valuation:'}
              </div>
              <div className="text-xl font-bold text-[#D4AF37] tabular-nums">
                {formatPrice(listing)}
              </div>
            </div>
          </div>

          {insp ? (
            <>
              {/* Vehicle 4 Key Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#181B26] border border-emerald-500/30">
                  <div className="text-xs text-zinc-400">{isFa ? 'وضعیت رنگ بدنه' : 'Paint Condition'}</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{insp.paintFree ? (isFa ? 'بدون رنگ (فابریک)' : '100% Original Paint') : ''}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181B26] border border-emerald-500/30">
                  <div className="text-xs text-zinc-400">{isFa ? 'وضعیت شاسی و ستون' : 'Chassis & Pillars'}</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{insp.chassisSealed ? (isFa ? 'پلمپ کارخانه' : 'Factory Sealed') : ''}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#D4AF37]/30">
                  <div className="text-xs text-zinc-400">{isFa ? 'کارکرد واقعی دیاگ' : 'Verified Mileage'}</div>
                  <div className="text-sm font-bold text-[#F5F5F0] mt-1 flex items-center gap-1.5 tabular-nums">
                    <Gauge className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>
                      {insp.realMileageKm.toLocaleString()} {isFa ? 'کیلومتر' : 'km'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#D4AF37]/30">
                  <div className="text-xs text-zinc-400">{isFa ? 'سال ساخت' : 'Model Year'}</div>
                  <div className="text-sm font-bold text-[#D4AF37] mt-1 tabular-nums">{insp.year}</div>
                </div>
              </div>

              {/* Top-Down Car Schematic & Micron Paint Thickness Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#0E1017] p-5 rounded-xl border border-white/10">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-medium text-zinc-400 mb-3">
                    {isFa
                      ? 'شماتیک تست ضخامت‌سنج دیجیتال میکرونی (μm)'
                      : 'Digital Ultrasonic Paint Thickness Schematic (μm)'}
                  </div>
                  <svg viewBox="0 0 260 360" className="w-48 h-64">
                    {/* Car Body Outline */}
                    <rect
                      x="45"
                      y="20"
                      width="170"
                      height="320"
                      rx="42"
                      fill="#161924"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                    />
                    {/* Hood */}
                    <path
                      d="M55 60 Q130 35 205 60 L195 125 L65 125 Z"
                      fill="#10B981"
                      fillOpacity="0.18"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <text x="130" y="95" fill="#F5F5F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isFa ? 'کاپوت' : 'Hood'}: {insp.zones.hoodMicron}μm
                    </text>

                    {/* Roof / Cabin */}
                    <rect
                      x="68"
                      y="132"
                      width="124"
                      height="105"
                      rx="14"
                      fill="#10B981"
                      fillOpacity="0.15"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <text x="130" y="188" fill="#F5F5F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isFa ? 'سقف' : 'Roof'}: {insp.zones.roofMicron}μm
                    </text>

                    {/* Trunk */}
                    <path
                      d="M65 245 L195 245 L205 305 Q130 325 55 305 Z"
                      fill="#10B981"
                      fillOpacity="0.18"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <text x="130" y="280" fill="#F5F5F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isFa ? 'صندوق' : 'Trunk'}: {insp.zones.trunkMicron}μm
                    </text>

                    {/* Left & Right Indicators */}
                    <text x="26" y="160" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {insp.zones.frontLeftDoorMicron}μm
                    </text>
                    <text x="234" y="160" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {insp.zones.frontRightDoorMicron}μm
                    </text>
                    <text x="26" y="235" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {insp.zones.rearLeftFenderMicron}μm
                    </text>
                    <text x="234" y="235" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {insp.zones.rearRightFenderMicron}μm
                    </text>
                  </svg>
                  <span className="text-xs text-emerald-400 mt-2">
                    {isFa ? 'سبز = فابریک کارخانه (بدون رنگ و بتونه)' : 'Green = 100% Factory Paint (95–125μm)'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#161924] border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Wrench className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isFa ? 'وضعیت فنی موتور:' : 'Engine Diagnostics:'}</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">{insp.engineHealth}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161924] border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Wrench className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isFa ? 'وضعیت گیربکس و انتقال قدرت:' : 'Transmission Health:'}</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">{insp.gearboxHealth}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161924] border border-[#D4AF37]/30">
                    <div className="text-xs text-[#D4AF37] font-semibold">
                      {isFa ? 'نظریه نهایی کارشناس رسمی:' : 'Senior Inspector Verdict:'}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                      {isFa ? insp.zones.statusNoteFa : insp.zones.statusNoteEn}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : deed ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#181B26] border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span>{isFa ? 'نوع سند مالکیت' : 'Title Deed Status'}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-1.5">
                    {isFa ? deed.deedTypeFa : deed.deedTypeEn}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181B26] border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>{isFa ? 'وضعیت پایان‌کار و عدم خلافی' : 'Municipal Completion Cert'}</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1.5">
                    {isFa ? deed.completionCertFa : deed.completionCertEn}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-[#161924] border border-white/10">
                  <div className="text-xs text-zinc-400">{isFa ? 'متراژ سندی' : 'Deeded Area'}</div>
                  <div className="text-base font-bold text-[#D4AF37] mt-1 tabular-nums">
                    {deed.areaSqm} {isFa ? 'متر مربع' : 'sqm'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#161924] border border-white/10">
                  <div className="text-xs text-zinc-400">{isFa ? 'تعداد خواب مستر' : 'Master Bedrooms'}</div>
                  <div className="text-base font-bold text-white mt-1 tabular-nums">
                    {deed.bedrooms} {isFa ? 'خواب' : 'Beds'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#161924] border border-white/10">
                  <div className="text-xs text-zinc-400">{isFa ? 'سال ساخت / تحویل' : 'Completion Year'}</div>
                  <div className="text-base font-bold text-white mt-1 tabular-nums">{deed.buildYear}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1A1D28] to-[#231F14] border border-[#D4AF37]/40 flex items-start gap-3">
                <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#D4AF37]">
                    {isFa ? 'مزیت بین‌المللی و اقامتی:' : 'International Residency Privilege:'}
                  </div>
                  <p className="text-xs text-zinc-200 mt-1 leading-relaxed">
                    {isFa ? deed.residencyBonusFa : deed.residencyBonusEn}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Barter & Leasing Summary */}
          <div className="p-4 rounded-xl bg-[#161924] border border-white/10 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-zinc-400">{isFa ? 'شرایط تهاتر و معاوضه:' : 'Barter Terms:'}</span>
              <span className="font-semibold text-[#D4AF37]">
                {isFa ? listing.barterConditionFa : listing.barterConditionEn}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <span className="text-zinc-400">{isFa ? 'شرایط اقساط و چک صیادی:' : 'Leasing / Installments:'}</span>
              <span className="font-semibold text-white">
                {isFa ? listing.leasingTermsFa : listing.leasingTermsEn}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenStoryMaker(listing);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-xs hover:bg-[#e3c14d] transition-colors"
            >
              {isFa ? 'طراحی پوستر استوری ۱۰۸۰×۱۹۲۰ این آگهی' : 'Generate 1080x1920 Story Poster'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition-colors"
            >
              {isFa ? 'بستن برگه کارشناسی' : 'Close Sheet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
