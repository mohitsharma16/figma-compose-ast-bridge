import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Code2,
  Layers,
  Cpu,
  FileJson,
  Sparkles,
  Copy,
  Trash2,
  Plus,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Download,
  Upload,
  FolderGit2,
  Sliders,
  ZoomIn,
  ZoomOut,
  Globe,
  LayoutGrid,
  Terminal,
  ChevronRight,
  BookOpen,
  RotateCcw
} from 'lucide-react';

/******************************************************************************
 * 1. ELEGANT MULTI-DEVICE PRESETS (MOBILE, TABLET, DESKTOP, AND STARTER)
 *    Designed with a refined, minimalist palette (Obsidian, Warm Stone, Slate)
 *    that fits cleanly inside constant-size Mobile, Tablet, and Desktop frames.
 ******************************************************************************/
const STARTER_TEMPLATE_CODE = `package com.example.starter

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
fun StandardStarterScreen() {
    Column(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFFFFFFF), RoundedCornerShape(16.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(16.dp)).padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text(
            text = "STANDARD TEMPLATE • READY",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF71717A)
        )
        Text(
            text = "Minimal Compose Workspace",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF18181B)
        )
        Text(
            text = "Edit this @Composable function on the left or click any layer in the preview to customize spacing, typography, and colors.",
            fontSize = 13.sp,
            color = Color(0xFF52525B)
        )
        Column(
            modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(12.dp)).padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = "Constant Viewport Guarantee",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF18181B)
            )
            Text(
                text = "Mobile (380×700), Tablet (760×550), and Desktop (960×580) frames stay fixed in size.",
                fontSize = 12.sp,
                color = Color(0xFF71717A)
            )
        }
        Button(
            modifier = Modifier.fillMaxWidth().background(Color(0xFF18181B), RoundedCornerShape(10.dp)).padding(12.dp)
        ) {
            Text(
                text = "Primary Action",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFFFFFFF)
            )
        }
    }
}`;

