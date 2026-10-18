// Modular v4.0 Figma SceneGraph -> Jetpack Compose Code Generator
export function figmaColorToKotlinHexLiteral(color) {
  const r = Math.round((color?.r ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  const g = Math.round((color?.g ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  const b = Math.round((color?.b ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  return `Color(0xFF${r}${g}${b})`;
}

export function generateKotlinFromFigmaNode(rootNode, fnName = 'GeneratedScreen') {
  function emitNode(node, indent = 1) {
    const pad = '    '.repeat(indent);
    const innerPad = '    '.repeat(indent + 1);

    if (node.type === 'TEXT') {
      const textVal = (node.characters || 'Text').replace(/"/g, '\\"');
      const fs = Math.round(node.style?.fontSize || 14);
      const fw = node.style?.fontWeight || 400;
      const weightStr = fw >= 700 ? 'FontWeight.Bold' : fw >= 600 ? 'FontWeight.SemiBold' : fw >= 500 ? 'FontWeight.Medium' : null;
      const colorPaint = (node.fills || []).find(f => f.visible !== false);
      const colorStr = colorPaint?.color ? figmaColorToKotlinHexLiteral(colorPaint.color) : 'Color(0xFF18181B)';

      const lines = [
        `${innerPad}text = "${textVal}"`,
        `${innerPad}fontSize = ${fs}.sp`
      ];
      if (weightStr) lines.push(`${innerPad}fontWeight = ${weightStr}`);
      lines.push(`${innerPad}color = ${colorStr}`);
      if (node.rotation && Number(node.rotation) !== 0) {
        lines.push(`${innerPad}modifier = Modifier.rotate(${node.rotation}f)`);
      }

      return `${pad}Text(\n${lines.join(',\n')}\n${pad})`;
    }

    if (node.type === 'RECTANGLE' || node.type === 'LINE' || node.type === 'VECTOR') {
      const h = Math.round(node.absoluteBoundingBox?.height || 1);
      if (h <= 2 && node.fills && node.fills.length) {
        return `${pad}HorizontalDivider(color = ${figmaColorToKotlinHexLiteral(node.fills[0].color)})`;
      }
      return `${pad}Spacer(modifier = Modifier.height(${Math.max(4, h)}.dp))`;
    }

    const lowerName = (node.name || '').toLowerCase();
    const isButton = node.composableType === 'Button' || lowerName.includes('button') || lowerName.includes('btn') || lowerName.includes('cta');
    const composable = isButton
      ? 'Button'
      : node.layoutMode === 'HORIZONTAL'
      ? 'Row'
      : node.layoutMode === 'NONE'
      ? 'Box'
      : 'Column';

    const modParts = ['Modifier'];
    if (node.layoutGrow && node.layoutGrow > 0) {
      modParts.push(`weight(${node.layoutGrow}f)`);
    } else if (node.widthDp) {
      modParts.push(`width(${Math.round(node.widthDp)}.dp)`);
    } else if (node.layoutSizingHorizontal === 'FILL' || indent === 1) {
      modParts.push('fillMaxWidth()');
    }

    const fill = (node.fills || []).find(f => f.visible !== false);
    if (fill && fill.color) {
      const colStr = figmaColorToKotlinHexLiteral(fill.color);
      if ((node.cornerRadius || 0) > 0) {
        modParts.push(`background(${colStr}, RoundedCornerShape(${Math.round(node.cornerRadius)}.dp))`);
      } else {
        modParts.push(`background(${colStr})`);
      }
    }
    const stroke = (node.strokes || []).find(s => s.visible !== false);
    if (stroke && stroke.color && (node.strokeWeight || 0) > 0) {
      const sCol = figmaColorToKotlinHexLiteral(stroke.color);
      const rad = (node.cornerRadius || 0) > 0 ? `, RoundedCornerShape(${Math.round(node.cornerRadius)}.dp)` : '';
      modParts.push(`border(${Math.round(node.strokeWeight)}.dp, ${sCol}${rad})`);
    }
    const pt = Math.round(node.paddingTop || 0);
    const pr = Math.round(node.paddingRight || 0);
    const pb = Math.round(node.paddingBottom || 0);
    const pl = Math.round(node.paddingLeft || 0);
    if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {
      if (pt === pr && pr === pb && pb === pl) {
        modParts.push(`padding(${pt}.dp)`);
      } else {
        modParts.push(`padding(horizontal = ${pl}.dp, vertical = ${pt}.dp)`);
      }
    }
    if (node.rotation && Number(node.rotation) !== 0) {
      modParts.push(`rotate(${node.rotation}f)`);
    }
    if (node.overflowDirection === 'VERTICAL_SCROLLING') {
      modParts.push('verticalScroll(rememberScrollState())');
    } else if (node.overflowDirection === 'HORIZONTAL_SCROLLING') {
      modParts.push('horizontalScroll(rememberScrollState())');
    }

    const args = [];
    if (modParts.length > 1) {
      args.push(`${innerPad}modifier = ${modParts.join('.')}`);
    }

    if (!isButton) {
      if (composable === 'Column') {
        if (node.primaryAxisAlignItems === 'SPACE_BETWEEN') {
          args.push(`${innerPad}verticalArrangement = Arrangement.SpaceBetween`);
        } else if ((node.itemSpacing || 0) > 0) {
          args.push(`${innerPad}verticalArrangement = Arrangement.spacedBy(${Math.round(node.itemSpacing)}.dp)`);
        }
      } else if (composable === 'Row') {
        if (node.primaryAxisAlignItems === 'SPACE_BETWEEN') {
          args.push(`${innerPad}horizontalArrangement = Arrangement.SpaceBetween`);
        } else if ((node.itemSpacing || 0) > 0) {
          args.push(`${innerPad}horizontalArrangement = Arrangement.spacedBy(${Math.round(node.itemSpacing)}.dp)`);
        }
        if (node.counterAxisAlignItems === 'CENTER') {
          args.push(`${innerPad}verticalAlignment = Alignment.CenterVertically`);
        }
      }
    }

    const argSection = args.length ? `(\n${args.join(',\n')}\n${pad})` : '()';
    const childrenCode = (node.children || []).map(ch => emitNode(ch, indent + 1)).join('\n');
    return `${pad}${composable}${argSection} {\n${childrenCode}\n${pad}}`;
  }

  const cleanFnName = (rootNode.name || fnName).replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedScreen';
  return `package com.example.generated

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ${cleanFnName}() {
${emitNode(rootNode, 1)}
}`;
}

