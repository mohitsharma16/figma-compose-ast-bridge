package com.figmacompose.ast.transformer

import com.figmacompose.ast.model.*

/**
 * ============================================================================
 * KOTLIN AST -> UNIFIED UI IR -> FIGMA SCENEGRAPH TRANSFORMER
 * ============================================================================
 * 1. Walks KtFileNode / KtFunctionDeclNode / KtCallExprNode AST nodes
 * 2. Unrolls KtDotQualifiedExprNode Modifier chains left-to-right
 * 3. Maps Jetpack Compose layout & styling primitives to Figma Auto Layout SceneNodes
 * 4. Runs a deterministic 2-pass Auto Layout solver to compute absoluteBoundingBox (x, y, w, h)
 */
class AstToFigmaTransformer {
    private var idCounter = 1

    fun transformFileToFigma(file: KtFileNode): FigmaNode {
        idCounter = 1
        val primaryComposable = file.declarations.firstOrNull()
            ?: return FigmaNode(id = "1:1", name = "EmptyScreen", type = "FRAME")

        val rootIrNodes = primaryComposable.bodyStatements.map { callToIr(it) }
        val rootIr = if (rootIrNodes.size == 1) {
            rootIrNodes.first()
        } else {
            UiIrNode(
                id = nextId(),
                name = primaryComposable.name,
                type = IrComponentType.COLUMN,
                modifier = ModifierIr(fillMaxWidth = true, padding = PaddingIr(16.0, 16.0, 16.0, 16.0)),
                children = rootIrNodes
            )
        }
        val rawFigmaRoot = irToFigmaNode(rootIr)
        return computeAutoLayoutBounds(rawFigmaRoot, startX = 0.0, startY = 0.0, parentWidth = 360.0)
    }

    private fun callToIr(call: KtCallExprNode): UiIrNode {
        val id = nextId()
        val compType = when (call.calleeName) {
            "Column", "LazyColumn" -> IrComponentType.COLUMN
            "Row", "LazyRow" -> IrComponentType.ROW
            "Box" -> IrComponentType.BOX
            "Card", "ElevatedCard", "OutlinedCard" -> IrComponentType.CARD
            "Surface" -> IrComponentType.SURFACE
            "Button", "FilledTonalButton" -> IrComponentType.BUTTON
            "OutlinedButton", "TextButton" -> IrComponentType.OUTLINED_BUTTON
            "Text" -> IrComponentType.TEXT
            "OutlinedTextField", "TextField" -> IrComponentType.TEXT_FIELD
            "Spacer" -> IrComponentType.SPACER
            "HorizontalDivider", "Divider" -> IrComponentType.DIVIDER
            "Icon" -> IrComponentType.ICON
            "Image" -> IrComponentType.IMAGE
            else -> IrComponentType.BOX
        }

        val modifierArg = findArg(call, "modifier")
        var modifier = modifierArg?.let { parseModifierChain(it.expression) } ?: ModifierIr()

        // Extract arrangement & alignment
        var itemSpacing = 0.0
        var primaryAlign = "MIN"
        var counterAlign = "MIN"

        findArg(call, "verticalArrangement")?.let { arg ->
            val (align, spacing) = parseArrangement(arg.expression)
            primaryAlign = align
            if (spacing > 0) itemSpacing = spacing
        }
        findArg(call, "horizontalArrangement")?.let { arg ->
            val (align, spacing) = parseArrangement(arg.expression)
            primaryAlign = align
            if (spacing > 0) itemSpacing = spacing
        }
        findArg(call, "horizontalAlignment")?.let { arg ->
            counterAlign = parseAlignment(arg.expression)
        }
        findArg(call, "verticalAlignment")?.let { arg ->
            counterAlign = parseAlignment(arg.expression)
        }

        // Card / Surface / Button explicit container color or corner radius
        findArg(call, "shape")?.let { arg ->
            val r = extractFirstNumber(arg.expression)
            if (r != null) modifier = modifier.copy(cornerRadiusDp = r)
        }
        findArg(call, "containerColor")?.let { arg ->
            extractColorHex(arg.expression)?.let { hex ->
                modifier = modifier.copy(backgroundColorHex = hex)
            }
        }

        // Text properties
        val textVal = findArg(call, "text", positionalIndex = 0)?.let { extractString(it.expression) }
            ?: findArg(call, "label")?.let { extractString(it.expression) }
        val fontSize = findArg(call, "fontSize")?.let { extractFirstNumber(it.expression) } ?: 14.0
        val fontWeight = findArg(call, "fontWeight")?.let { exprToString(it.expression).substringAfterLast('.') } ?: "Normal"
        val textColor = findArg(call, "color")?.let { extractColorHex(it.expression) } ?: 0xFF0F172A

        val childCalls = call.trailingLambda?.statements ?: emptyList()
        val children = childCalls.map { callToIr(it) }

        return UiIrNode(
            id = id,
            name = textVal?.take(22) ?: call.calleeName,
            type = compType,
            modifier = modifier,
            textContent = textVal,
            fontSizeSp = fontSize,
            fontWeight = fontWeight,
            textColorHex = textColor,
            itemSpacingDp = itemSpacing,
            primaryAxisAlign = primaryAlign,
            counterAxisAlign = counterAlign,
            children = children
        )
    }