const PRESETS = {
  fintech: {
    label: 'Mobile — Minimalist Private Wealth Card',
    device: 'mobile',
    code: `package com.example.wealth

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
fun PrivateWealthMobileScreen() {
    Column(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFFFFFFF), RoundedCornerShape(16.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(16.dp)).padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "PRIVATE PORTFOLIO",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF71717A)
            )
            Text(
                text = "VERIFIED • USD",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF059669)
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "$148,920.00",
                fontSize = 30.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF18181B)
            )
            Text(
                text = "+$4,180.00 (+2.8%) past 30 days",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF52525B)
            )
        }
        HorizontalDivider(color = Color(0xFFE4E4E7))
        Column(
            modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(12.dp)).padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Treasury Yield Allocation",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF18181B)
                )
                Text(
                    text = "5.12% APY",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF059669)
                )
            }
            Text(
                text = "Automated daily settlement • Ref #KT-804",
                fontSize = 12.sp,
                color = Color(0xFF71717A)
            )
        }
        Column(
            modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(12.dp)).padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Global Index Sovereign Fund",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF18181B)
                )
                Text(
                    text = "$62,400",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF18181B)
                )
            }
            Text(
                text = "Rebalanced today • Low volatility tier",
                fontSize = 12.sp,
                color = Color(0xFF71717A)
            )
        }
        Button(
            modifier = Modifier.fillMaxWidth().background(Color(0xFF18181B), RoundedCornerShape(10.dp)).padding(13.dp)
        ) {
            Text(
                text = "Initiate Instant Wire",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFFFFFFF)
            )
        }
    }
}`
  },
  ecommerce: {
    label: 'Mobile — Editorial Studio Hardware Card',
    device: 'mobile',
    code: `package com.example.shop

import androidx.compose.runtime.Composable

@Composable
fun EditorialProductScreen() {
    Column(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFFFFFFF), RoundedCornerShape(16.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(16.dp)).padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxWidth().background(Color(0xFFF4F4F5), RoundedCornerShape(10.dp)).padding(14.dp)
        ) {
            Text(
                text = "ARCHITECTURAL EDITION • SERIES 04",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF52525B)
            )
        }
        Text(
            text = "Monolith CNC Anodized Mechanical Keyboard",
            fontSize = 19.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF18181B)
        )
        Text(
            text = "Precision-milled 6063 aluminum chassis with gasket isolation, acoustic poron dampening, and custom PBT keycaps.",
            fontSize = 13.sp,
            color = Color(0xFF52525B)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$240.00",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF18181B)
            )
            Text(
                text = "In Stock • Ships in 24h",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF059669)
            )
        }
        HorizontalDivider(color = Color(0xFFE4E4E7))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Switch Profile",
                fontSize = 12.sp,
                color = Color(0xFF71717A)
            )
            Text(
                text = "Linear 45g Lubricated",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF18181B)
            )
        }
        Button(
            modifier = Modifier.fillMaxWidth().background(Color(0xFF18181B), RoundedCornerShape(10.dp)).padding(13.dp)
        ) {
            Text(
                text = "Reserve Allocation",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFFFFFFF)
            )
        }
    }
}`
  },
  tablet_pos: {
    label: 'Tablet — Split-View Order & Checkout Studio',
    device: 'tablet',
    code: `package com.example.pos

import androidx.compose.runtime.Composable

@Composable
fun TabletCheckoutTerminal() {
    Row(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(16.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(16.dp)).padding(18.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column(
            modifier = Modifier.weight(1f).background(Color(0xFFFFFFFF), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(12.dp)).padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "CURATED COLLECTION • TABLET VIEW",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF71717A)
            )
            Text(
                text = "Studio Desk Essentials",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF18181B)
            )
            Row(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(10.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(10.dp)).padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(text = "Monolith Mechanical Keyboard", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF18181B))
                    Text(text = "Anodized Slate • SKU #MK-01", fontSize = 12.sp, color = Color(0xFF71717A))
                }
                Text(text = "$240.00", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF18181B))
            }
            Row(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(10.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(10.dp)).padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(text = "Solid Brass Wrist Rest", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF18181B))
                    Text(text = "Brushed Finish • SKU #BW-04", fontSize = 12.sp, color = Color(0xFF71717A))
                }
                Text(text = "$85.00", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF18181B))
            }
        }
        Column(
            modifier = Modifier.width(240.dp).background(Color(0xFF18181B), RoundedCornerShape(12.dp)).padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Text(
                text = "INVOICE SUMMARY",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFA1A1AA)
            )
            Text(
                text = "$325.00",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFFFFFF)
            )
            Text(
                text = "Complimentary insured courier delivery included.",
                fontSize = 12.sp,
                color = Color(0xFFA1A1AA)
            )
            HorizontalDivider(color = Color(0xFF27272A))
            Button(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFFFFFFF), RoundedCornerShape(8.dp)).padding(12.dp)
            ) {
                Text(
                    text = "Complete Order",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF18181B)
                )
            }
        }
    }
}`
  },
  desktop_saas: {
    label: 'Desktop — Executive Architecture Dashboard',
    device: 'desktop',
    code: `package com.example.dashboard

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
fun DesktopAnalyticsDashboard() {
    Row(
        modifier = Modifier.fillMaxWidth().background(Color(0xFFFAFAFA), RoundedCornerShape(16.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(16.dp)).padding(20.dp),
        horizontalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Column(
            modifier = Modifier.width(210.dp).background(Color(0xFF18181B), RoundedCornerShape(12.dp)).padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "KTAST STUDIO",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFA1A1AA)
            )
            Text(
                text = "Design System Sync",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFFFFFFF)
            )
            Text(
                text = "Figma Auto Layout",
                fontSize = 13.sp,
                color = Color(0xFFA1A1AA)
            )
            Text(
                text = "Compose AST Compiler",
                fontSize = 13.sp,
                color = Color(0xFFA1A1AA)
            )
            Text(
                text = "Token Registry",
                fontSize = 13.sp,
                color = Color(0xFFA1A1AA)
            )
            HorizontalDivider(color = Color(0xFF27272A))
            Button(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFFFFFFF), RoundedCornerShape(8.dp)).padding(10.dp)
            ) {
                Text(
                    text = "+ Import Figma Frame",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF18181B)
                )
            }
        }
        Column(
            modifier = Modifier.weight(1f).background(Color(0xFFFFFFFF), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(12.dp)).padding(22.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Design-to-Code Compilation Overview",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF18181B)
                    )
                    Text(
                        text = "Deterministic Kotlin PSI / AST bridge for Mobile, Tablet, and Desktop targets",
                        fontSize = 13.sp,
                        color = Color(0xFF71717A)
                    )
                }
                Button(
                    modifier = Modifier.background(Color(0xFF18181B), RoundedCornerShape(8.dp)).padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = "Export .kt File",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFFFFFFFF)
                    )
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Column(
                    modifier = Modifier.weight(1f).background(Color(0xFFFAFAFA), RoundedCornerShape(10.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(10.dp)).padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(text = "PARSE LATENCY", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF71717A))
                    Text(text = "1.1 ms", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF18181B))
                    Text(text = "Recursive-Descent AST", fontSize = 11.sp, color = Color(0xFF059669))
                }
                Column(
                    modifier = Modifier.weight(1f).background(Color(0xFFFAFAFA), RoundedCornerShape(10.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(10.dp)).padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(text = "LAYOUT FIDELITY", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF71717A))
                    Text(text = "99.8%", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF18181B))
                    Text(text = "Fixed Viewport Solver", fontSize = 11.sp, color = Color(0xFF52525B))
                }
                Column(
                    modifier = Modifier.weight(1f).background(Color(0xFFFAFAFA), RoundedCornerShape(10.dp)).border(1.dp, Color(0xFFE4E4E7), RoundedCornerShape(10.dp)).padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(text = "ACTIVE SCREENS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF71717A))
                    Text(text = "42 Pages", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF18181B))
                    Text(text = "Mobile, Tablet & Desktop", fontSize = 11.sp, color = Color(0xFF52525B))
                }
            }
            Column(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFF4F4F5), RoundedCornerShape(10.dp)).padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "Production Pipeline Connected",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF18181B)
                )
                Text(
                    text = "Every layer adjustment in the visual inspector immediately synthesizes clean Jetpack Compose Kotlin code.",
                    fontSize = 12.sp,
                    color = Color(0xFF52525B)
                )
            }
        }
    }
}`
  }
};

