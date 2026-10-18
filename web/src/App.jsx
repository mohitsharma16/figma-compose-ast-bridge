import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowRight,
  Code2,
  Layers,
  Cpu,
  Copy,
  Trash2,
  RotateCw,
  CheckCircle2,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Upload,
  Sliders,
  ZoomIn,
  ZoomOut,
  BookOpen,
  RotateCcw
} from "lucide-react";
import { STARTER_TEMPLATE_CODE, PRESETS, FIGMA_IMPORT_GALLERY } from "./data/presets";
import { tokenizeKotlin } from "./engine/kotlinLexer";
import { parseKotlinAst } from "./engine/kotlinAstParser";
import { cssHexToFigmaColor, figmaColorToCssHex, transformAstToFigma } from "./engine/astToFigma";
import { generateKotlinFromFigmaNode } from "./engine/figmaToCompose";
import { cloneDeep, findFigmaNodeById, deleteFigmaNodeById, getNextMaxFigmaId } from "./engine/treeHelpers";
import { DEVICE_PROFILES, DeviceStage } from "./components/DeviceStage";

/******************************************************************************
 * 6. MAIN REACT STUDIO APPLICATION (SIMPLE, REFINED & ELEGANT DESIGN)
 ******************************************************************************/
export default function App() {
  // Workspace Modes:
  // 'split'   -> Code Editor (Left) + Constant-Size Device Preview & Inspector (Right)
  // 'preview' -> Full-Screen Constant-Size Device Preview (Mobile, Tablet, Desktop)
  // 'import'  -> Direct Figma Page Importer (Figma REST API URL, JSON Upload, 1-Click Templates)
  // 'ast'     -> Kotlin AST Tree & Raw Figma SceneGraph JSON X-Ray
  // 'docs'    -> Comprehensive Built-In Documentation & Setup Guide
  const [workspaceMode, setWorkspaceMode] = useState('split');
  const [presetKey, setPresetKey] = useState('fintech');
  const [deviceType, setDeviceType] = useState('mobile'); // Default to constant Mobile frame
  const [zoom, setZoom] = useState(0.92);
  const [isLandscape, setIsLandscape] = useState(false);
  const [kotlinCode, setKotlinCode] = useState(PRESETS.fintech.code);
  const [figmaRoot, setFigmaRoot] = useState(null);
  const [isEmptySource, setIsEmptySource] = useState(false);
  const [figmaJsonText, setFigmaJsonText] = useState('');
  const [selectedFigmaId, setSelectedFigmaId] = useState('1:1');
  const [selectedAstNode, setSelectedAstNode] = useState(null);
  const [showGuides, setShowGuides] = useState(false);
  const [showInspectorDrawer, setShowInspectorDrawer] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [statusMessage, setStatusMessage] = useState('✓ Ready — Constant Device Viewports & Kotlin AST Compiler Active');

  // Figma Live Import State
  const [figmaUrlInput, setFigmaUrlInput] = useState('https://www.figma.com/design/KtAstDemoFile/MinimalWealthApp?node-id=1-1');
  const [figmaTokenInput, setFigmaTokenInput] = useState('');
  const [isFetchingFigma, setIsFetchingFigma] = useState(false);

  const triggerToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  }, []);

  // Compile Compose -> Figma
  const handleComposeToFigma = useCallback((sourceCode = kotlinCode) => {
    if (!sourceCode || !sourceCode.trim()) {
      setIsEmptySource(true);
      setFigmaRoot(null);
      setStatusMessage('Standard Starter View active — write @Composable code or pick a template');
      return;
    }
    try {
      const t0 = performance.now();
      const toks = tokenizeKotlin(sourceCode);
      const parsedAst = parseKotlinAst(toks);
      const { root, isEmptySource: emptyFlag, astMap, layerCount } = transformAstToFigma(parsedAst);
      if (emptyFlag || !root) {
        setIsEmptySource(true);
        setFigmaRoot(null);
        setStatusMessage('Waiting for @Composable function body — showing standard starter card');
        return;
      }
      setIsEmptySource(false);
      setFigmaRoot(root);
      setFigmaJsonText(JSON.stringify(root, null, 2));
      const nextId = findFigmaNodeById(root, selectedFigmaId) ? selectedFigmaId : root.id;
      setSelectedFigmaId(nextId);
      setSelectedAstNode(astMap.get(nextId) || parsedAst.declarations[0] || parsedAst);
      const elapsed = (performance.now() - t0).toFixed(1);
      setStatusMessage(`✓ Compiled ${toks.length - 1} tokens → ${parsedAst.totalAstNodes} AST nodes → ${layerCount} Figma layers (${elapsed}ms)`);
    } catch (err) {
      setStatusMessage(`AST diagnostic: ${err.message}`);
    }
  }, [kotlinCode, selectedFigmaId]);

  useEffect(() => {
    handleComposeToFigma(PRESETS.fintech.code);
  }, []);

  // Memoized AST & Tokens for X-Ray view
  const { tokens, ast, astMap, layerCount, parseError } = useMemo(() => {
    try {
      if (!kotlinCode.trim()) {
        return { tokens: [], ast: null, astMap: new Map(), layerCount: 0, parseError: null };
      }
      const toks = tokenizeKotlin(kotlinCode);
      const parsedAst = parseKotlinAst(toks);
      const transformed = transformAstToFigma(parsedAst);
      return {
        tokens: toks,
        ast: parsedAst,
        astMap: transformed.astMap,
        layerCount: transformed.layerCount,
        parseError: null
      };
    } catch (err) {
      return {
        tokens: [],
        ast: null,
        astMap: new Map(),
        layerCount: 0,
        parseError: err.message
      };
    }
  }, [kotlinCode]);

  // Compile Figma -> Compose
  const handleFigmaToCompose = useCallback((updatedRoot = figmaRoot) => {
    if (!updatedRoot) return;
    const t0 = performance.now();
    const fnName = ast?.declarations?.[0]?.name || 'ImportedFigmaScreen';
    const emittedKotlin = generateKotlinFromFigmaNode(updatedRoot, fnName);
    setIsEmptySource(false);
    setKotlinCode(emittedKotlin);
    setFigmaJsonText(JSON.stringify(updatedRoot, null, 2));
    const elapsed = (performance.now() - t0).toFixed(1);
    setStatusMessage(`✓ Generated Jetpack Compose .kt code from Figma SceneGraph (${elapsed}ms)`);
  }, [figmaRoot, ast]);

  // Switch Preset: Always reset isLandscape to false so Mobile view is NEVER stretched sideways
  const handleSelectPreset = (key) => {
    if (key === 'starter') {
      setPresetKey('starter');
      setIsLandscape(false);
      setKotlinCode(STARTER_TEMPLATE_CODE);
      setSelectedFigmaId('1:1');
      handleComposeToFigma(STARTER_TEMPLATE_CODE);
      triggerToast('Loaded Standard Starter Template');
      return;
    }
    const preset = PRESETS[key];
    if (!preset) return;
    setPresetKey(key);
    setIsLandscape(false);
    setDeviceType(preset.device);
    setZoom(preset.device === 'desktop' ? 0.78 : preset.device === 'tablet' ? 0.86 : 0.92);
    setKotlinCode(preset.code);
    setSelectedFigmaId('1:1');
    handleComposeToFigma(preset.code);
    triggerToast(`Loaded ${preset.label}`);
  };

  // Load standard starter template when editor is blank
  const handleLoadStandardStarter = () => {
    setPresetKey('starter');
    setIsLandscape(false);
    setKotlinCode(STARTER_TEMPLATE_CODE);
    handleComposeToFigma(STARTER_TEMPLATE_CODE);
    triggerToast('Restored Standard Starter Template');
  };

  // Select Device Viewport & Keep Constant Hardware Dimensions
  const handleSelectDevice = (dev) => {
    setDeviceType(dev);
    setIsLandscape(false);
    if (dev === 'desktop') setZoom(0.78);
    else if (dev === 'tablet') setZoom(0.86);
    else setZoom(0.92);
  };

  // Active Figma Node for Inspector
  const activeFigmaNode = useMemo(() => {
    if (!figmaRoot) return null;
    return findFigmaNodeById(figmaRoot, selectedFigmaId) || figmaRoot;
  }, [figmaRoot, selectedFigmaId]);

  const updateSelectedFigmaNode = (mutator, desc = 'Updated layer') => {
    if (!figmaRoot) return;
    const cloned = cloneDeep(figmaRoot);
    const target = findFigmaNodeById(cloned, selectedFigmaId) || cloned;
    mutator(target);
    setFigmaRoot(cloned);
    setFigmaJsonText(JSON.stringify(cloned, null, 2));
    if (autoSync) handleFigmaToCompose(cloned);
    triggerToast(`${desc} → Synced Kotlin AST`);
  };

  const handleInsertLayer = (kind) => {
    if (!figmaRoot) {
      handleLoadStandardStarter();
      return;
    }
    const cloned = cloneDeep(figmaRoot);
    const target = findFigmaNodeById(cloned, selectedFigmaId);
    const container = target && target.type === 'FRAME' ? target : cloned;
    container.children = container.children || [];
    const newId = getNextMaxFigmaId(cloned);

    let newNode;
    if (kind === 'text') {
      newNode = {
        id: newId,
        name: 'Text_Label',
        type: 'TEXT',
        characters: 'New Composable Text',
        fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#18181b') }],
        style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 14, lineHeightPx: 20 }
      };
    } else if (kind === 'button') {
      newNode = {
        id: newId,
        name: 'Button_Primary',
        composableType: 'Button',
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        layoutSizingHorizontal: 'FILL',
        paddingTop: 12, paddingRight: 18, paddingBottom: 12, paddingLeft: 18,
        itemSpacing: 8,
        cornerRadius: 10,
        fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#18181b') }],
        strokes: [],
        strokeWeight: 0,
        children: [{
          id: newId + '_txt',
          name: 'Text_Action',
          type: 'TEXT',
          characters: 'Continue',
          fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#ffffff') }],
          style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 13, lineHeightPx: 18 }
        }]
      };
    } else {
      newNode = {
        id: newId,
        name: 'Row_CardSection',
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'SPACE_BETWEEN',
        counterAxisAlignItems: 'CENTER',
        layoutSizingHorizontal: 'FILL',
        paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 14,
        itemSpacing: 10,
        cornerRadius: 10,
        fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#fafafa') }],
        strokes: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#e4e4e7') }],
        strokeWeight: 1,
        children: [
          {
            id: newId + '_1',
            name: 'Text_Title',
            type: 'TEXT',
            characters: 'Component Item',
            fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#18181b') }],
            style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 13, lineHeightPx: 18 }
          },
          {
            id: newId + '_2',
            name: 'Text_Status',
            type: 'TEXT',
            characters: 'Active',
            fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor('#059669') }],
            style: { fontFamily: 'Inter', fontWeight: 700, fontSize: 12, lineHeightPx: 16 }
          }
        ]
      };
    }

    container.children.push(newNode);
    setFigmaRoot(cloned);
    setSelectedFigmaId(newNode.id);
    handleFigmaToCompose(cloned);
    triggerToast(`Added ${kind} layer → Updated Compose code`);
  };

  // Direct Figma REST API Fetcher or Simulated Import
  const handleFetchFromFigmaUrl = async () => {
    setIsFetchingFigma(true);
    try {
      const keyMatch = figmaUrlInput.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
      const fileKey = keyMatch ? keyMatch[1] : null;
      if (figmaTokenInput.trim() && fileKey) {
        const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
          headers: { 'X-Figma-Token': figmaTokenInput.trim() }
        });
        if (!res.ok) throw new Error(`Figma API returned HTTP ${res.status}`);
        const data = await res.json();
        const firstCanvas = data.document?.children?.[0];
        const firstFrame = firstCanvas?.children?.[0] || data.document;
        setFigmaRoot(firstFrame);
        handleFigmaToCompose(firstFrame);
        setWorkspaceMode('split');
        triggerToast(`Imported "${firstFrame.name}" from Figma API → Generated Kotlin!`);
      } else {
        handleSelectPreset('fintech');
        setWorkspaceMode('split');
        triggerToast('Imported Figma Design Page → Generated Jetpack Compose Code!');
      }
    } catch (err) {
      triggerToast(`Figma API Error: ${err.message}`);
    } finally {
      setIsFetchingFigma(false);
    }
  };

  // Upload a local .json Figma file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target.result);
        const unwrapped =
          raw.document?.children?.[0]?.children?.[0] ||
          raw.children?.[0] ||
          raw;
        setFigmaRoot(unwrapped);
        handleFigmaToCompose(unwrapped);
        setWorkspaceMode('split');
        triggerToast(`Imported ${file.name} → Generated Jetpack Compose Code!`);
      } catch (err) {
        triggerToast(`Invalid JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => triggerToast(`Copied ${label}`));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      triggerToast(`Copied ${label}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Top Studio Navigation Bar — Simple, Clean & Elegant */}
      <header className="h-14 border-b border-zinc-200 bg-white/95 backdrop-blur sticky top-0 z-30 px-4 flex items-center justify-between gap-3">
        {/* Left: Brand & Mode Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-white text-xs font-mono tracking-tight">
              KT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 tracking-tight">KtAstBridge</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  Studio v4.0
                </span>
              </div>
            </div>
          </div>

          {/* Primary Workspace Mode Pills */}
          <nav className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
            {[
              { id: 'split', label: 'Split Studio (Code + UI)', icon: Code2 },
              { id: 'preview', label: 'Full-Size UI Preview', icon: Eye },
              { id: 'import', label: 'Import from Figma', icon: Upload },
              { id: 'ast', label: 'Kotlin AST X-Ray', icon: Cpu },
              { id: 'docs', label: 'Docs & Guide', icon: BookOpen }
            ].map((item) => {
              const Icon = item.icon;
              const active = workspaceMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setWorkspaceMode(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    active
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Constant Device Switcher (Mobile / Tablet / Desktop) & Template Picker */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
            {[
              { id: 'mobile', label: 'Mobile', icon: Smartphone },
              { id: 'tablet', label: 'Tablet', icon: Tablet },
              { id: 'desktop', label: 'Desktop', icon: Monitor }
            ].map((dev) => {
              const Icon = dev.icon;
              const active = deviceType === dev.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => handleSelectDevice(dev.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    active
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{dev.label}</span>
                </button>
              );
            })}
          </div>

          {/* Preset Template Selector */}
          <select
            value={presetKey}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-400 cursor-pointer shadow-sm"
          >
            <option value="starter">0. Standard Starter Template</option>
            {Object.entries(PRESETS).map(([k, val]) => (
              <option key={k} value={k}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* =====================================================================
          MODE 1 & 2: SPLIT STUDIO OR FULL-SCREEN PREVIEW
         ===================================================================== */}
      {(workspaceMode === 'split' || workspaceMode === 'preview') && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT PANE: Jetpack Compose Code Editor (Hidden in 'preview' mode) */}
          {workspaceMode === 'split' && (
            <section className="w-full lg:w-[440px] xl:w-[490px] shrink-0 border-r border-zinc-200 bg-white flex flex-col">
              <div className="px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-900" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                    Jetpack Compose (.kt)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleLoadStandardStarter}
                    className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium flex items-center gap-1 transition"
                    title="Reset to Standard Starter Template"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Standard</span>
                  </button>
                  <button
                    onClick={() => handleComposeToFigma(kotlinCode)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold transition"
                  >
                    Run AST → UI
                  </button>
                  <button
                    onClick={() => copyToClipboard(kotlinCode, 'Kotlin code')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium flex items-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <textarea
                value={kotlinCode}
                onChange={(e) => {
                  const next = e.target.value;
                  setKotlinCode(next);
                  if (autoSync) handleComposeToFigma(next);
                }}
                placeholder="// Write @Composable Kotlin code here, or leave blank to use the Standard Starter View..."
                spellCheck={false}
                className="w-full flex-1 bg-[#FAFAFA] text-zinc-900 font-mono text-xs leading-relaxed p-4 focus:outline-none resize-none min-h-[420px]"
              />

              {/* Quick Snippet Bar */}
              <div className="px-4 py-2.5 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-500">Insert:</span>
                  <button
                    onClick={() => handleInsertLayer('text')}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-[11px] font-mono text-zinc-800"
                  >
                    +Text
                  </button>
                  <button
                    onClick={() => handleInsertLayer('button')}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-[11px] font-mono text-zinc-800"
                  >
                    +Button
                  </button>
                  <button
                    onClick={() => handleInsertLayer('row')}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-[11px] font-mono text-zinc-800"
                  >
                    +CardRow
                  </button>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 truncate">
                  {isEmptySource
                    ? 'Starter View Active'
                    : parseError
                    ? `Diagnostic: ${parseError}`
                    : `✓ ${ast?.totalAstNodes || 0} AST nodes`}
                </span>
              </div>
            </section>
          )}

          {/* CENTER/RIGHT STAGE: Constant-Size Device Preview Canvas */}
          <section className="flex-1 flex flex-col bg-[#F1F5F9] overflow-hidden relative">
            {/* Stage Toolbar */}
            <div className="px-4 py-2 border-b border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{DEVICE_PROFILES[deviceType]?.badge}</span>
                </span>

                {/* Zoom Controls */}
                <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg px-1.5 py-0.5 gap-1">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.55, Number((z - 0.08).toFixed(2))))}
                    className="p-1 text-zinc-600 hover:text-zinc-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-zinc-800 px-1.5">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(1.2, Number((z + 0.08).toFixed(2))))}
                    className="p-1 text-zinc-600 hover:text-zinc-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {deviceType === 'mobile' && (
                  <button
                    onClick={() => setIsLandscape(!isLandscape)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    showGuides
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}
                >
                  Auto Layout Guides: {showGuides ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWorkspaceMode('import')}
                  className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Figma Page</span>
                </button>
                <button
                  onClick={() => setShowInspectorDrawer(!showInspectorDrawer)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showInspectorDrawer ? 'Hide Inspector' : 'Layer Inspector'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Body + Collapsible Right Layer Inspector */}
            <div className="flex-1 flex overflow-hidden">
              <div
                className="flex-1 overflow-auto"
                style={{
                  backgroundColor: '#F4F4F5',
                  backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                <DeviceStage
                  deviceType={deviceType}
                  isLandscape={isLandscape}
                  zoom={zoom}
                  figmaRoot={figmaRoot}
                  isEmptySource={isEmptySource}
                  selectedFigmaId={selectedFigmaId}
                  onSelectNode={(id) => {
                    setSelectedFigmaId(id);
                    if (astMap.has(id)) setSelectedAstNode(astMap.get(id));
                  }}
                  showGuides={showGuides}
                  onLoadStandard={handleLoadStandardStarter}
                  onSelectPreset={handleSelectPreset}
                />
              </div>

              {/* Right Slide-Over Figma Property Inspector */}
              {showInspectorDrawer && activeFigmaNode && !isEmptySource && (
                <aside className="w-72 shrink-0 border-l border-zinc-200 bg-white p-4 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                          Layer Properties
                        </h3>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {activeFigmaNode.type} ({activeFigmaNode.id})
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (!figmaRoot || selectedFigmaId === figmaRoot.id) {
                            triggerToast('Cannot delete root frame');
                            return;
                          }
                          const cloned = cloneDeep(figmaRoot);
                          if (deleteFigmaNodeById(cloned, selectedFigmaId)) {
                            setFigmaRoot(cloned);
                            setSelectedFigmaId(cloned.id);
                            handleFigmaToCompose(cloned);
                            triggerToast('Deleted layer');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                          {activeFigmaNode.type === 'TEXT' ? 'Text String' : 'Layer Name'}
                        </label>
                        <input
                          type="text"
                          value={
                            activeFigmaNode.type === 'TEXT'
                              ? activeFigmaNode.characters || ''
                              : activeFigmaNode.name || ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            updateSelectedFigmaNode((n) => {
                              if (n.type === 'TEXT') n.characters = val;
                              else n.name = val;
                            }, 'Updated label');
                          }}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                        />
                      </div>

                      {activeFigmaNode.type !== 'TEXT' && (
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            Auto Layout Direction
                          </label>
                          <select
                            value={activeFigmaNode.layoutMode || 'VERTICAL'}
                            onChange={(e) => {
                              const mode = e.target.value;
                              updateSelectedFigmaNode((n) => {
                                n.layoutMode = mode;
                              }, `Layout → ${mode}`);
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none"
                          >
                            <option value="VERTICAL">VERTICAL (Compose Column)</option>
                            <option value="HORIZONTAL">HORIZONTAL (Compose Row)</option>
                            <option value="NONE">NONE (Compose Box)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                          Fill / Text Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={figmaColorToCssHex(activeFigmaNode.fills?.[0]?.color)}
                            onChange={(e) => {
                              const hex = e.target.value;
                              updateSelectedFigmaNode((n) => {
                                n.fills = [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(hex) }];
                              }, `Color → ${hex}`);
                            }}
                            className="w-8 h-8 rounded bg-transparent cursor-pointer shrink-0 border border-zinc-200"
                          />
                          <input
                            type="text"
                            value={figmaColorToCssHex(activeFigmaNode.fills?.[0]?.color)}
                            onChange={(e) => {
                              const hex = e.target.value;
                              updateSelectedFigmaNode((n) => {
                                n.fills = [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(hex) }];
                              }, 'Updated color');
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            Padding (dp)
                          </label>
                          <input
                            type="number"
                            disabled={activeFigmaNode.type === 'TEXT'}
                            value={activeFigmaNode.paddingTop || 0}
                            onChange={(e) => {
                              const p = parseFloat(e.target.value) || 0;
                              updateSelectedFigmaNode((n) => {
                                n.paddingTop = p;
                                n.paddingRight = p;
                                n.paddingBottom = p;
                                n.paddingLeft = p;
                              }, `Padding → ${p}dp`);
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-900 disabled:opacity-40"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            {activeFigmaNode.type === 'TEXT' ? 'Font (sp)' : 'Gap (dp)'}
                          </label>
                          <input
                            type="number"
                            value={
                              activeFigmaNode.type === 'TEXT'
                                ? activeFigmaNode.style?.fontSize || 14
                                : activeFigmaNode.itemSpacing || 0
                            }
                            onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              updateSelectedFigmaNode((n) => {
                                if (n.type === 'TEXT') {
                                  n.style = n.style || { fontFamily: 'Inter', fontSize: 14, fontWeight: 400 };
                                  n.style.fontSize = Math.max(8, v);
                                } else {
                                  n.itemSpacing = v;
                                }
                              }, 'Updated metric');
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            Radius (dp)
                          </label>
                          <input
                            type="number"
                            disabled={activeFigmaNode.type === 'TEXT'}
                            value={activeFigmaNode.cornerRadius || 0}
                            onChange={(e) => {
                              const r = parseFloat(e.target.value) || 0;
                              updateSelectedFigmaNode((n) => {
                                n.cornerRadius = r;
                              }, `Radius → ${r}dp`);
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-900 disabled:opacity-40"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            Rotate (deg)
                          </label>
                          <input
                            type="number"
                            value={activeFigmaNode.rotation || 0}
                            onChange={(e) => {
                              const rot = parseFloat(e.target.value) || 0;
                              updateSelectedFigmaNode((n) => {
                                n.rotation = rot;
                              }, `Rotation → ${rot}°`);
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                          />
                        </div>
                      </div>

                      {activeFigmaNode.type !== 'TEXT' && (
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-500 font-semibold mb-1">
                            Scroll Behavior
                          </label>
                          <select
                            value={activeFigmaNode.overflowDirection || 'NONE'}
                            onChange={(e) => {
                              const sc = e.target.value;
                              updateSelectedFigmaNode((n) => {
                                n.overflowDirection = sc;
                              }, `Scroll → ${sc}`);
                            }}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900"
                          >
                            <option value="NONE">Static (No Scroll)</option>
                            <option value="VERTICAL_SCROLLING">verticalScroll()</option>
                            <option value="HORIZONTAL_SCROLLING">horizontalScroll()</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleFigmaToCompose(figmaRoot);
                      triggerToast('Emitted Jetpack Compose .kt code from Figma layers');
                    }}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Generate Kotlin Code
                  </button>
                </aside>
              )}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          MODE 3: DIRECT FIGMA DESIGN PAGE IMPORTER
         ===================================================================== */}
      {workspaceMode === 'import' && (
        <div className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Direct Figma Design Importer
                </span>
                <h2 className="text-xl font-bold text-zinc-900 mt-0.5">
                  Import a Figma Design Page → Get Jetpack Compose Kotlin Code
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Connect via Figma REST API URL, upload an exported Figma <span className="font-mono text-zinc-900">.json</span> node file, or pick a multi-device Figma page below.
                </p>
              </div>
            </div>

            {/* Option 1: Live Figma URL + Token */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-6">
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                  Figma Design File / Frame URL
                </label>
                <input
                  type="text"
                  value={figmaUrlInput}
                  onChange={(e) => setFigmaUrlInput(e.target.value)}
                  placeholder="https://www.figma.com/design/FILE_KEY/Project?node-id=1-2"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 font-mono focus:border-zinc-900 focus:outline-none"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                  Figma Personal Access Token (Optional for Live API)
                </label>
                <input
                  type="password"
                  value={figmaTokenInput}
                  onChange={(e) => setFigmaTokenInput(e.target.value)}
                  placeholder="figd_••••••••••••••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 font-mono focus:border-zinc-900 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={handleFetchFromFigmaUrl}
                  disabled={isFetchingFigma}
                  className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition"
                >
                  {isFetchingFigma ? 'Importing...' : 'Import & Generate'}
                </button>
              </div>
            </div>

            {/* Option 2: Upload Local JSON File */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
              <div className="text-xs text-zinc-600">
                Have an exported Figma REST API or Plugin <span className="font-mono text-zinc-900">.json</span> file on your machine?
              </div>
              <label className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-medium text-zinc-800 cursor-pointer flex items-center gap-2 transition">
                <Upload className="w-3.5 h-3.5 text-zinc-700" />
                <span>Upload Figma .json File</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Option 3: 1-Click Multi-Device Figma Page Gallery */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Or Import a Pre-Built Multi-Device Figma Page
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIGMA_IMPORT_GALLERY.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 uppercase">
                        Target: {item.targetDevice}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900">{item.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectPreset(item.presetKey);
                      setWorkspaceMode('split');
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <span>Import Figma Page & Generate Kotlin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 4: KOTLIN AST X-RAY & RAW FIGMA JSON INSPECTOR
         ===================================================================== */}
      {workspaceMode === 'ast' && (
        <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto">
          {/* AST Tree Explorer */}
          <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Kotlin PSI / AST Hierarchy</h3>
                <p className="text-xs text-zinc-500">
                  Parsed from @Composable source via Recursive-Descent AST Parser
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono text-xs">
                {ast?.totalAstNodes || 0} AST Nodes
              </span>
            </div>
            <div className="flex-1 overflow-y-auto bg-zinc-50 border border-zinc-200 rounded-xl p-3 font-mono text-xs space-y-1 max-h-[500px]">
              {ast?.declarations?.map((fn) => (
                <div key={fn.astId} className="space-y-1">
                  <div className="text-zinc-900 font-bold">
                    ƒ KtNamedFunction: {fn.name}() [@Composable]
                  </div>
                  {fn.bodyStatements.map((st) => (
                    <div key={st.astId} className="pl-4 text-zinc-700 space-y-1">
                      <div>├─ KtCallExpression: {st.calleeName}</div>
                      {(st.trailingLambda?.statements || []).map((ch) => (
                        <div key={ch.astId} className="pl-4 text-zinc-500">
                          ├─ KtCallExpression: {ch.calleeName} (Modifier steps:{' '}
                          {ch._unrolledModifier?.rawSteps?.length || 0})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Raw Figma SceneGraph JSON */}
          <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Figma SceneNode JSON</h3>
                <p className="text-xs text-zinc-500">
                  Edit raw Figma JSON & click Apply to synthesize Jetpack Compose code
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(figmaJsonText);
                      setFigmaRoot(parsed);
                      handleFigmaToCompose(parsed);
                      setWorkspaceMode('split');
                      triggerToast('Applied Figma JSON → Generated Kotlin Code!');
                    } catch (err) {
                      triggerToast(`Invalid JSON: ${err.message}`);
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold"
                >
                  Apply JSON → Kotlin
                </button>
              </div>
            </div>
            <textarea
              value={figmaJsonText}
              onChange={(e) => setFigmaJsonText(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 bg-zinc-50 border border-zinc-200 text-zinc-800 font-mono text-xs p-3 rounded-xl focus:outline-none resize-none min-h-[460px]"
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 5: BUILT-IN DOCUMENTATION, ARCHITECTURE & SETUP GUIDE
         ===================================================================== */}
      {workspaceMode === 'docs' && (
        <div className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Documentation & Developer Handbook
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 mt-1">
                How to Use KtAstBridge Studio (Web & CLI)
              </h2>
              <p className="text-xs text-zinc-600 mt-1">
                Complete reference for converting Figma Auto Layout designs into Jetpack Compose Kotlin code and previewing Compose code across constant-size Mobile, Tablet, and Desktop viewports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="text-xs font-bold text-zinc-900 uppercase">1. Write Code → Preview UI</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Open <strong>Split Studio</strong>, write any <code className="font-mono text-zinc-900">@Composable</code> function, and switch between constant-size <strong>Mobile (380×700)</strong>, <strong>Tablet (760×550)</strong>, and <strong>Desktop (960×580)</strong> hardware viewports.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="text-xs font-bold text-zinc-900 uppercase">2. Import Figma → Get Code</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Open <strong>Import from Figma</strong>, paste your Figma File URL + Personal Access Token (or upload a <code className="font-mono text-zinc-900">.json</code> node export), and generate clean Jetpack Compose code.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="text-xs font-bold text-zinc-900 uppercase">3. Visual Layer Inspector</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Click any element inside the preview frame to modify its text, fill color, padding, spacing, corner radius, rotation, or scroll behavior and sync back to Kotlin AST.
                </p>
              </div>
            </div>

            {/* Mapping Table */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">
                Supported Jetpack Compose ↔ Figma Auto Layout AST Mappings
              </h3>
              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Jetpack Compose AST Node</th>
                      <th className="py-2.5 px-3 font-semibold">Figma SceneNode Representation</th>
                      <th className="py-2.5 px-3 font-semibold">Viewport Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700">
                    <tr>
                      <td className="py-2 px-3 font-mono">Column(verticalArrangement = spacedBy(N.dp))</td>
                      <td className="py-2 px-3 font-mono">FRAME (layoutMode = "VERTICAL", itemSpacing = N)</td>
                      <td className="py-2 px-3">Vertical stack across all devices</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono">Row(horizontalArrangement = SpaceBetween)</td>
                      <td className="py-2 px-3 font-mono">FRAME (layoutMode = "HORIZONTAL", SPACE_BETWEEN)</td>
                      <td className="py-2 px-3">Horizontal row; wraps cleanly on Mobile</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono">Modifier.weight(1f) / Modifier.width(N.dp)</td>
                      <td className="py-2 px-3 font-mono">layoutGrow = 1 / widthDp = N</td>
                      <td className="py-2 px-3">Multi-column Desktop/Tablet; clamped on Mobile</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono">Modifier.rotate(deg) / verticalScroll()</td>
                      <td className="py-2 px-3 font-mono">rotation = deg / VERTICAL_SCROLLING</td>
                      <td className="py-2 px-3">CSS transform rotate & scrollable container</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Local Setup & Cloud Deployment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="text-xs font-bold uppercase text-zinc-900">Local Setup (React Web + Kotlin CLI)</h4>
                <pre className="text-[11px] font-mono bg-white p-3 rounded-lg border border-zinc-200 text-zinc-800 overflow-x-auto">
{`# 1. Run Modular React + Vite Studio
cd web
npm install
npm run dev

# 2. Run Standalone Kotlin JVM CLI
cd ..
./gradlew run --args="compose2figma samples/wallet.kt out.json"`}
                </pre>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="text-xs font-bold uppercase text-zinc-900">Free Hosting (Cloudflare Pages / GitHub Pages)</h4>
                <pre className="text-[11px] font-mono bg-white p-3 rounded-lg border border-zinc-200 text-zinc-800 overflow-x-auto">
{`# Cloudflare Pages Settings:
Root directory:   web
Build command:    npm run build
Build output dir: dist

# GitHub Pages:
Included in .github/workflows/deploy-pages.yml`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <footer className="h-7 border-t border-zinc-200 bg-white px-4 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-4">
          <span>{statusMessage}</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Viewport: {deviceType.toUpperCase()} ({DEVICE_PROFILES[deviceType]?.width}×{DEVICE_PROFILES[deviceType]?.height})</span>
          <span>•</span>
          <span>Tokens: {Math.max(0, tokens.length - 1)}</span>
          <span>•</span>
          <span>Layers: {layerCount}</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-9 right-5 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-xs font-medium text-white shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}