    /**
     * Unrolls a KtDotQualifiedExprNode chain such as:
     * Modifier.fillMaxWidth().padding(16.dp).background(Color(0xFFFFFFFF), RoundedCornerShape(12.dp))
     */
    private fun parseModifierChain(expr: KtExprNode): ModifierIr {
        val calls = mutableListOf<KtCallExprNode>()
        fun collect(node: KtExprNode) {
            when (node) {
                is KtDotQualifiedExprNode -> {
                    collect(node.receiver)
                    collect(node.selector)
                }
                is KtCallExprNode -> calls.add(node)
                else -> {}
            }
        }
        collect(expr)

        var mod = ModifierIr()
        for (c in calls) {
            when (c.calleeName) {
                "fillMaxWidth" -> mod = mod.copy(fillMaxWidth = true)
                "fillMaxHeight" -> mod = mod.copy(fillMaxHeight = true)
                "fillMaxSize" -> mod = mod.copy(fillMaxSize = true, fillMaxWidth = true, fillMaxHeight = true)
                "width" -> extractFirstNumber(c)?.let { mod = mod.copy(widthDp = it) }
                "height" -> extractFirstNumber(c)?.let { mod = mod.copy(heightDp = it) }
                "size" -> {
                    val nums = c.valueArguments.mapNotNull { extractFirstNumber(it.expression) }
                    if (nums.size == 1) mod = mod.copy(widthDp = nums[0], heightDp = nums[0])
                    else if (nums.size >= 2) mod = mod.copy(widthDp = nums[0], heightDp = nums[1])
                }
                "padding" -> {
                    var top = mod.padding.top
                    var right = mod.padding.right
                    var bottom = mod.padding.bottom
                    var left = mod.padding.left
                    for (arg in c.valueArguments) {
                        val v = extractFirstNumber(arg.expression) ?: 0.0
                        when (arg.name) {
                            "horizontal" -> { left = v; right = v }
                            "vertical" -> { top = v; bottom = v }
                            "top" -> top = v
                            "bottom" -> bottom = v
                            "start", "left" -> left = v
                            "end", "right" -> right = v
                            null -> { top = v; right = v; bottom = v; left = v }
                        }
                    }
                    mod = mod.copy(padding = PaddingIr(top, right, bottom, left))
                }
                "background" -> {
                    c.valueArguments.getOrNull(0)?.let { arg ->
                        extractColorHex(arg.expression)?.let { hex ->
                            mod = mod.copy(backgroundColorHex = hex)
                        }
                    }
                    c.valueArguments.getOrNull(1)?.let { shapeArg ->
                        extractFirstNumber(shapeArg.expression)?.let { r ->
                            mod = mod.copy(cornerRadiusDp = r)
                        }
                    }
                }
                "rotate", "graphicsLayer" -> {
                    extractFirstNumber(c)?.let { deg -> mod = mod.copy(rotationDegrees = deg) }
                }
                "verticalScroll" -> {
                    mod = mod.copy(overflowDirection = "VERTICAL_SCROLLING")
                }
                "horizontalScroll" -> {
                    mod = mod.copy(overflowDirection = "HORIZONTAL_SCROLLING")
                }
                "clip" -> {
                    c.valueArguments.firstOrNull()?.let { arg ->
                        extractFirstNumber(arg.expression)?.let { r ->
                            mod = mod.copy(cornerRadiusDp = r)
                        }
                    }
                }
                "border" -> {
                    val w = c.valueArguments.getOrNull(0)?.let { extractFirstNumber(it.expression) } ?: 1.0
                    val col = c.valueArguments.getOrNull(1)?.let { extractColorHex(it.expression) } ?: 0xFFCBD5E1
                    val r = c.valueArguments.getOrNull(2)?.let { extractFirstNumber(it.expression) } ?: mod.cornerRadiusDp
                    mod = mod.copy(borderWidthDp = w, borderColorHex = col, cornerRadiusDp = r)
                }
            }
        }
        return mod
    }