// Ready-to-Import Figma Design Pages for the "Import from Figma" Gallery
const FIGMA_IMPORT_GALLERY = [
  {
    id: 'figma-mobile-wallet',
    title: 'Minimalist Private Wealth Portfolio (Mobile 380×700)',
    targetDevice: 'mobile',
    badge: 'Mobile Portrait Frame',
    description: 'Clean typographic hierarchy, balance card, yield allocation rows, and primary wire action button.',
    presetKey: 'fintech'
  },
  {
    id: 'figma-mobile-shop',
    title: 'Editorial Studio Hardware Product Page (Mobile 380×700)',
    targetDevice: 'mobile',
    badge: 'Mobile Portrait Frame',
    description: 'Series badge box, product title, specification row, divider, and reservation button.',
    presetKey: 'ecommerce'
  },
  {
    id: 'figma-tablet-pos',
    title: 'Curated Studio Split-View Checkout (Tablet 760×550)',
    targetDevice: 'tablet',
    badge: 'Tablet Split-View',
    description: 'Left catalog item list paired with a high-contrast obsidian invoice summary card.',
    presetKey: 'tablet_pos'
  },
  {
    id: 'figma-desktop-analytics',
    title: 'Executive Architecture Dashboard (Desktop 960×580)',
    targetDevice: 'desktop',
    badge: 'Desktop Window',
    description: 'Left navigation rail, 3-column KPI metric row, and live compilation status banner.',
    presetKey: 'desktop_saas'
  }
];

/******************************************************************************
 * 2. KOTLIN LEXER & RECURSIVE-DESCENT AST PARSER (SUPPORTS WEIGHT, WIDTH, SCROLL)
 ******************************************************************************/
const KEYWORDS = new Set(['package', 'import', 'fun', 'val', 'var', 'true', 'false', 'null']);

