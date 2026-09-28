import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Sparkles, Phone, Building } from 'lucide-react';
import { LuxuryListing } from '../data/listingsData';

interface StoryMakerModalProps {
  listing: LuxuryListing | null;
  onClose: () => void;
  lang: 'fa' | 'en';
  formatPrice: (listing: LuxuryListing) => string;
}

export const StoryMakerModal: React.FC<StoryMakerModalProps> = ({
  listing,
  onClose,
  lang,
  formatPrice,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isFa = lang === 'fa';

  const [galleryName, setGalleryName] = useState(
    'اتوگالری و املاک رویال AutoEstate VIP'
  );
  const [phoneNumber, setPhoneNumber] = useState('0912-000-4500 | 021-22009900');
  const [customBadge, setCustomBadge] = useState('تهاتر فوری با ملک و خودرو | اقساط چک صیادی');
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!listing) return;
    renderStoryCanvas();
  }, [listing, galleryName, phoneNumber, customBadge, lang]);

  const renderStoryCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !listing) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const drawPoster = (loadedImg?: HTMLImageElement) => {
      const W = 1080;
      const H = 1920;
      ctx.clearRect(0, 0, W, H);

      // 1. Deep Obsidian & Gold Luxury Background
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#090A0F');
      bgGrad.addColorStop(0.5, '#121521');
      bgGrad.addColorStop(1, '#090A0F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Outer Gold Frame
      const goldGrad = ctx.createLinearGradient(0, 0, W, H);
      goldGrad.addColorStop(0, '#F3E5AB');
      goldGrad.addColorStop(0.5, '#D4AF37');
      goldGrad.addColorStop(1, '#996515');

      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 6;
      ctx.strokeRect(44, 44, W - 88, H - 88);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
      ctx.lineWidth = 2;
      ctx.strokeRect(62, 62, W - 124, H - 124);

      // 3. Top Header Branding
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 30px Vazirmatn, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM', W / 2, 130);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 54px Vazirmatn, sans-serif';
      ctx.fillText('AUTOESTATE VIP | اتواستیت وی‌آی‌پی', W / 2, 205);

      // 4. Listing Photo Box (or Luxury Graphic Vector Fallback)
      const imgX = 90;
      const imgY = 260;
      const imgW = W - 180;
      const imgH = 660;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 32);
      ctx.clip();

      if (loadedImg) {
        // Cover crop math
        const scale = Math.max(imgW / loadedImg.width, imgH / loadedImg.height);
        const sw = loadedImg.width * scale;
        const sh = loadedImg.height * scale;
        const dx = imgX + (imgW - sw) / 2;
        const dy = imgY + (imgH - sh) / 2;
        ctx.drawImage(loadedImg, dx, dy, sw, sh);
      } else {
        const fallbackGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
        fallbackGrad.addColorStop(0, '#1C2030');
        fallbackGrad.addColorStop(1, '#292214');
        ctx.fillStyle = fallbackGrad;
        ctx.fillRect(imgX, imgY, imgW, imgH);
      }

      // Dark bottom gradient overlay on photo
      const scrim = ctx.createLinearGradient(0, imgY + imgH - 220, 0, imgY + imgH);
      scrim.addColorStop(0, 'rgba(9,10,15,0)');
      scrim.addColorStop(1, 'rgba(9,10,15,0.92)');
      ctx.fillStyle = scrim;
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.restore();

      // Gold border around photo
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 32);
      ctx.stroke();

      // 5. Special Badge Pill on Photo Bottom
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.roundRect(140, imgY + imgH - 85, W - 280, 64, 16);
      ctx.fill();

      ctx.fillStyle = '#0B0C10';
      ctx.font = 'bold 30px Vazirmatn, sans-serif';
      ctx.fillText(customBadge, W / 2, imgY + imgH - 42);

      // 6. Title & Price Block
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 46px Vazirmatn, sans-serif';
      const title = isFa ? listing.titleFa : listing.titleEn;
      ctx.fillText(title, W / 2, 1015);

      ctx.fillStyle = '#A1A1AA';
      ctx.font = '500 28px Vazirmatn, sans-serif';
      ctx.fillText(isFa ? listing.locationFa : listing.locationEn, W / 2, 1070);

      // Price Box
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(90, 1115, W - 180, 125, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.font = '800 50px Vazirmatn, sans-serif';
      ctx.fillText(formatPrice(listing), W / 2, 1195);

      // 7. Key Specs & Inspection / Deed Highlights
      const specs = isFa ? listing.specsFa : listing.specsEn;
      let specY = 1310;
      specs.forEach((spec) => {
        ctx.fillStyle = '#181B26';
        ctx.beginPath();
        ctx.roundRect(90, specY - 45, W - 180, 66, 14);
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 30px Vazirmatn, sans-serif';
        ctx.fillText(`✓  ${spec}`, W / 2, specY);
        specY += 82;
      });

      // 8. Leasing & Barter Box
      ctx.fillStyle = '#151822';
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(90, 1565, W - 180, 130, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 28px Vazirmatn, sans-serif';
      ctx.fillText(isFa ? listing.leasingTermsFa : listing.leasingTermsEn, W / 2, 1618);

      ctx.fillStyle = '#D4AF37';
      ctx.font = '500 25px Vazirmatn, sans-serif';
      ctx.fillText(
        (isFa ? listing.barterConditionFa : listing.barterConditionEn).slice(0, 68),
        W / 2,
        1668
      );

      // 9. Footer Showroom Contact Bar
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.roundRect(90, 1730, W - 180, 115, 22);
      ctx.fill();

      ctx.fillStyle = '#0B0C10';
      ctx.font = '800 34px Vazirmatn, sans-serif';
      ctx.fillText(galleryName, W / 2, 1780);

      ctx.font = 'bold 30px JetBrains Mono, Vazirmatn, sans-serif';
      ctx.fillText(`✆ ${phoneNumber}`, W / 2, 1825);

      setIsRendering(false);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => drawPoster(img);
    img.onerror = () => drawPoster(undefined);
    img.src = listing.image;
  };

  if (!listing) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `AutoEstate-VIP-Story-${listing.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback if external image tainted canvas: re-render with vector backdrop and download
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = `AutoEstate-VIP-Story-${listing.id}.png`;
        a.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#12141C] border border-[#D4AF37]/40 text-[#F5F5F0] shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-[#181B26] border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base sm:text-lg font-bold">
              {isFa
                ? 'استوری‌ساز ۱-کلیکی اتوگالری و مشاور املاک (1080×1920 HD)'
                : '1-Click Showroom & Real Estate HD Story Maker (1080×1920)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="md:col-span-6 space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isFa
                ? 'بدون نیاز به فتوشاپ، نام نمایشگاه یا آژانس املاک و شماره تماس خود را وارد کنید و پوستر استوری اینستاگرام / واتساپ با کیفیت ۱۰۸۰×۱۹۲۰ مشکی-طلایی را دانلود نمایید.'
                : 'Customize your showroom or agency branding below and download a ready-to-share 1080×1920 HD Black-Gold Story poster.'}
            </p>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isFa ? 'نام اتوگالری یا دپارتمان املاک:' : 'Showroom / Agency Name:'}</span>
              </label>
              <input
                type="text"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isFa ? 'شماره تماس مدیریت / کارشناس فروش:' : 'Contact Phone Numbers:'}</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-white font-mono focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5">
                {isFa ? 'تگ طلایی شرایط ویژه روی عکس:' : 'Special Offer Highlight Banner:'}
              </label>
              <input
                type="text"
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-5 rounded-xl bg-[#D4AF37] text-[#0B0C10] font-bold text-sm hover:bg-[#e3c14d] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isFa
                    ? 'دانلود فوری پوستر استوری ۱۰۸۰×۱۹۲۰ (PNG HD)'
                    : 'Download 1080×1920 HD Story Poster (PNG)'}
                </span>
              </button>
              {isRendering && (
                <span className="text-xs text-center text-[#D4AF37]">
                  {isFa ? 'در حال رندر گرافیک اختصاصی...' : 'Rendering HD Canvas...'}
                </span>
              )}
            </div>
          </div>

          {/* Live Canvas Preview Column */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="text-xs text-zinc-400 mb-2">
              {isFa ? 'پیش‌نمایش زنده بوم HTML5 Canvas (نسبت ۹:۱۶):' : 'Live HTML5 Canvas Preview (9:16):'}
            </div>
            <div className="w-64 sm:w-72 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-[#090A0F]">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1920}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