    private fun irToFigmaNode(ir: UiIrNode): FigmaNode {
        if (ir.type == IrComponentType.TEXT) {
            val weightNum = when (ir.fontWeight.lowercase()) {
                "bold" -> 700
                "semibold" -> 600
                "medium" -> 500
                else -> 400
            }
            return FigmaNode(
                id = ir.id,
                name = ir.name,
                type = "TEXT",
                characters = ir.textContent ?: "Text",
                fills = listOf(hexToFigmaPaint(ir.textColorHex)),
                style = FigmaTypeStyle(
                    fontFamily = "Inter",
                    fontPostScriptName = if (weightNum >= 600) "Inter-Bold" else "Inter-Regular",
                    fontWeight = weightNum,
                    fontSize = ir.fontSizeSp,
                    lineHeightPx = ir.fontSizeSp * 1.4
                ),
                layoutSizingHorizontal = if (ir.modifier.fillMaxWidth) "FILL" else "HUG",
                layoutSizingVertical = "HUG"
            )
        }

        if (ir.type == IrComponentType.SPACER || ir.type == IrComponentType.DIVIDER) {
            val isDivider = ir.type == IrComponentType.DIVIDER
            return FigmaNode(
                id = ir.id,
                name = if (isDivider) "HorizontalDivider" else "Spacer",
                type = "RECTANGLE",
                fills = if (isDivider) listOf(hexToFigmaPaint(0xFFE2E8F0)) else emptyList(),
                layoutSizingHorizontal = if (ir.modifier.fillMaxWidth || isDivider) "FILL" else "FIXED",
                layoutSizingVertical = "FIXED",
                absoluteBoundingBox = FigmaBoundingBox(
                    x = 0.0, y = 0.0,
                    width = ir.modifier.widthDp ?: 320.0,
                    height = ir.modifier.heightDp ?: if (isDivider) 1.0 else 12.0
                )
            )
        }

        val layoutMode = when (ir.type) {
            IrComponentType.COLUMN, IrComponentType.CARD, IrComponentType.SURFACE -> "VERTICAL"
            IrComponentType.ROW, IrComponentType.BUTTON, IrComponentType.OUTLINED_BUTTON -> "HORIZONTAL"
            else -> "NONE"
        }

        val defaultBg = when (ir.type) {
            IrComponentType.CARD, IrComponentType.SURFACE -> 0xFFFFFFFF
            IrComponentType.BUTTON -> 0xFF4F46E5
            IrComponentType.TEXT_FIELD -> 0xFFF8FAFC
            else -> null
        }
        val bgHex = ir.modifier.backgroundColorHex ?: defaultBg
        val fills = if (bgHex != null) listOf(hexToFigmaPaint(bgHex)) else emptyList()

        val defaultStroke = when (ir.type) {
            IrComponentType.OUTLINED_BUTTON, IrComponentType.TEXT_FIELD -> 0xFFCBD5E1
            else -> null
        }
        val strokeHex = ir.modifier.borderColorHex ?: defaultStroke
        val strokes = if (strokeHex != null) listOf(hexToFigmaPaint(strokeHex)) else emptyList()
        val strokeWeight = if (ir.modifier.borderWidthDp > 0) ir.modifier.borderWidthDp else if (strokeHex != null) 1.0 else 0.0

        val defaultRadius = when (ir.type) {
            IrComponentType.CARD -> 16.0
            IrComponentType.BUTTON, IrComponentType.OUTLINED_BUTTON -> 24.0
            IrComponentType.TEXT_FIELD -> 10.0
            else -> 0.0
        }
        val radius = if (ir.modifier.cornerRadiusDp > 0) ir.modifier.cornerRadiusDp else defaultRadius

        val padTop = if (ir.modifier.padding.top > 0) ir.modifier.padding.top else if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) 12.0 else 0.0
        val padBottom = if (ir.modifier.padding.bottom > 0) ir.modifier.padding.bottom else if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) 12.0 else 0.0
        val padLeft = if (ir.modifier.padding.left > 0) ir.modifier.padding.left else if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) 20.0 else 0.0
        val padRight = if (ir.modifier.padding.right > 0) ir.modifier.padding.right else if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) 20.0 else 0.0

        val figmaChildren = ir.children.map { irToFigmaNode(it) }.toMutableList()
        if ((ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON || ir.type == IrComponentType.TEXT_FIELD) && figmaChildren.isEmpty() && ir.textContent != null) {
            figmaChildren.add(
                FigmaNode(
                    id = nextId(),
                    name = ir.textContent,
                    type = "TEXT",
                    characters = ir.textContent,
                    fills = listOf(hexToFigmaPaint(if (ir.type == IrComponentType.BUTTON) 0xFFFFFFFF else 0xFF1E293B)),
                    style = FigmaTypeStyle(fontSize = 14.0, fontWeight = 600)
                )
            )
        }

        return FigmaNode(
            id = ir.id,
            name = ir.type.name.lowercase().replaceFirstChar { it.uppercase() } + "_" + ir.name.replace(" ", ""),
            type = "FRAME",
            layoutMode = layoutMode,
            primaryAxisAlignItems = if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) "CENTER" else ir.primaryAxisAlign,
            counterAxisAlignItems = if (ir.type == IrComponentType.BUTTON || ir.type == IrComponentType.OUTLINED_BUTTON) "CENTER" else ir.counterAxisAlign,
            layoutSizingHorizontal = if (ir.modifier.fillMaxWidth) "FILL" else if (ir.modifier.widthDp != null) "FIXED" else "HUG",
            layoutSizingVertical = if (ir.modifier.heightDp != null) "FIXED" else "HUG",
            paddingTop = padTop,
            paddingRight = padRight,
            paddingBottom = padBottom,
            paddingLeft = padLeft,
            itemSpacing = ir.itemSpacingDp,
            cornerRadius = radius,
            rotation = ir.modifier.rotationDegrees,
            overflowDirection = ir.modifier.overflowDirection,
            fills = fills,
            strokes = strokes,
            strokeWeight = strokeWeight,
            absoluteBoundingBox = FigmaBoundingBox(
                x = 0.0,
                y = 0.0,
                width = ir.modifier.widthDp ?: if (ir.modifier.fillMaxWidth) 360.0 else 200.0,
                height = ir.modifier.heightDp ?: 48.0
            ),
            children = figmaChildren
        )
    }

    private fun computeAutoLayoutBounds(node: FigmaNode, startX: Double, startY: Double, parentWidth: Double): FigmaNode {
        if (node.type == "TEXT") {
            val fs = node.style?.fontSize ?: 14.0
            val textLen = (node.characters ?: "").length
            val w = if (node.layoutSizingHorizontal == "FILL") parentWidth else (textLen * fs * 0.56).coerceAtLeast(28.0)
            val h = (fs * 1.4).coerceAtLeast(18.0)
            return node.copy(absoluteBoundingBox = FigmaBoundingBox(startX, startY, w, h))
        }
        if (node.type == "RECTANGLE") {
            val prev = node.absoluteBoundingBox ?: FigmaBoundingBox(startX, startY, parentWidth, 12.0)
            val w = if (node.layoutSizingHorizontal == "FILL") parentWidth else prev.width
            return node.copy(absoluteBoundingBox = FigmaBoundingBox(startX, startY, w, prev.height))
        }

        val frameWidth = if (node.layoutSizingHorizontal == "FILL") parentWidth else node.absoluteBoundingBox?.width ?: parentWidth
        val innerWidth = (frameWidth - node.paddingLeft - node.paddingRight).coerceAtLeast(40.0)
        var cursorX = startX + node.paddingLeft
        var cursorY = startY + node.paddingTop
        var maxRowHeight = 0.0
        val laidOutChildren = mutableListOf<FigmaNode>()

        for ((index, child) in node.children.withIndex()) {
            val laidOut = computeAutoLayoutBounds(child, cursorX, cursorY, innerWidth)
            val box = laidOut.absoluteBoundingBox ?: FigmaBoundingBox(cursorX, cursorY, 80.0, 24.0)
            laidOutChildren.add(laidOut)
            if (node.layoutMode == "HORIZONTAL") {
                cursorX += box.width + if (index < node.children.size - 1) node.itemSpacing else 0.0
                if (box.height > maxRowHeight) maxRowHeight = box.height
            } else {
                cursorY += box.height + if (index < node.children.size - 1) node.itemSpacing else 0.0
            }
        }

        val totalHeight = if (node.layoutMode == "HORIZONTAL") {
            node.paddingTop + maxRowHeight + node.paddingBottom
        } else {
            (cursorY - startY) + node.paddingBottom
        }.coerceAtLeast(node.absoluteBoundingBox?.height ?: 36.0)

        return node.copy(
            absoluteBoundingBox = FigmaBoundingBox(startX, startY, frameWidth, totalHeight),
            children = laidOutChildren
        )
    }

    private fun parseArrangement(expr: KtExprNode): Pair<String, Double> {
        val str = exprToString(expr)
        return when {
            str.contains("SpaceBetween") -> "SPACE_BETWEEN" to 0.0
            str.contains("Center") -> "CENTER" to 0.0
            str.contains("End") || str.contains("Bottom") -> "MAX" to 0.0
            str.contains("spacedBy") -> "MIN" to (extractFirstNumber(expr) ?: 8.0)
            else -> "MIN" to 0.0
        }
    }

    private fun parseAlignment(expr: KtExprNode): String {
        val str = exprToString(expr)
        return when {
            str.contains("Center") -> "CENTER"
            str.contains("End") || str.contains("Bottom") -> "MAX"
            else -> "MIN"
        }
    }

    private fun findArg(call: KtCallExprNode, name: String, positionalIndex: Int? = null): KtValueArgNode? {
        call.valueArguments.firstOrNull { it.name == name }?.let { return it }
        if (positionalIndex != null && positionalIndex < call.valueArguments.size) {
            val candidate = call.valueArguments[positionalIndex]
            if (candidate.name == null) return candidate
        }
        return null
    }

    private fun extractString(expr: KtExprNode): String? = when (expr) {
        is KtStringLiteralNode -> expr.value
        else -> null
    }

    private fun extractFirstNumber(expr: KtExprNode): Double? = when (expr) {
        is KtNumberLiteralNode -> expr.value
        is KtDotQualifiedExprNode -> extractFirstNumber(expr.receiver) ?: extractFirstNumber(expr.selector)
        is KtCallExprNode -> expr.valueArguments.firstNotNullOfOrNull { extractFirstNumber(it.expression) }
        else -> null
    }

    private fun extractColorHex(expr: KtExprNode): Long? = when (expr) {
        is KtCallExprNode -> expr.valueArguments.firstOrNull()?.let { arg ->
            (arg.expression as? KtNumberLiteralNode)?.value?.toLong()
        }
        is KtDotQualifiedExprNode -> {
            val name = exprToString(expr).substringAfterLast('.')
            when (name) {
                "White" -> 0xFFFFFFFF
                "Black" -> 0xFF000000
                "Gray", "LightGray" -> 0xFF94A3B8
                "Blue" -> 0xFF2563EB
                "Red" -> 0xFFEF4444
                "Green" -> 0xFF10B981
                else -> null
            }
        }
        else -> null
    }

    private fun exprToString(expr: KtExprNode): String = when (expr) {
        is KtReferenceExprNode -> expr.identifier
        is KtDotQualifiedExprNode -> "${exprToString(expr.receiver)}.${exprToString(expr.selector)}"
        is KtCallExprNode -> "${expr.calleeName}(...)"
        is KtStringLiteralNode -> expr.value
        is KtNumberLiteralNode -> expr.value.toString()
        is KtBooleanLiteralNode -> expr.value.toString()
        is KtLambdaExprNode -> "{}"
    }

    private fun hexToFigmaPaint(hex: Long): FigmaPaint {
        val a = ((hex shr 24) and 0xFF) / 255.0
        val r = ((hex shr 16) and 0xFF) / 255.0
        val g = ((hex shr 8) and 0xFF) / 255.0
        val b = (hex and 0xFF) / 255.0
        return FigmaPaint(color = FigmaColor(r, g, b, if (a == 0.0) 1.0 else a))
    }

    private fun nextId(): String = "1:${idCounter++}"
}