function tokenizeKotlin(source) {
  const tokens = [];
  let pos = 0, line = 1, col = 1;
  const peek = (off = 1) => (pos + off < source.length ? source[pos + off] : '');

  while (pos < source.length) {
    const ch = source[pos];
    if (ch === '\n') {
      pos++; line++; col = 1;
    } else if (/\s/.test(ch)) {
      pos++; col++;
    } else if (ch === '/' && peek(1) === '/') {
      while (pos < source.length && source[pos] !== '\n') { pos++; col++; }
    } else if (ch === '/' && peek(1) === '*') {
      pos += 2; col += 2;
      while (pos < source.length && !(source[pos] === '*' && peek(1) === '/')) {
        if (source[pos] === '\n') { line++; col = 1; } else col++;
        pos++;
      }
      if (pos < source.length) { pos += 2; col += 2; }
    } else if (ch === '@') {
      const startCol = col;
      pos++; col++;
      let name = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
        name += source[pos++]; col++;
      }
      tokens.push({ type: 'AT_ANNOTATION', lexeme: name, line, col: startCol });
    } else if (ch === '"') {
      const startCol = col;
      pos++; col++;
      let str = '';
      while (pos < source.length && source[pos] !== '"') {
        if (source[pos] === '\\' && pos + 1 < source.length) { pos++; col++; }
        str += source[pos++]; col++;
      }
      if (pos < source.length) { pos++; col++; }
      tokens.push({ type: 'STRING', lexeme: str, line, col: startCol });
    } else if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(peek(1)))) {
      const startCol = col;
      let numStr = '';
      if (ch === '-') { numStr += source[pos++]; col++; }
      if (source[pos] === '0' && (peek(1) === 'x' || peek(1) === 'X')) {
        numStr += '0x'; pos += 2; col += 2;
        while (pos < source.length && /[0-9a-fA-F_]/.test(source[pos])) {
          if (source[pos] !== '_') numStr += source[pos];
          pos++; col++;
        }
      } else {
        while (pos < source.length && /[0-9.]/.test(source[pos])) {
          if (source[pos] === '.' && !/[0-9]/.test(peek(1))) break;
          numStr += source[pos++]; col++;
        }
        if (pos < source.length && (source[pos] === 'f' || source[pos] === 'F')) {
          pos++; col++;
        }
      }
      tokens.push({ type: 'NUMBER', lexeme: numStr, line, col: startCol });
    } else if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      let ident = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
        ident += source[pos++]; col++;
      }
      tokens.push({
        type: KEYWORDS.has(ident) ? 'KEYWORD' : 'IDENTIFIER',
        lexeme: ident,
        line,
        col: startCol
      });
    } else if (ch === '-' && peek(1) === '>') {
      tokens.push({ type: 'ARROW', lexeme: '->', line, col });
      pos += 2; col += 2;
    } else {
      const map = {
        '(': 'LPAREN', ')': 'RPAREN', '{': 'LBRACE', '}': 'RBRACE',
        ',': 'COMMA', '.': 'DOT', ':': 'COLON', '=': 'EQUALS'
      };
      if (map[ch]) {
        tokens.push({ type: map[ch], lexeme: ch, line, col });
      }
      pos++; col++;
    }
  }
  tokens.push({ type: 'EOF', lexeme: '', line, col });
  return tokens;
}

