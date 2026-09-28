import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Valid 1x1 luxury obsidian-gold PNG buffer for PWA icon fallbacks
const LUXURY_GOLD_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(LUXURY_GOLD_PNG_BASE64, 'base64');

['/pwa-192x192.png', '/pwa-512x512.png', '/pwa-maskable-512x512.png', '/apple-touch-icon.png'].forEach((iconRoute) => {
  app.get(iconRoute, (_req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(pngBuffer);
  });
});

// Offline Expert Fallback for Auto & Real Estate Assistant
function buildOfflineExpertResponse(prompt: string, market: string, lang: string): string {
  const q = prompt.toLowerCase();
  const isEn = lang === 'en';

  if (isEn) {
    if (q.includes('barter') || q.includes('exchange') || q.includes('swap')) {
      return `**AutoEstate VIP Barter Valuation Advisory (${market === 'intl' ? 'International Market' : 'Iran Market'}):**\n\n1. **Liquidity Weighting**: Vehicles have higher instant liquidity (24–72h) compared to real estate (30–90 days). In standard barter deals, when swapping a luxury apartment or villa for 1–2 imported cars + cash, the party offering vehicles + cash typically receives a **4% to 7% liquidity discount** on the property price.\n2. **Simultaneous Escrow & Notary**: Always register the vehicle chassis/plate inspection (Sayadi/RTA) alongside the property deed transfer code in a single linked addendum.\n3. **Recommended Action**: Use our **Smart Barter Match Engine** tab above to input your asset value and automatically compute exact cash differences against verified inventory.`;
    }
    if (q.includes('lease') || q.includes('installment') || q.includes('check')) {
      return `**AutoEstate VIP Leasing & Installment Structure:**\n\n- **Minimum Down Payment**: 45% to 50% cash upon contract signing and vehicle delivery.\n- **Tenure**: 6, 12, 18, or 24 months via registered Sayadi checks (Iran) or Post-Dated Bank Cheques / EMI (Dubai/Turkey).\n- **Title Retention**: 3 to 6 dangs of the vehicle plate/title remain pledged to the showroom until final check clearance, while full possession and insurance are handed over immediately.`;
    }
    return `**AutoEstate VIP Senior Advisory:**\n\nBased on current market metrics in **${market === 'intl' ? 'Dubai, Istanbul & Northern Cyprus' : 'Tehran, Lavasan, Kordan & Mazandaran'}**:\n- **Luxury Vehicles**: Zero-kilometer and low-mileage imported SUVs (Mercedes-Benz, BMW, Porsche, Land Cruiser) maintain the highest inflation hedge and instant barter demand.\n- **Prime Real Estate**: Single-deed (Tak-Barg) penthouses in District 1 Tehran and Golden-Visa eligible waterfront apartments in Dubai Marina offer 8.2%–11.5% annual yield.\n\nUse the **Barter Match Engine** or **Dual Leasing & Commission Calculator** for exact numeric breakdowns.`;
  }

  if (q.includes('تهاتر') || q.includes('معاوضه') || q.includes('ماشین با ملک') || q.includes('خودرو با آپارتمان')) {
    return `**مشاوره تخصصی کارشناس ارشد تهاتر AutoEstate VIP:**\n\n۱. **فرمول طلایی نقدشوندگی در تهاتر:** از آنجا که خودرو کالای نقدشونده‌تری نسبت به ملک است، در معاملات تهاتر آپارتمان یا ویلا با خودرو (مثلاً آپارتمان ۱۲۰ متری در برابر ۲ دستگاه خودروی وارداتی + مابه‌التفاوت نقدی)، معمولاً به خریدار ملک که خودرو و پول نقد می‌دهد بین **۴٪ تا ۷٪ خوش‌حسابی نقدینگی** تعلق می‌گیرد.\n۲. **همزمانی انتقال سند و پلاک:** حتماً در مبایعه‌نامه قید شود که تعویض پلاک خودرو و تنظیم سند قطعی ملک در یک دفترخانه اسناد رسمی و همزمان با ثبت چک صیادی مابه‌التفاوت انجام گردد.\n۳. **پیشنهاد ویژه:** در بخش **«موتور تطبیق خودکار تهاتر»** در همین صفحه، ارزش دارایی خود را وارد کنید تا سیستم به صورت لحظه‌ای آگهی‌های هم‌ارزش و مابه‌التفاوت دقیق نقدی را محاسبه کند.`;
  }

  if (q.includes('اقساط') || q.includes('لیزینگ') || q.includes('چک') || q.includes('صیادی')) {
    return `**راهنمای شرایط اقساط و لیزینگ خودرو با چک صیادی ثبتی:**\n\n- **پیش‌پرداخت استاندارد:** حداقل ۴۰٪ تا ۶۰٪ مبلغ خودرو به صورت نقد همزمان با تحویل فوری خودرو.\n- **مدت بازپرداخت:** از ۶ تا ۲۴ ماه با چک‌های صیادی بنفش ثبت‌شده در سامانه صیاد (ماهانه یا دو ماه یک‌بار).\n- **وضعیت سند و پلاک:** پلاک از روز اول به نام خریدار تعویض می‌شود و به میزان مبلغ اقساط، دانگ خودرو در رهن نمایشگاه باقی می‌ماند تا زمان پاس شدن آخرین چک.\n- **محاسبه دقیق:** از تب **«ماشین‌حساب اقساط لیزینگ و کمیسیون»** می‌توانید پیش‌فاکتور رسمی واتساپ را در ۱ ثانیه صادر کنید.`;
  }

  if (q.includes('کمیسیون') || q.includes('حق العمل') || q.includes('قولنامه') || q.includes('مالیات')) {
    return `**تعرفه قانونی کمیسیون معاملات املاک و خودرو (مصوب اتحادیه):**\n\n- **معاملات خرید و فروش ملک:** ۰.۲۵ درصد (یک‌چهارم درصد) از کل ارزش معامله از هر طرف (خریدار و فروشنده) + ۱۰٪ مالیات بر ارزش افزوده روی مبلغ کمیسیون.\n- **معاملات خودرو در اتوگالری:** طبق تعرفه رسمی، ۱٪ از هر طرف (یا توافقی بین ۰.۵٪ تا ۱٪ در خودروهای لوکس بالای ۱۰ میلیارد تومان) به همراه صدور برگ کارشناسی رسمی بدنه و فنی.\n- برای دریافت ریز ارقام ریالی/تومانی به همراه حق ثبت محضر، از **ماشین‌حساب کمیسیون قانونی** در برنامه استفاده نمایید.`;
  }

  if (q.includes('دبی') || q.includes('ترکیه') || q.includes('اقامت') || q.includes('ارز') || q.includes('بین‌الملل')) {
    return `**مشاوره سرمایه‌گذاری بین‌المللی (دبی، استانبول و قبرس شمالی):**\n\n- **دبی (امارات):** با خرید ملک به ارزش حداقل ۲ میلیون درهم (AED) در مناطق Freehold (دبی مارینا، داون‌تاون، پالم جمیرا)، واجد شرایط دریافت **ویزای طلایی ۱۰ ساله (Golden Visa)** برای کل خانواده می‌شوید. امکان پرداخت اقساطی بدون بهره به سازنده (Off-Plan) نیز فراهم است.\n- **ترکیه:** خرید ملک بالای ۴۰۰,۰۰۰ دلار (USD) امکان اخذ شهروندی و پاسپورت ترکیه را فراهم می‌سازد.\n- از دکمه سوییچ بالای صفحه می‌توانید روی **«بازار بین‌المللی دبی و ترکیه»** کلیک کنید تا قیمت‌ها به درهم، دلار و یورو نمایش داده شوند.`;
  }

  return `**پاسخ کارشناس هوشمند AutoEstate VIP (${market === 'intl' ? 'بازار بین‌المللی دبی و ترکیه' : 'بازار ایران - تومان و چک صیادی'}):**\n\nبر اساس تحلیل روز بازار خودرو و املاک لوکس:\n۱. **کارشناسی فنی و بدنه:** در خرید خودروهای وارداتی و لوکس، سلامت شاسی، کارکرد واقعی دیاگ و ضخامت‌سنجی دیجیتال میکرونی رنگ (بدون رنگ / پیانویی) تا ۲۰٪ روی قیمت نهایی اثرگذار است.\n۲. **معاملات ترکیبی (تهاتر):** بهترین استراتژی در شرایط فعلی بازار، معاوضه املاک متراژ بالا با «خودروی لوکس رند بازار + سرانه نقدی یا چک صیادی کوتاه‌مدت» است تا نقدشوندگی دو طرف معامله تضمین شود.\n۳. **ابزارهای آماده شما:** هم‌اکنون می‌توانید از **موتور تطبیق خودکار تهاتر**، **ماشین‌حساب اقساط لیزینگ** و **استوری‌ساز ۱-کلیکی ۱۰۸۰×۱۹۲۰** در همین سامانه استفاده نمایید.`;
}

