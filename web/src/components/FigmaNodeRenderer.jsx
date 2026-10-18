import React from "react";
import { figmaColorToCssHex } from "../engine/astToFigma";

/******************************************************************************
 * 4. RECURSIVE FIGMA AUTO-LAYOUT RENDERER (CLAMPED TO PREVENT SIDEWAYS STRETCH)
 ******************************************************************************/
export function FigmaNodeRenderer({ node, selectedId, onSelect, showGuides, deviceType, isLandscape }) {
  if (!node) return null;
  const isSelected = node.id === selectedId;
  const isCompactMobile = deviceType === 'mobile' && !isLandscape;

  if (node.type === 'TEXT') {
    const fs = node.style?.fontSize || 14;
    const fw = node.style?.fontWeight || 400;
    const fillHex = figmaColorToCssHex(node.fills?.[0]?.color);
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          fontSize: `${fs}px`,
          fontWeight: fw,
          color: fillHex,
          lineHeight: 1.4,
          maxWidth: '100%',
          minWidth: 0,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined
        }}
        className={`cursor-pointer rounded px-0.5 transition-all relative ${
          isSelected
            ? 'outline outline-2 outline-zinc-900 outline-offset-1 bg-zinc-900/5'
            : 'hover:outline hover:outline-1 hover:outline-zinc-400'
        }`}
      >
        {node.characters || 'Text'}
      </div>
    );
  }

  if (node.type === 'RECTANGLE' || node.type === 'LINE') {
    const h = node.absoluteBoundingBox?.height || 1;
    const fillHex = node.fills?.[0] ? figmaColorToCssHex(node.fills[0].color) : 'transparent';
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        style={{
          height: `${h}px`,
          width: '100%',
          maxWidth: '100%',
          backgroundColor: fillHex
        }}
        className={`cursor-pointer my-0.5 ${
          isSelected ? 'outline outline-2 outline-zinc-900 outline-offset-1' : ''
        }`}
      />
    );
  }

  const isHoriz = node.layoutMode === 'HORIZONTAL';
  // Inside Mobile Portrait (380px), if a Row contains multiple complex FRAME containers
  // (such as a Desktop sidebar + main panel or 3 KPI cards), stack them vertically so the mobile screen never stretches sideways.
  const hasMultipleFrameChildren =
    isHoriz &&
    (node.children || []).filter((c) => c.type === 'FRAME').length >= 2 &&
    (node.children || []).some((c) => c.widthDp || c.layoutGrow || (c.children && c.children.length > 2));

  const effectiveDirection = isCompactMobile && hasMultipleFrameChildren ? 'column' : isHoriz ? 'row' : 'column';

  const justify =
    node.primaryAxisAlignItems === 'SPACE_BETWEEN'
      ? 'space-between'
      : node.primaryAxisAlignItems === 'CENTER'
      ? 'center'
      : 'flex-start';

  const bgHex = node.fills?.[0] ? figmaColorToCssHex(node.fills[0].color) : undefined;
  const borderStyle =
    node.strokes?.[0] && (node.strokeWeight || 0) > 0
      ? `${node.strokeWeight}px solid ${figmaColorToCssHex(node.strokes[0].color)}`
      : undefined;

  const resolvedWidth = isCompactMobile && node.widthDp && node.widthDp > 160
    ? '100%'
    : node.widthDp
    ? `${node.widthDp}px`
    : node.layoutSizingHorizontal === 'FILL'
    ? '100%'
    : undefined;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      style={{
        display: 'flex',
        flexDirection: effectiveDirection,
        flexWrap: isHoriz && isCompactMobile ? 'wrap' : undefined,
        justifyContent: justify,
        alignItems: node.counterAxisAlignItems === 'CENTER' && effectiveDirection === 'row' ? 'center' : 'stretch',
        gap: `${node.itemSpacing || 0}px`,
        paddingTop: `${node.paddingTop || 0}px`,
        paddingRight: `${node.paddingRight || 0}px`,
        paddingBottom: `${node.paddingBottom || 0}px`,
        paddingLeft: `${node.paddingLeft || 0}px`,
        borderRadius: `${node.cornerRadius || 0}px`,
        flex: node.layoutGrow && effectiveDirection === 'row' ? `${node.layoutGrow} 1 0%` : undefined,
        width: resolvedWidth,
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        backgroundColor: bgHex,
        border: borderStyle,
        transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
        overflowY: node.overflowDirection === 'VERTICAL_SCROLLING' ? 'auto' : undefined,
        overflowX: node.overflowDirection === 'HORIZONTAL_SCROLLING' ? 'auto' : 'hidden'
      }}
      className={`cursor-pointer transition-all relative ${
        isSelected
          ? 'outline outline-2 outline-zinc-900 outline-offset-1'
          : 'hover:outline hover:outline-1 hover:outline-zinc-400'
      } ${showGuides ? 'outline-dashed outline-1 outline-zinc-400/70' : ''}`}
    >
      {showGuides && (node.itemSpacing > 0 || node.paddingTop > 0) && (
        <span className="absolute -top-2 right-1 px-1.5 py-0.5 rounded bg-zinc-900 text-white font-mono text-[9px] pointer-events-none shadow-sm z-10">
          {isHoriz ? 'Row' : 'Col'} pad:{node.paddingTop || 0} gap:{node.itemSpacing || 0}
        </span>
      )}
      {(node.children || []).map((child) => (
        <FigmaNodeRenderer
          key={child.id}
          node={child}
          selectedId={selectedId}
          onSelect={onSelect}
          showGuides={showGuides}
          deviceType={deviceType}
          isLandscape={isLandscape}
        />
      ))}
    </div>
  );
}