function parseKotlinAst(tokens) {
  let idx = 0;
  let astIdSeq = 1;
  const nextAstId = () => 'ast-' + (astIdSeq++);

  const isAtEnd = () => tokens[idx].type === 'EOF';
  const check = (type) => !isAtEnd() && tokens[idx].type === type;
  const checkKw = (word) => !isAtEnd() && tokens[idx].type === 'KEYWORD' && tokens[idx].lexeme === word;
  const advance = () => (!isAtEnd() ? tokens[idx++] : tokens[tokens.length - 1]);
  const peekTok = (off = 1) => (idx + off < tokens.length ? tokens[idx + off] : tokens[tokens.length - 1]);
  const match = (type) => { if (check(type)) { advance(); return true; } return false; };

  function parseQualifiedIdent() {
    let out = '';
    while (check('IDENTIFIER') || check('DOT') || (!isAtEnd() && tokens[idx].lexeme === '*')) {
      out += advance().lexeme;
    }
    return out || 'com.example.ui';
  }

  function parseValueArgList() {
    const args = [];
    while (!check('RPAREN') && !isAtEnd()) {
      const isNamed = check('IDENTIFIER') && peekTok(1).type === 'EQUALS';
      if (isNamed) {
        const name = advance().lexeme;
        match('EQUALS');
        const expr = parseExpression();
        args.push({ astId: nextAstId(), nodeType: 'KtValueArgument', name, expression: expr });
      } else {
        const expr = parseExpression();
        args.push({ astId: nextAstId(), nodeType: 'KtValueArgument', name: null, expression: expr });
      }
      if (!match('COMMA')) break;
    }
    match('RPAREN');
    return args;
  }

  function parseLambda() {
    const line = tokens[idx].line;
    match('LBRACE');
    const statements = [];
    while (!check('RBRACE') && !isAtEnd()) {
      const expr = parseExpression();
      if (expr && expr.nodeType === 'KtCallExpression') {
        statements.push(expr);
      }
    }
    match('RBRACE');
    return { astId: nextAstId(), nodeType: 'KtLambdaExpression', line, statements };
  }

  function parsePrimary() {
    const tok = tokens[idx];
    if (check('STRING')) {
      return { astId: nextAstId(), nodeType: 'KtStringTemplateExpression', value: advance().lexeme, line: tok.line };
    }
    if (check('NUMBER')) {
      const raw = advance().lexeme;
      const isHex = /^0x/i.test(raw);
      const numVal = isHex ? parseInt(raw, 16) : parseFloat(raw);
      return { astId: nextAstId(), nodeType: 'KtConstantExpression', raw, value: numVal, isHex, line: tok.line };
    }
    if (checkKw('true') || checkKw('false')) {
      return { astId: nextAstId(), nodeType: 'KtConstantExpression', value: advance().lexeme === 'true', line: tok.line };
    }
    if (check('LBRACE')) {
      return parseLambda();
    }
    if (check('IDENTIFIER')) {
      const ident = advance().lexeme;
      const hasParen = check('LPAREN');
      const valueArguments = match('LPAREN') ? parseValueArgList() : [];
      const trailingLambda = check('LBRACE') ? parseLambda() : null;
      if (hasParen || trailingLambda) {
        return {
          astId: nextAstId(),
          nodeType: 'KtCallExpression',
          calleeName: ident,
          valueArguments,
          trailingLambda,
          line: tok.line
        };
      }
      return { astId: nextAstId(), nodeType: 'KtNameReferenceExpression', identifier: ident, line: tok.line };
    }
    const fallback = advance();
    return { astId: nextAstId(), nodeType: 'KtNameReferenceExpression', identifier: fallback.lexeme, line: fallback.line };
  }

  function parseExpression() {
    let expr = parsePrimary();
    while (match('DOT')) {
      const selector = parsePrimary();
      expr = {
        astId: nextAstId(),
        nodeType: 'KtDotQualifiedExpression',
        receiver: expr,
        selector,
        line: expr.line
      };
    }
    return expr;
  }

  function parseFunctionDecl() {
    const annotations = [];
    while (check('AT_ANNOTATION')) {
      const tok = advance();
      const args = match('LPAREN') ? parseValueArgList() : [];
      annotations.push({ astId: nextAstId(), nodeType: 'KtAnnotationEntry', name: tok.lexeme, args, line: tok.line });
    }
    if (checkKw('fun')) advance();
    const fnTok = check('IDENTIFIER') ? advance() : { lexeme: 'GeneratedScreen', line: 1 };
    if (match('LPAREN')) {
      while (!check('RPAREN') && !isAtEnd()) advance();
      match('RPAREN');
    }
    const bodyStatements = [];
    if (match('LBRACE')) {
      while (!check('RBRACE') && !isAtEnd()) {
        const expr = parseExpression();
        if (expr && expr.nodeType === 'KtCallExpression') {
          bodyStatements.push(expr);
        }
      }
      match('RBRACE');
    }
    return {
      astId: nextAstId(),
      nodeType: 'KtNamedFunction',
      name: fnTok.lexeme,
      annotations,
      bodyStatements,
      line: fnTok.line
    };
  }

  let packageName = 'com.example.ui';
  const imports = [];
  const declarations = [];

  while (!isAtEnd()) {
    if (checkKw('package')) {
      advance();
      packageName = parseQualifiedIdent();
    } else if (checkKw('import')) {
      advance();
      imports.push(parseQualifiedIdent());
    } else if (check('AT_ANNOTATION') || checkKw('fun')) {
      declarations.push(parseFunctionDecl());
    } else {
      advance();
    }
  }

  return {
    astId: nextAstId(),
    nodeType: 'KtFile',
    packageName,
    imports,
    declarations,
    totalAstNodes: astIdSeq - 1
  };
}

function exprToCodeString(expr) {
  if (!expr) return '';
  switch (expr.nodeType) {
    case 'KtStringTemplateExpression': return `"${expr.value}"`;
    case 'KtConstantExpression': return expr.raw !== undefined ? expr.raw : String(expr.value);
    case 'KtNameReferenceExpression': return expr.identifier;
    case 'KtDotQualifiedExpression': return `${exprToCodeString(expr.receiver)}.${exprToCodeString(expr.selector)}`;
    case 'KtCallExpression': {
      const args = (expr.valueArguments || []).map(a => (a.name ? `${a.name} = ` : '') + exprToCodeString(a.expression)).join(', ');
      return `${expr.calleeName}(${args})`;
    }
    default: return '';
  }
}

function extractFirstNumber(expr) {
  if (!expr) return null;
  if (expr.nodeType === 'KtConstantExpression' && typeof expr.value === 'number') return expr.value;
  if (expr.nodeType === 'KtDotQualifiedExpression') {
    const l = extractFirstNumber(expr.receiver);
    return l !== null ? l : extractFirstNumber(expr.selector);
  }
  if (expr.nodeType === 'KtCallExpression') {
    for (const arg of expr.valueArguments || []) {
      const v = extractFirstNumber(arg.expression);
      if (v !== null) return v;
    }
  }
  return null;
}