// POST /api/ai-assistant
app.post('/api/ai-assistant', async (req, res) => {
  const { prompt, market = 'iran', lang = 'fa', contextData } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      reply: buildOfflineExpertResponse(prompt, market, lang),
      mode: 'offline-expert',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction =
      lang === 'en'
        ? `You are the Senior Luxury Automotive & Real Estate Expert Advisor for "AutoEstate VIP" (Part of Creation Ecosystem | NewMetaverCity | Tavan Stage FBNM). Provide concise, authoritative, financial and technical advice on car inspection, leasing installments, property deed verification, and property-for-car barter deals. Current active market: ${market === 'intl' ? 'International (Dubai AED, Turkey USD, Europe EUR)' : 'Iran (Toman, Sayadi Registered Checks, Barter)'}. Keep responses structured and under 180 words.`
        : `شما کارشناس ارشد و مشاور حقوقی، فنی و مالی «AutoEstate VIP | اتواستیت وی‌آی‌پی» (اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM) در حوزه نمایشگاه خودروهای لوکس، املاک وی‌آی‌پی، معاملات تهاتر ملک و خودرو، چک صیادی ثبتی و سرمایه‌گذاری در ایران، دبی و ترکیه هستید. پاسخ‌های دقیق، کاربردی، محترمانه و ساختاریافته (حداکثر ۱۸۰ کلمه) ارائه دهید. بازار فعال فعلی کاربر: ${market === 'intl' ? 'بازار بین‌المللی دبی و ترکیه (USD, AED, EUR)' : 'بازار ایران (تومان، چک صیادی، تهاتر ملک و خودرو)'}.`;

    const fullPrompt = contextData
      ? `${prompt}\n\n[Context Inventory / Calculator State]: ${JSON.stringify(contextData)}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || buildOfflineExpertResponse(prompt, market, lang);
    return res.json({ reply: text, mode: 'gemini-live' });
  } catch (err) {
    // Graceful fallback to offline expert responder if rate limit or network error occurs
    return res.json({
      reply: buildOfflineExpertResponse(prompt, market, lang),
      mode: 'offline-expert-fallback',
    });
  }
});

// Helper to recursively collect project files for GitHub direct push (excluding node_modules, dist, .git, .github)
function collectProjectFiles(dir: string, baseDir: string = dir): Array<{ path: string; content: string }> {
  const results: Array<{ path: string; content: string }> = [];
  const ignored = new Set(['node_modules', 'dist', '.git', '.github', '.DS_Store', 'package-lock.json']);

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      results.push(...collectProjectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size < 500_000) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          results.push({ path: relPath, content });
        }
      } catch {
        // skip unreadable files
      }
    }
  }
  return results;
}

// POST /api/github/direct-push
app.post('/api/github/direct-push', async (req, res) => {
  const { token, owner, repo, branch = 'main', commitMessage = 'Deploy AutoEstate VIP Full-Stack + Android APK/AAB Project' } = req.body || {};

  if (!token || !owner || !repo) {
    return res.status(400).json({
      error: 'لطفاً توکن گیت‌هاب (Personal Access Token)، نام کاربری (Owner) و نام مخزن (Repo) را وارد کنید.',
    });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'AutoEstate-VIP-Deployer',
  };

  try {
    // 1. Ensure repository exists or verify access
    const repoCheck = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (repoCheck.status === 404) {
      // Attempt to create the repo automatically for the authenticated user
      const createRes = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: repo,
          description: 'AutoEstate VIP | سامانه هوشمند نمایشگاه خودرو، املاک لوکس، تهاتر ملک و خودرو و محاسبه‌گر اقساط لیزینگ',
          private: false,
          auto_init: true,
        }),
      });
      if (!createRes.ok) {
        const errBody = await createRes.text();
        return res.status(400).json({ error: `مخزن یافت نشد و امکان ساخت خودکار نبود: ${errBody}` });
      }
    } else if (!repoCheck.ok) {
      const errBody = await repoCheck.text();
      return res.status(repoCheck.status).json({ error: `خطا در دسترسی به گیت‌هاب: ${errBody}` });
    }

    // 2. Collect all workspace files (never including .github)
    const files = collectProjectFiles(__dirname);

    // 3. Get reference of target branch
    let baseTreeSha: string | undefined;
    let parentCommitSha: string | undefined;

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers });
    if (refRes.ok) {
      const refData = (await refRes.json()) as { object?: { sha?: string } };
      parentCommitSha = refData.object?.sha;
      if (parentCommitSha) {
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${parentCommitSha}`, { headers });
        if (commitRes.ok) {
          const commitData = (await commitRes.json()) as { tree?: { sha?: string } };
          baseTreeSha = commitData.tree?.sha;
        }
      }
    }

    // 4. Create Git Tree with all project files
    const treeItems = files.map((file) => ({
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: file.content,
    }));

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...(baseTreeSha ? { base_tree: baseTreeSha } : {}),
        tree: treeItems,
      }),
    });

    if (!treeRes.ok) {
      const errText = await treeRes.text();
      return res.status(400).json({ error: `خطا در ساخت درخت فایل‌های گیت‌هاب: ${errText}` });
    }

    const treeData = (await treeRes.json()) as { sha: string };

    // 5. Create Commit
    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: treeData.sha,
        parents: parentCommitSha ? [parentCommitSha] : [],
      }),
    });

    if (!newCommitRes.ok) {
      const errText = await newCommitRes.text();
      return res.status(400).json({ error: `خطا در ثبت کامیت گیت‌هاب: ${errText}` });
    }

    const newCommitData = (await newCommitRes.json()) as { sha: string; html_url?: string };

    // 6. Update or Create Branch Reference
    if (parentCommitSha) {
      await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: newCommitData.sha, force: true }),
      });
    } else {
      await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: newCommitData.sha }),
      });
    }

    return res.json({
      success: true,
      filesCount: files.length,
      commitSha: newCommitData.sha,
      repoUrl: `https://github.com/${owner}/${repo}/tree/${branch}`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `خطا در ارتباط با سرور گیت‌هاب: ${msg}` });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoEstate VIP Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
