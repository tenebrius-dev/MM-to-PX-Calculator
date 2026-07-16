import { useState, useEffect } from 'react';
import { Input } from './components/Input';
import {
  parseInput,
  formatOutput,
  calculateGross,
  calculateNet,
} from './utils/calculator';

interface FigmaSvgConfig {
  innerFrameName: string;
  outerFrameName: string;
  pageWidth: number;
  pageHeight: number;
  bleedPx: number;
  verticalGuides?: number[];
  horizontalGuides?: number[];
}

function createFigmaSvg({
  innerFrameName,
  outerFrameName,
  pageWidth,
  pageHeight,
  bleedPx,
  verticalGuides = [],
  horizontalGuides = [],
}: FigmaSvgConfig) {
  const trimWidth = Number(pageWidth);
  const trimHeight = Number(pageHeight);
  const bleed = Number(bleedPx);

  const outerWidth = trimWidth + bleed * 2;
  const outerHeight = trimHeight + bleed * 2;

  const verticalPaths = verticalGuides
    .map(Number)
    .filter(Number.isFinite)
    .map(x => `<path id="guide-x-${x}" d="M ${x} 0 V ${outerHeight}" />`)
    .join("");

  const horizontalPaths = horizontalGuides
    .map(Number)
    .filter(Number.isFinite)
    .map(y => `<path id="guide-y-${y}" d="M 0 ${y} H ${outerWidth}" />`)
    .join("");

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  id="${outerFrameName}"
  width="${outerWidth}"
  height="${outerHeight}"
  viewBox="0 0 ${outerWidth} ${outerHeight}"
>
  <title>${outerFrameName}</title>

  <defs>
    <clipPath id="frame-clip">
      <rect width="${outerWidth}" height="${outerHeight}" />
    </clipPath>
  </defs>

  <rect
    id="BACKGROUND"
    width="${outerWidth}"
    height="${outerHeight}"
    fill="#FFFFFF"
  />

  <g
    id="${innerFrameName}"
    transform="translate(${bleed} ${bleed})"
  >
    <rect
      width="${trimWidth}"
      height="${trimHeight}"
      fill="#FFFFFF"
    />
  </g>

  <g
    id="GUIDES"
    clip-path="url(#frame-clip)"
    fill="none"
    stroke="#00A8FF"
    stroke-width="1"
    opacity="0.75"
  >
    ${verticalPaths}
    ${horizontalPaths}
  </g>
</svg>`.trim();
}

type Lang = 'RU' | 'ENG';

const dict = {
  RU: {
    subtitle: 'КАЛЬКУЛЯТОР ФОРМАТОВ',
    step1: 'РАЗМЕР И ОРИЕНТАЦИЯ',
    size_mm: 'Размер (мм)',
    portrait: 'Книжная',
    landscape: 'Альбомная',
    width: 'ШИРИНА',
    height: 'ВЫСОТА',
    mm: 'мм',
    step2: 'ВЫЛЕТЫ И ПОЛЯ',
    bleeds_margins_mm: 'Вылеты и поля (мм)',
    bleeds: 'ВЫЛЕТЫ',
    margins: 'ПОЛЯ',
    step3: 'РАЗРЕШЕНИЕ',
    resolution_dpi: 'Разрешение (DPI)',
    dpi: 'DPI',
    bleeds_preview: 'ВЫЛЕТЫ (BLEEDBOX)',
    margins_preview: 'ПОЛЯ (MARGINS)',
    format_bleedbox: 'ФОРМАТ С УЧЕТОМ ВЫЛЕТОВ (BLEEDBOX)',
    copy_w: 'Скопировать ширину',
    copy_h: 'Скопировать высоту',
    copied: '✓ СКОПИРОВАНО',
    px: 'px',
    format_cropbox: 'ОБРЕЗНОЙ ФОРМАТ (CROPBOX)',
    copy_figma: 'Скопировать фрейм для Figma',
    copy_figma_net: 'Скопировать фрейм для Figma без вылетов',
    figma_hint1: 'Не забудьте спрятать направляющие',
    figma_hint2: 'вылетов и полей перед экспортом из Figma',
    info: 'Инфо',
    clipboard_error: 'Браузер не разрешил доступ к буферу обмена',
    with_bleeds: 'с вылетами',
  },
  ENG: {
    subtitle: 'FORMAT CALCULATOR',
    step1: 'SIZE & ORIENTATION',
    size_mm: 'Size (mm)',
    portrait: 'Portrait',
    landscape: 'Landscape',
    width: 'WIDTH',
    height: 'HEIGHT',
    mm: 'mm',
    step2: 'BLEEDS & MARGINS',
    bleeds_margins_mm: 'Bleeds & margins (mm)',
    bleeds: 'BLEEDS',
    margins: 'MARGINS',
    step3: 'RESOLUTION',
    resolution_dpi: 'Resolution (DPI)',
    dpi: 'DPI',
    bleeds_preview: 'BLEEDBOX',
    margins_preview: 'MARGINS',
    format_bleedbox: 'PAGE SIZE WITH BLEEDS (BLEEDBOX)',
    copy_w: 'Copy width',
    copy_h: 'Copy height',
    copied: '✓ COPIED',
    px: 'px',
    format_cropbox: 'CROPPED PAGE SIZE (CROPBOX)',
    copy_figma: 'Copy frame for Figma',
    copy_figma_net: 'Copy frame for Figma without bleeds',
    figma_hint1: "Don't forget to hide the bleed and margin",
    figma_hint2: "guides before exporting from Figma",
    info: 'Info',
    clipboard_error: 'Browser denied clipboard access',
    with_bleeds: 'with bleeds',
  }
};

type Preset = 'A5' | 'A4' | 'A3' | 'A2' | 'A1' | null;
type Orientation = 'portrait' | 'landscape';

const PRESETS = {
  A5: { width: 148, height: 210 },
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
  A2: { width: 420, height: 594 },
  A1: { width: 594, height: 841 },
};

export default function App() {
  const [preset, setPreset] = useState<Preset>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [width, setWidth] = useState('210');
  const [height, setHeight] = useState('297');
  const [linked, setLinked] = useState(false);
  const [bleed, setBleed] = useState('5');
  const [margin, setMargin] = useState('10');
  const [dpi, setDpi] = useState('72');
  type CopiedState = 'grossW' | 'grossH' | 'netW' | 'netH' | null;
  const [copiedState, setCopiedState] = useState<CopiedState>(null);
  const [figmaCopied, setFigmaCopied] = useState(false);
  const [figmaCopiedNet, setFigmaCopiedNet] = useState(false);
  const [lang, setLang] = useState<Lang>('RU');
  const t = dict[lang];

  useEffect(() => {
    if (!figmaCopied && !figmaCopiedNet) return;
    const handleDocumentClick = () => {
      setFigmaCopied(false);
      setFigmaCopiedNet(false);
    };
    // Use timeout to prevent immediate closure on the initial click
    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [figmaCopied, figmaCopiedNet]);

  // Derived parsed values
  const wNum = parseInput(width) || 0;
  const hNum = parseInput(height) || 0;
  const bNum = parseInput(bleed) || 0;
  const mNum = parseInput(margin) || 0;
  const dpiNum = parseInput(dpi) || 300;

  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    let matchedPreset: Preset = null;
    let matchedOrientation: Orientation = 'portrait';
    for (const [key, dims] of Object.entries(PRESETS)) {
      if (wNum === dims.width && hNum === dims.height) {
        matchedPreset = key as Preset;
        matchedOrientation = 'portrait';
        break;
      }
      if (wNum === dims.height && hNum === dims.width) {
        matchedPreset = key as Preset;
        matchedOrientation = 'landscape';
        break;
      }
    }
    setPreset(matchedPreset);
    if (matchedPreset) {
      setOrientation(matchedOrientation);
    }
  }, [wNum, hNum]);

  const handlePresetClick = (p: Preset) => {
    if (!p) return;
    const dims = PRESETS[p];
    if (orientation === 'portrait') {
      setWidth(dims.width.toString());
      setHeight(dims.height.toString());
    } else {
      setWidth(dims.height.toString());
      setHeight(dims.width.toString());
    }
    setPreset(p);
  };

  const handleOrientationToggle = (o: Orientation) => {
    if (o === orientation) return;
    setOrientation(o);
    setWidth(height);
    setHeight(width);
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (linked) {
      const parsedW = parseInput(val);
      if (parsedW !== null && ratio !== null) {
        setHeight(formatOutput(parsedW / ratio).replace(',', '.')); // temporary replace back for logic
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (linked) {
      const parsedH = parseInput(val);
      if (parsedH !== null && ratio !== null) {
        setWidth(formatOutput(parsedH * ratio).replace(',', '.')); // temporary replace back for logic
      }
    }
  };

  const toggleLink = () => {
    if (!linked && wNum > 0 && hNum > 0) {
      setRatio(wNum / hNum);
    }
    setLinked(!linked);
  };

  const { widthPx: netW, heightPx: netH } = calculateNet(wNum, hNum, dpiNum);
  const { widthPx: grossW, heightPx: grossH } = calculateGross(wNum, hNum, bNum, dpiNum);

  const copySingle = (val: number, type: CopiedState) => {
    const text = formatOutput(val);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState(type);
      setTimeout(() => setCopiedState(null), 2000);
    });
  };

  const handleCopyFigma = async (isNet = false) => {
    try {
      const bPx = isNet ? 0 : bNum * dpiNum / 25.4;
      const mPx = mNum * dpiNum / 25.4;
      const rawGrossW = (wNum + (isNet ? 0 : bNum * 2)) * dpiNum / 25.4;
      const rawGrossH = (hNum + (isNet ? 0 : bNum * 2)) * dpiNum / 25.4;

      const rawNetW = wNum * dpiNum / 25.4;
      const rawNetH = hNum * dpiNum / 25.4;

      let verticalGuides = [bPx, bPx + mPx, rawGrossW - (bPx + mPx), rawGrossW - bPx];
      let horizontalGuides = [bPx, bPx + mPx, rawGrossH - (bPx + mPx), rawGrossH - bPx];

      if (isNet) {
        verticalGuides = [mPx, rawGrossW - mPx];
        horizontalGuides = [mPx, rawGrossH - mPx];
      }

      const innerName = !preset
        ? `${formatOutput(wNum)}×${formatOutput(hNum)} ${t.mm}`
        : preset;
      const outerName = isNet ? innerName : `${innerName} ${t.with_bleeds} ${bleed} ${t.mm}`;

      const svg = createFigmaSvg({
        innerFrameName: isNet ? `${innerName} (Safe Area)` : innerName,
        outerFrameName: outerName,
        pageWidth: rawNetW,
        pageHeight: rawNetH,
        bleedPx: bPx,
        verticalGuides,
        horizontalGuides,
      });

      const clipboardData: Record<string, Blob> = {
        "text/plain": new Blob([svg], { type: "text/plain" }),
        "text/html": new Blob([svg], { type: "text/html" }),
      };

      // @ts-ignore
      if (window.ClipboardItem?.supports?.("image/svg+xml")) {
        clipboardData["image/svg+xml"] = new Blob([svg], {
          type: "image/svg+xml",
        });
      }

      await navigator.clipboard.write([
        // @ts-ignore
        new window.ClipboardItem(clipboardData),
      ]);

      if (isNet) {
        setFigmaCopiedNet(true);
      } else {
        setFigmaCopied(true);
      }
    } catch (error) {
      console.error(error);
      alert(t.clipboard_error);
    }
  };

  const safeW = wNum || 210;
  const safeH = hNum || 297;
  const bleedY = (bNum / safeH) * 100;
  const bleedX = (bNum / safeW) * 100;
  const marginY = (mNum / safeH) * 100;
  const marginX = (mNum / safeW) * 100;

  return (
    <div className="min-h-screen text-on-surface flex flex-col font-body-md md:text-body-md antialiased border-x border-outline-variant/30 w-full max-w-[1440px] mx-auto bg-background">
      {/* TopNavBar */}
      <header className="bg-surface top-0 border-b border-outline-variant/30 md:border-outline-variant/50 sticky z-50 flex justify-between items-center w-full px-md py-md md:px-margin md:py-md max-w-[1440px] mx-auto">
        {/* Universal Logo */}
        <div className="flex flex-col gap-1">
          <h1 className="text-display-sm font-bold text-primary leading-none tracking-tight">ММ → PX</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">{t.subtitle}</p>
        </div>

        {/* Language Switch */}
        <div className="flex items-center gap-xs md:gap-sm text-[12px] md:text-[14px] font-medium">
          <button 
            onClick={() => setLang('RU')}
            className={`${lang === 'RU' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
          >
            RU
          </button>
          <span className="text-outline-variant/50">/</span>
          <button 
            onClick={() => setLang('ENG')}
            className={`${lang === 'ENG' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
          >
            ENG
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:flex-grow w-full mx-auto p-md md:px-margin md:py-xl flex flex-col md:grid md:grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-xl max-w-[1440px]">
        {/* Left Column (Inputs & Results on Desktop) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-xl">
          
          {/* Step 1: Size & Orientation */}
          <section className="flex flex-col gap-[20px] md:gap-lg">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-xs">
              <h2 className="text-[10px] md:text-caption font-medium uppercase tracking-widest text-on-surface-variant">{t.step1}</h2>
            </div>

            <div className="flex flex-col gap-md md:gap-lg mt-0 md:mt-0">
              {/* Presets */}
              <div className="grid grid-cols-5 md:flex md:flex-wrap gap-sm">
                {(['A5', 'A4', 'A3', 'A2', 'A1'] as Preset[]).map((p) => {
                  const isSelected = preset === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePresetClick(p)}
                      className={`flex-1 min-w-[60px] px-xs md:px-md py-sm bg-surface border text-center rounded transition-all text-[14px] md:text-label-mono
                        ${isSelected 
                          ? 'border-secondary text-secondary font-bold shadow-sm md:shadow-none' 
                          : 'border-outline-variant md:border-outline-variant/50 text-on-surface-variant font-medium hover:border-primary hover:text-primary'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Orientation */}
              <div className="flex items-center bg-surface-container-low p-[4px] md:p-xs h-[46px] md:h-auto rounded border border-outline-variant/50 md:border-outline-variant/30 w-full mt-xs md:mt-0">
                <button
                  onClick={() => handleOrientationToggle('portrait')}
                  className={`flex-1 px-md h-[36px] md:h-auto flex items-center justify-center md:py-sm text-[14px] md:text-label-mono transition-all rounded-[2px]
                    ${orientation === 'portrait' 
                      ? 'bg-surface shadow-sm text-secondary font-bold' 
                      : 'text-on-surface-variant font-medium hover:text-primary'
                    }`}
                >
                  {t.portrait}
                </button>
                <button
                  onClick={() => handleOrientationToggle('landscape')}
                  className={`flex-1 px-md h-[36px] md:h-auto flex items-center justify-center md:py-sm text-[14px] md:text-label-mono transition-all rounded-[2px]
                    ${orientation === 'landscape' 
                      ? 'bg-surface shadow-sm text-secondary font-bold' 
                      : 'text-on-surface-variant font-medium hover:text-primary'
                    }`}
                >
                  {t.landscape}
                </button>
              </div>

              {/* Link Icon */}
              <div className="flex justify-center -mb-3 md:-mb-4 z-20 relative">
                <button 
                  onClick={toggleLink} 
                  className="bg-surface px-3 py-1 md:py-0.5 rounded-full border border-outline-variant/50 flex items-center justify-center shadow-sm cursor-pointer hover:bg-surface-variant/30 transition-colors"
                >
                  <span className={`material-symbols-outlined text-[16px] md:text-[18px] ${linked ? 'text-secondary' : 'text-outline-variant hover:text-primary'}`}>
                    {linked ? 'link' : 'link_off'}
                  </span>
                </button>
              </div>

              {/* Dimensions Inputs */}
              <div className="grid grid-cols-2 gap-md md:gap-lg mt-xs md:mt-0">
                <Input label={t.width} unit={t.mm} value={width} onChange={handleWidthChange} />
                <Input label={t.height} unit={t.mm} value={height} onChange={handleHeightChange} />
              </div>
            </div>
          </section>

          {/* Step 2: Bleed & Margins */}
          <section className="flex flex-col gap-[20px] md:mt-4">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-xs">
              <h2 className="text-[10px] md:text-caption font-medium uppercase tracking-widest text-on-surface-variant">{t.step2}</h2>
            </div>

            <div className="grid grid-cols-2 gap-sm mt-0">
              <Input label={t.bleeds} unit={t.mm} value={bleed} onChange={setBleed} />
              <Input label={t.margins} unit={t.mm} value={margin} onChange={setMargin} />
            </div>
          </section>

          {/* Step 3: Resolution */}
          <section className="flex flex-col gap-md md:gap-lg md:mt-4">
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-xs">
              <h2 className="text-[10px] md:text-caption font-medium uppercase tracking-widest text-on-surface-variant">{t.step3}</h2>
            </div>

            <div className="flex flex-col gap-md mt-xs md:mt-0">
              <div className="grid grid-cols-5 md:flex md:flex-wrap gap-sm">
                {['72', '96', '150', '300', '600'].map((val) => {
                  const isSelected = dpi === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setDpi(val)}
                      className={`flex-1 min-w-[50px] px-xs md:px-sm py-sm bg-surface border text-center rounded transition-all text-[14px] md:text-label-mono
                        ${isSelected
                          ? 'border-secondary text-secondary font-bold'
                          : 'border-outline-variant md:border-outline-variant/50 text-on-surface-variant font-medium hover:border-primary hover:text-primary'
                        }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              <div className="mt-0">
                <Input label={t.dpi} unit={t.dpi.toLowerCase()} value={dpi} onChange={setDpi} />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Preview) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col z-10 mt-0 lg:h-0 lg:min-h-full min-h-0">
          <section className="flex-1 w-full flex flex-col items-center py-md md:py-xl bg-surface-container-low border border-outline-variant/30 rounded min-h-0">
            
            <div className="flex-1 flex items-center justify-center min-h-0 w-full py-md">
              <div className="w-full h-full max-w-[260px] max-h-[260px] md:max-w-[360px] md:max-h-[360px] aspect-square flex items-center justify-center relative shrink min-h-0">
                <div 
                  className="relative bg-surface flex flex-col justify-center items-center border border-outline-variant md:border-outline-variant/20 shadow-sm" 
                  style={{ 
                    aspectRatio: `${wNum || 210} / ${hNum || 297}`,
                    width: wNum >= hNum ? '100%' : 'auto',
                    height: hNum > wNum ? '100%' : 'auto',
                  }}
                >
                {/* Bleed Area */}
                <div className="absolute border border-error/40 border-dashed pointer-events-none" style={{ inset: `-${bleedY}% -${bleedX}%` }}></div>
                {/* Margin Area */}
                <div className="absolute border border-secondary/30 border-dashed pointer-events-none" style={{ inset: `${marginY}% ${marginX}%` }}></div>
                
                <div className="md:hidden text-center flex flex-col gap-0 z-10 pointer-events-none select-none text-outline/60">
                  <span className="text-[10px] font-bold">{preset || `${width} × ${height} ${t.mm}`}</span>
                  <span className="text-[8px] uppercase tracking-tighter">{orientation === 'portrait' ? t.portrait : t.landscape}</span>
                </div>
                
                <div className="hidden md:block text-headline-lg font-bold text-outline-variant/40 select-none text-center">
                  {preset || (
                    <span className="text-headline-md">{width} × {height} <span className="text-body-md uppercase">{t.mm}</span></span>
                  )}
                </div>

              </div>
            </div>
          </div>
            
          <div className="mt-auto pt-md flex gap-lg text-[11px] md:text-label-mono uppercase text-on-surface-variant font-bold md:font-medium tracking-[0.1em] md:tracking-normal shrink-0">
              <div className="flex items-center gap-xs">
                <span className="w-4 h-0 border-t border-dashed border-error/60"></span>
                <span>{t.bleeds_preview}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-4 h-0 border-t border-dashed border-secondary/60"></span>
                <span>{t.margins_preview}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Step 4: Results Block */}
        <section className="lg:col-span-12 flex flex-col px-md py-[32px] md:px-xl md:pt-xl md:pb-0 bg-surface-container-lowest border border-outline-variant/30 md:border-outline-variant/20 items-center md:text-center rounded mt-0 w-full justify-center">
          <div className="relative text-center w-full">
            <div className="flex flex-col w-full items-center">
              {/* NET (MOVED FIRST) */}
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-xs md:gap-sm items-center w-full">
                  <h3 className="text-[10px] md:text-caption font-medium uppercase tracking-widest text-on-surface-variant">{t.format_cropbox}</h3>
                  <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3">
                  
                  {/* Net Width */}
                  <button
                    onClick={() => copySingle(netW, 'netW')}
                    className="relative group px-3 py-1 bg-surface-variant/20 hover:bg-surface-variant/40 rounded-lg transition-colors cursor-pointer"
                    title={t.copy_w}
                  >
                    <span className="text-[20px] md:text-headline-lg font-bold text-primary/80 group-hover:text-secondary font-data-lg tracking-tight md:leading-none tabular-nums transition-colors">
                      {formatOutput(netW)}
                    </span>
                    <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-surface text-secondary text-[10px] px-2 py-1 shadow-md border border-outline-variant/30 rounded font-bold whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${copiedState === 'netW' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      {t.copied}
                    </span>
                  </button>

                  <span className="text-[20px] md:text-headline-lg font-bold text-outline-variant/40 font-data-lg tracking-tight md:leading-none tabular-nums">
                    ×
                  </span>

                  {/* Net Height */}
                  <button
                    onClick={() => copySingle(netH, 'netH')}
                    className="relative group px-3 py-1 bg-surface-variant/20 hover:bg-surface-variant/40 rounded-lg transition-colors cursor-pointer"
                    title={t.copy_h}
                  >
                    <span className="text-[20px] md:text-headline-lg font-bold text-primary/80 group-hover:text-secondary font-data-lg tracking-tight md:leading-none tabular-nums transition-colors">
                      {formatOutput(netH)}
                    </span>
                    <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-surface text-secondary text-[10px] px-2 py-1 shadow-md border border-outline-variant/30 rounded font-bold whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${copiedState === 'netH' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      {t.copied}
                    </span>
                  </button>

                  <span className="text-[14px] md:text-label-mono font-medium text-outline font-bold ml-1">{t.px}</span>
                </div>
                </div>

                {/* Net Figma Button */}
                <div className="w-full md:w-auto flex justify-center mt-2 md:mt-[12px] relative">
                  <button
                    onClick={() => handleCopyFigma(true)}
                    className="relative group flex items-center justify-center text-[13px] md:text-[14px] text-on-surface-variant/80 font-medium hover:text-on-surface transition-colors underline decoration-on-surface-variant/30 hover:decoration-on-surface/50 underline-offset-4"
                  >
                    <span>{t.copy_figma_net}</span>
                    <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-surface text-secondary text-[10px] px-2 py-1 shadow-md border border-outline-variant/30 rounded font-bold whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${figmaCopiedNet ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      {t.copied}
                    </span>
                  </button>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30 w-1/2 mx-auto my-[32px] md:my-[40px]"></div>

              {/* GROSS */}
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-[10px] md:text-caption font-medium uppercase tracking-widest text-on-surface-variant mb-2">{t.format_bleedbox}</h3>
                  <div className="flex flex-col items-stretch w-full md:w-max">
                    <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3">
                  
                  {/* Gross Width */}
                  <button
                    onClick={() => copySingle(grossW, 'grossW')}
                    className="relative group px-3 py-1 bg-surface-variant/20 hover:bg-surface-variant/40 rounded-lg transition-colors cursor-pointer"
                    title={t.copy_w}
                  >
                    <span className="text-[28px] md:text-display-lg font-bold text-primary group-hover:text-secondary font-data-lg tracking-tighter md:leading-none tabular-nums transition-colors">
                      {formatOutput(grossW)}
                    </span>
                    <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-surface text-secondary text-[10px] px-2 py-1 shadow-md border border-outline-variant/30 rounded font-bold whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${copiedState === 'grossW' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      {t.copied}
                    </span>
                  </button>

                  <span className="text-[28px] md:text-display-lg font-bold text-outline-variant/50 font-data-lg tracking-tighter md:leading-none tabular-nums">
                    ×
                  </span>

                  {/* Gross Height */}
                  <button
                    onClick={() => copySingle(grossH, 'grossH')}
                    className="relative group px-3 py-1 bg-surface-variant/20 hover:bg-surface-variant/40 rounded-lg transition-colors cursor-pointer"
                    title={t.copy_h}
                  >
                    <span className="text-[28px] md:text-display-lg font-bold text-primary group-hover:text-secondary font-data-lg tracking-tighter md:leading-none tabular-nums transition-colors">
                      {formatOutput(grossH)}
                    </span>
                    <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-surface text-secondary text-[10px] px-2 py-1 shadow-md border border-outline-variant/30 rounded font-bold whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${copiedState === 'grossH' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                      {t.copied}
                    </span>
                  </button>

                  <span className="text-[14px] md:text-label-mono font-medium text-outline font-bold ml-1">{t.px}</span>
                    </div>

                    {/* Figma Button */}
                    <div className="w-full flex justify-center md:flex-col md:items-stretch mb-0 md:mb-xl mt-[24px] relative">
                      <button
                        onClick={() => handleCopyFigma(false)}
                        className="relative group flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-medium px-3 py-2 md:py-3 rounded-lg transition-colors w-full"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        <span>{t.copy_figma}</span>
                      </button>

                      <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-surface text-secondary border border-outline-variant/30 px-3 py-2 md:px-4 md:py-3 shadow-xl rounded-lg text-center w-full z-50 transition-all duration-300 pointer-events-none ${figmaCopied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <div className="font-bold text-[10px] mb-1.5 uppercase tracking-wide">
                          {t.copied}
                        </div>
                        <div className="text-[13px] md:text-[14px] font-medium text-on-surface opacity-90 leading-snug">
                          {t.figma_hint1} <br/>
                          {t.figma_hint2}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant md:border-outline-variant/50 flex justify-between items-center w-full px-md md:px-margin py-lg mt-xl md:mt-auto relative z-20">
        <div className="flex items-center gap-sm md:gap-md">
          <span className="text-[12px] md:text-body-md text-on-surface-variant font-normal">© {new Date().getFullYear()} ММ → PX.</span>
          <a className="text-[12px] md:text-body-md text-on-surface-variant hover:text-secondary transition-colors font-normal" href="https://github.com/tenebrius-dev/MM-to-PX-Calculator" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        
        <div>
          <button className="text-[12px] md:text-body-md text-on-surface-variant hover:text-secondary transition-colors font-normal">{t.info}</button>
        </div>
      </footer>
    </div>
  );
}