function hexNumberToCss(num) {
  if (typeof num !== 'number' || isNaN(num)) return '#18181b';
  const unsigned = num >>> 0;
  const r = (unsigned >> 16) & 0xFF;
  const g = (unsigned >> 8) & 0xFF;
  const b = unsigned & 0xFF;
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function cssHexToFigmaColor(hex) {
  const clean = (hex || '#18181b').replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return { r: Number(r.toFixed(3)), g: Number(g.toFixed(3)), b: Number(b.toFixed(3)), a: 1 };
}

function figmaColorToCssHex(c) {
  if (!c) return '#18181b';
  const r = Math.round((c.r || 0) * 255).toString(16).padStart(2, '0');
  const g = Math.round((c.g || 0) * 255).toString(16).padStart(2, '0');
  const b = Math.round((c.b || 0) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function extractColorCss(expr) {
  if (!expr) return null;
  if (expr.nodeType === 'KtCallExpression' && expr.calleeName === 'Color') {
    const firstArg = expr.valueArguments[0]?.expression;
    if (firstArg && typeof firstArg.value === 'number') {
      return hexNumberToCss(firstArg.value);
    }
  }
  const s = exprToCodeString(expr);
  if (s.endsWith('.White')) return '#ffffff';
  if (s.endsWith('.Black')) return '#18181b';
  if (s.endsWith('.Gray')) return '#71717a';
  if (s.endsWith('.Blue')) return '#2563eb';
  return null;
}

function unrollModifierChain(expr) {
  const calls = [];
  function walk(node) {
    if (!node) return;
    if (node.nodeType === 'KtDotQualifiedExpression') {
      walk(node.receiver);
      walk(node.selector);
    } else if (node.nodeType === 'KtCallExpression') {
      calls.push(node);
    }
  }
  walk(expr);

  const mod = {
    fillMaxWidth: false,
    weight: null,
    widthDp: null,
    heightDp: null,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    bgHex: null,
    cornerRadius: 0,
    borderWidth: 0,
    borderHex: null,
    rotationDeg: 0,
    overflowDirection: 'NONE',
    rawSteps: calls.map(c => exprToCodeString(c))
  };

  for (const c of calls) {
    if (c.calleeName === 'fillMaxWidth' || c.calleeName === 'fillMaxSize') {
      mod.fillMaxWidth = true;
    } else if (c.calleeName === 'weight') {
      mod.weight = extractFirstNumber(c) || 1;
    } else if (c.calleeName === 'width') {
      mod.widthDp = extractFirstNumber(c);
    } else if (c.calleeName === 'height') {
      mod.heightDp = extractFirstNumber(c);
    } else if (c.calleeName === 'size') {
      const v = extractFirstNumber(c);
      if (v !== null) { mod.widthDp = v; mod.heightDp = v; }
    } else if (c.calleeName === 'padding') {
      for (const arg of c.valueArguments || []) {
        const v = extractFirstNumber(arg.expression) || 0;
        if (!arg.name) {
          mod.padding = { top: v, right: v, bottom: v, left: v };
        } else if (arg.name === 'horizontal') {
          mod.padding.left = v; mod.padding.right = v;
        } else if (arg.name === 'vertical') {
          mod.padding.top = v; mod.padding.bottom = v;
        } else if (arg.name === 'top') mod.padding.top = v;
        else if (arg.name === 'bottom') mod.padding.bottom = v;
        else if (arg.name === 'start' || arg.name === 'left') mod.padding.left = v;
        else if (arg.name === 'end' || arg.name === 'right') mod.padding.right = v;
      }
    } else if (c.calleeName === 'background') {
      const cHex = extractColorCss(c.valueArguments[0]?.expression);
      if (cHex) mod.bgHex = cHex;
      if (c.valueArguments[1]) {
        const r = extractFirstNumber(c.valueArguments[1].expression);
        if (r !== null) mod.cornerRadius = r;
      }
    } else if (c.calleeName === 'clip') {
      const r = extractFirstNumber(c.valueArguments[0]?.expression);
      if (r !== null) mod.cornerRadius = r;
    } else if (c.calleeName === 'border') {
      mod.borderWidth = extractFirstNumber(c.valueArguments[0]?.expression) || 1;
      mod.borderHex = extractColorCss(c.valueArguments[1]?.expression) || '#e4e4e7';
      if (c.valueArguments[2]) {
        const r = extractFirstNumber(c.valueArguments[2].expression);
        if (r !== null) mod.cornerRadius = r;
      }
    } else if (c.calleeName === 'rotate' || c.calleeName === 'graphicsLayer') {
      const deg = extractFirstNumber(c);
      if (deg !== null) mod.rotationDeg = deg;
    } else if (c.calleeName === 'verticalScroll') {
      mod.overflowDirection = 'VERTICAL_SCROLLING';
    } else if (c.calleeName === 'horizontalScroll') {
      mod.overflowDirection = 'HORIZONTAL_SCROLLING';
    }
  }
  return mod;
}

function findArg(callNode, name, posIndex = null) {
  const args = callNode.valueArguments || [];
  const byName = args.find(a => a.name === name);
  if (byName) return byName;
  if (posIndex !== null && args[posIndex] && !args[posIndex].name) return args[posIndex];
  return null;
}

function transformAstToFigma(ktFileAst) {
  let figmaIdCounter = 1;
  const nextFigmaId = () => `1:${figmaIdCounter++}`;
  const astMap = new Map();

  const fn = ktFileAst.declarations[0];
  if (!fn || !fn.bodyStatements.length) {
    return {
      root: null,
      isEmptySource: true,
      astMap,
      layerCount: 0
    };
  }

  function callToFigma(call) {
    const id = nextFigmaId();
    const callee = call.calleeName;
    const modArg = findArg(call, 'modifier');
    const mod = modArg ? unrollModifierChain(modArg.expression) : unrollModifierChain(null);
    call._unrolledModifier = mod;
    call._mappedFigmaId = id;
    astMap.set(id, call);

    if (callee === 'Text') {
      const txtArg = findArg(call, 'text', 0);
      const chars = txtArg?.expression?.value || 'Text';
      const fsArg = findArg(call, 'fontSize');
      const fontSize = fsArg ? (extractFirstNumber(fsArg.expression) || 14) : 14;
      const fwArg = findArg(call, 'fontWeight');
      const fwStr = fwArg ? exprToCodeString(fwArg.expression) : 'Normal';
      const fontWeight = fwStr.includes('Bold') ? 700 : fwStr.includes('SemiBold') ? 600 : fwStr.includes('Medium') ? 500 : 400;
      const colArg = findArg(call, 'color');
      const textHex = (colArg ? extractColorCss(colArg.expression) : null) || '#18181b';

      return {
        id,
        astId: call.astId,
        name: `Text_${chars.slice(0, 18)}`,
        type: 'TEXT',
        characters: chars,
        fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(textHex) }],
        style: {
          fontFamily: 'Inter',
          fontWeight,
          fontSize,
          lineHeightPx: Math.round(fontSize * 1.4)
        },
        rotation: mod.rotationDeg || 0,
        layoutSizingHorizontal: mod.fillMaxWidth ? 'FILL' : 'HUG',
        layoutSizingVertical: 'HUG'
      };
    }

    if (callee === 'HorizontalDivider' || callee === 'Divider' || callee === 'Spacer') {
      const isDiv = callee.includes('Divider');
      const colArg = findArg(call, 'color');
      const divHex = (colArg ? extractColorCss(colArg.expression) : null) || '#e4e4e7';
      return {
        id,
        astId: call.astId,
        name: callee,
        type: 'RECTANGLE',
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'FIXED',
        cornerRadius: 0,
        fills: isDiv ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(divHex) }] : [],
        strokes: [],
        strokeWeight: 0,
        absoluteBoundingBox: { x: 0, y: 0, width: 300, height: mod.heightDp || (isDiv ? 1 : 12) },
        children: []
      };
    }

    const isRow = callee === 'Row' || callee === 'LazyRow';
    const isButton = callee === 'Button' || callee === 'OutlinedButton';
    const layoutMode = isRow || isButton ? 'HORIZONTAL' : callee === 'Box' ? 'NONE' : 'VERTICAL';

    let itemSpacing = 0;
    let primaryAxisAlignItems = isButton ? 'CENTER' : 'MIN';
    let counterAxisAlignItems = isButton ? 'CENTER' : 'MIN';

    const arrArg = findArg(call, 'verticalArrangement') || findArg(call, 'horizontalArrangement');
    if (arrArg) {
      const code = exprToCodeString(arrArg.expression);
      if (code.includes('SpaceBetween')) primaryAxisAlignItems = 'SPACE_BETWEEN';
      else if (code.includes('Center')) primaryAxisAlignItems = 'CENTER';
      else if (code.includes('spacedBy')) itemSpacing = extractFirstNumber(arrArg.expression) || 8;
    }

    const alignArg = findArg(call, 'horizontalAlignment') || findArg(call, 'verticalAlignment');
    if (alignArg) {
      const code = exprToCodeString(alignArg.expression);
      if (code.includes('Center')) counterAxisAlignItems = 'CENTER';
    }

    const defaultBg = isButton ? '#18181b' : (callee === 'Card' || callee === 'Surface' ? '#ffffff' : null);
    const bgHex = mod.bgHex || defaultBg;
    const fills = bgHex ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(bgHex) }] : [];
    const strokes = mod.borderHex ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(mod.borderHex) }] : [];

    const padTop = mod.padding.top || (isButton ? 12 : 0);
    const padRight = mod.padding.right || (isButton ? 18 : 0);
    const padBottom = mod.padding.bottom || (isButton ? 12 : 0);
    const padLeft = mod.padding.left || (isButton ? 18 : 0);
    const radius = mod.cornerRadius || (isButton ? 10 : callee === 'Card' ? 14 : 0);

    const childStatements = call.trailingLambda?.statements || [];
    const children = childStatements.map(st => callToFigma(st));

    return {
      id,
      astId: call.astId,
      name: `${callee}_${id.replace(':', '_')}`,
      composableType: callee,
      type: 'FRAME',
      layoutMode,
      primaryAxisAlignItems,
      counterAxisAlignItems,
      layoutGrow: mod.weight || 0,
      widthDp: mod.widthDp || null,
      heightDp: mod.heightDp || null,
      layoutSizingHorizontal: mod.fillMaxWidth || mod.weight ? 'FILL' : mod.widthDp ? 'FIXED' : 'HUG',
      layoutSizingVertical: mod.heightDp ? 'FIXED' : 'HUG',
      paddingTop: padTop,
      paddingRight: padRight,
      paddingBottom: padBottom,
      paddingLeft: padLeft,
      itemSpacing,
      cornerRadius: radius,
      rotation: mod.rotationDeg || 0,
      overflowDirection: callee === 'LazyColumn' ? 'VERTICAL_SCROLLING' : callee === 'LazyRow' ? 'HORIZONTAL_SCROLLING' : (mod.overflowDirection || 'NONE'),
      fills,
      strokes,
      strokeWeight: mod.borderWidth || 0,
      children
    };
  }

  const rootFigma = callToFigma(fn.bodyStatements[0]);
  rootFigma.name = fn.name || rootFigma.name;
  return { root: rootFigma, isEmptySource: false, astMap, layerCount: figmaIdCounter - 1 };
}

