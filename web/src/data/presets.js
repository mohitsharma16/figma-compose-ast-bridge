// Modular v4.0 Multi-Device Presets & Starter Template
export const STARTER_TEMPLATE_CODE = `package com.example.starter

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

export const PRESETS = {
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
export const FIGMA_IMPORT_GALLERY = [
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

