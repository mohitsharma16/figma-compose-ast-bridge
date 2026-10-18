import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FigmaNodeRenderer } from "./FigmaNodeRenderer";

/******************************************************************************
 * 5. CONSTANT-SIZE HARDWARE DEVICE STAGE (MOBILE / TABLET / DESKTOP)
 *    Irrespective of design size or whether the editor is blank, each device
 *    frame keeps its exact constant width & height and never stretches.
 ******************************************************************************/
export const DEVICE_PROFILES = {
  mobile: {
    label: 'Mobile',
    width: 380,
    height: 700,
    badge: '380 × 700 dp (Constant Mobile Frame)'
  },
  tablet: {
    label: 'Tablet',
    width: 760,
    height: 550,
    badge: '760 × 550 dp (Constant Tablet Frame)'
  },
  desktop: {
    label: 'Desktop',
    width: 960,
    height: 580,
    badge: '960 × 580 dp (Constant Desktop Window)'
  }
};

export function EmptyStarterState({ onLoadStandard, onSelectPreset }) {
  return (
    <div className="h-full w-full flex flex-col justify-between p-5 bg-white border border-zinc-200 rounded-2xl text-zinc-900">
      <div className="space-y-3">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
          Standard Starter View • Constant Viewport
        </span>
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
          No @Composable Code Written Yet
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed">
          This device viewport remains locked to its exact hardware dimensions even when the editor is blank. Start typing a <span className="font-mono text-zinc-900 font-semibold">@Composable</span> function on the left, or load a standard template below:
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            onClick={onLoadStandard}
            className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold">Load Standard Starter @Composable</div>
              <div className="text-[11px] text-zinc-300">Clean starter card with header, body card, and primary button</div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={() => onSelectPreset('fintech')}
            className="w-full text-left p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 transition flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold">Mobile — Minimalist Private Wealth Card</div>
              <div className="text-[11px] text-zinc-500">Portfolio balance, yield rows, and wire transfer CTA</div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>

          <button
            onClick={() => onSelectPreset('ecommerce')}
            className="w-full text-left p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 transition flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold">Mobile — Editorial Studio Hardware Card</div>
              <div className="text-[11px] text-zinc-500">Product showcase, price row, and reservation button</div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>Kotlin PSI / AST Engine Ready</span>
        <span>100% Fixed Aspect Frame</span>
      </div>
    </div>
  );
}

export function DeviceStage({
  deviceType,
  isLandscape,
  zoom,
  figmaRoot,
  isEmptySource,
  selectedFigmaId,
  onSelectNode,
  showGuides,
  onLoadStandard,
  onSelectPreset
}) {
  const profile = DEVICE_PROFILES[deviceType] || DEVICE_PROFILES.mobile;
  const frameWidth = isLandscape ? profile.height : profile.width;
  const frameHeight = isLandscape ? profile.width : profile.height;

  const fixedBoxStyle = {
    width: `${frameWidth}px`,
    minWidth: `${frameWidth}px`,
    maxWidth: `${frameWidth}px`,
    height: `${frameHeight}px`,
    minHeight: `${frameHeight}px`,
    maxHeight: `${frameHeight}px`,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    transition: 'transform 160ms ease, width 160ms ease, height 160ms ease'
  };

  const screenContent = isEmptySource || !figmaRoot ? (
    <EmptyStarterState onLoadStandard={onLoadStandard} onSelectPreset={onSelectPreset} />
  ) : (
    <FigmaNodeRenderer
      node={figmaRoot}
      selectedId={selectedFigmaId}
      onSelect={onSelectNode}
      showGuides={showGuides}
      deviceType={deviceType}
      isLandscape={isLandscape}
    />
  );

  return (
    <div id="1:1" className="w-full h-full flex flex-col items-center justify-start overflow-auto p-6 select-none">
      {/* Hardware Frame Wrapper with Strictly Constant Width & Height */}
      {deviceType === 'desktop' ? (
        <div
          style={fixedBoxStyle}
          className="shrink-0 rounded-2xl border border-zinc-300 bg-white shadow-xl flex flex-col overflow-hidden"
        >
          {/* Minimalist macOS-Style Window Header */}
          <div className="h-9 shrink-0 bg-zinc-100 border-b border-zinc-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="ml-2 text-xs text-zinc-600 font-mono">
                {figmaRoot?.name || 'StandardStarterScreen'} — Desktop Viewport
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              {frameWidth} × {frameHeight} dp
            </span>
          </div>
          {/* Fixed Scrollable Screen Area */}
          <div className="flex-1 w-full bg-zinc-50/70 text-zinc-900 p-6 overflow-y-auto overflow-x-hidden box-border">
            {screenContent}
          </div>
        </div>
      ) : deviceType === 'tablet' ? (
        <div
          style={fixedBoxStyle}
          className="shrink-0 rounded-[28px] border-[10px] border-zinc-900 bg-zinc-900 shadow-xl flex flex-col overflow-hidden"
        >
          <div className="h-6 shrink-0 bg-zinc-900 px-5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>9:41 AM • Tablet</span>
            <span className="w-10 h-1 rounded-full bg-zinc-700" />
            <span>{frameWidth} × {frameHeight} dp</span>
          </div>
          <div className="flex-1 w-full bg-zinc-50 text-zinc-900 p-5 rounded-t-[18px] overflow-y-auto overflow-x-hidden box-border">
            {screenContent}
          </div>
        </div>
      ) : (
        <div
          style={fixedBoxStyle}
          className="shrink-0 rounded-[40px] border-[11px] border-zinc-900 bg-zinc-900 shadow-xl flex flex-col overflow-hidden"
        >
          {/* Phone Status Bar */}
          <div className="h-8 shrink-0 bg-zinc-900 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-300">
            <span>9:41</span>
            <span className="w-20 h-3.5 rounded-full bg-zinc-950 border border-zinc-800" />
            <span>5G 100%</span>
          </div>
          {/* Strictly Sized Phone Inner Screen — Never stretches sideways */}
          <div className="flex-1 w-full bg-zinc-50 text-zinc-900 p-4 rounded-t-[24px] overflow-y-auto overflow-x-hidden box-border">
            {screenContent}
          </div>
          {/* Home Indicator Bar */}
          <div className="h-6 shrink-0 bg-zinc-50 rounded-b-[24px] flex items-center justify-center">
            <div className="w-28 h-1 rounded-full bg-zinc-300" />
          </div>
        </div>
      )}
    </div>
  );
}