function figmaColorToKotlinHexLiteral(color) {
  const r = Math.round((color?.r ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  const g = Math.round((color?.g ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  const b = Math.round((color?.b ?? 0) * 255).toString(16).padStart(2, '0').toUpperCase();
  return `Color(0xFF${r}${g}${b})`;
}

function generateKotlinFromFigmaNode(rootNode, fnName = 'GeneratedScreen') {
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

/******************************************************************************
 * 3. TREE HELPERS
 ******************************************************************************/
function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function findFigmaNodeById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findFigmaNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function deleteFigmaNodeById(parent, targetId) {
  if (!parent || !parent.children) return false;
  const idx = parent.children.findIndex(c => c.id === targetId);
  if (idx !== -1) {
    parent.children.splice(idx, 1);
    return true;
  }
  for (const ch of parent.children) {
    if (deleteFigmaNodeById(ch, targetId)) return true;
  }
  return false;
}

function getNextMaxFigmaId(node) {
  let max = 1;
  function walk(n) {
    if (!n) return;
    const parts = String(n.id || '1:1').split(':');
    const num = parseInt(parts[1] || '1', 10);
    if (num > max) max = num;
    (n.children || []).forEach(walk);
  }
  walk(node);
  return `1:${max + 1}`;
}

/******************************************************************************
 * 4. RECURSIVE FIGMA AUTO-LAYOUT RENDERER (CLAMPED TO PREVENT SIDEWAYS STRETCH)
 ******************************************************************************/
function FigmaNodeRenderer({ node, selectedId, onSelect, showGuides, deviceType, isLandscape }) {
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

/******************************************************************************
 * 5. CONSTANT-SIZE HARDWARE DEVICE STAGE (MOBILE / TABLET / DESKTOP)
 *    Irrespective of design size or whether the editor is blank, each device
 *    frame keeps its exact constant width & height and never stretches.
 ******************************************************************************/
const DEVICE_PROFILES = {
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

function EmptyStarterState({ onLoadStandard, onSelectPreset }) {
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

function DeviceStage({
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