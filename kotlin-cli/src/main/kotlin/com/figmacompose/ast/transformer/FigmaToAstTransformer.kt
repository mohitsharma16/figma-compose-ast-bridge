package com.figmacompose.ast.transformer

import com.figmacompose.ast.model.*
import kotlin.math.roundToInt

/**
 * ============================================================================
 * FIGMA SCENEGRAPH -> KOTLIN AST -> JETPACK COMPOSE TRANSFORMER
 * ============================================================================
 * 1. Traverses a Figma Node hierarchy (FRAME, COMPONENT, INSTANCE, TEXT, RECTANGLE)
 * 2. Infers Jetpack Compose Composable calls (Column, Row, Box, Card, Button, Text, Spacer)
 * 3. Synthesizes a KtDotQualifiedExprNode Modifier AST chain for sizing, padding, background,
 *    cornerRadius, and stroke borders
 * 4. Produces a complete KtFileNode AST ready for KotlinAstCodeEmitter
 */
class FigmaToAstTransformer {

    fun transformFigmaToAst(rootNode: FigmaNode, composableName: String = "GeneratedFigmaScreen"): KtFileNode {
        val unwrappedRoot = when (rootNode.type) {
            "DOCUMENT" -> rootNode.children.firstOrNull()?.children?.firstOrNull() ?: rootNode
            "CANVAS" -> rootNode.children.firstOrNull() ?: rootNode
            else -> rootNode
        }
        val rootCall = figmaNodeToCallAst(unwrappedRoot)
        val fnDecl = KtFunctionDeclNode(
            name = composableName,
            annotations = listOf(KtAnnotationNode("Composable")),
            parameters = listOf(
                KtParameterNode("modifier", "Modifier", KtReferenceExprNode("Modifier"))
            ),
            bodyStatements = listOf(rootCall)
        )
        return KtFileNode(
            packageName = "com.example.generated",
            declarations = listOf(fnDecl)
        )
    }

    private fun figmaNodeToCallAst(node: FigmaNode): KtCallExprNode {
        if (node.type == "TEXT") {
            val args = mutableListOf<KtValueArgNode>()
            args.add(KtValueArgNode("text", KtStringLiteralNode(node.characters ?: node.name)))
            node.style?.fontSize?.let { fs ->
                args.add(
                    KtValueArgNode(
                        "fontSize",
                        KtDotQualifiedExprNode(KtNumberLiteralNode(fs, fs % 1.0 == 0.0), KtReferenceExprNode("sp"))
                    )
                )
            }
            node.style?.fontWeight?.let { fw ->
                val weightName = when {
                    fw >= 700 -> "Bold"
                    fw >= 600 -> "SemiBold"
                    fw >= 500 -> "Medium"
                    else -> "Normal"
                }
                if (weightName != "Normal") {
                    args.add(
                        KtValueArgNode(
                            "fontWeight",
                            KtDotQualifiedExprNode(KtReferenceExprNode("FontWeight"), KtReferenceExprNode(weightName))
                        )
                    )
                }
            }
            node.fills.firstOrNull { it.visible }?.let { paint ->
                args.add(KtValueArgNode("color", figmaColorToAstCall(paint.color)))
            }
            return KtCallExprNode("Text", args)
        }

        if (node.type == "RECTANGLE") {
            val h = node.absoluteBoundingBox?.height ?: 12.0
            if (h <= 2.0 && node.fills.isNotEmpty()) {
                return KtCallExprNode("HorizontalDivider", listOf(
                    KtValueArgNode("color", figmaColorToAstCall(node.fills.first().color))
                ))
            }
            val mod = KtDotQualifiedExprNode(
                KtReferenceExprNode("Modifier"),
                KtCallExprNode("height", listOf(KtValueArgNode(null, dpLiteral(h))))
            )
            return KtCallExprNode("Spacer", listOf(KtValueArgNode("modifier", mod)))
        }

        // Determine container Composable from Figma node name & Auto Layout properties
        val lowerName = node.name.lowercase()
        val isButton = lowerName.contains("button") || lowerName.contains("btn") || lowerName.contains("cta")
        val callee = when {
            isButton && node.strokes.isNotEmpty() && node.fills.isEmpty() -> "OutlinedButton"
            isButton -> "Button"
            node.layoutMode == "HORIZONTAL" -> "Row"
            node.layoutMode == "VERTICAL" -> "Column"
            else -> "Box"
        }

        val args = mutableListOf<KtValueArgNode>()
        if (isButton) {
            args.add(KtValueArgNode("onClick", KtLambdaExprNode()))
        }

        buildModifierAst(node, isButton)?.let { modExpr ->
            args.add(KtValueArgNode("modifier", modExpr))
        }

        if (!isButton) {
            if (node.layoutMode == "VERTICAL") {
                if (node.itemSpacing > 0) {
                    args.add(
                        KtValueArgNode(
                            "verticalArrangement",
                            KtDotQualifiedExprNode(
                                KtReferenceExprNode("Arrangement"),
                                KtCallExprNode("spacedBy", listOf(KtValueArgNode(null, dpLiteral(node.itemSpacing))))
                            )
                        )
                    )
                } else if (node.primaryAxisAlignItems == "SPACE_BETWEEN") {
                    args.add(
                        KtValueArgNode(
                            "verticalArrangement",
                            KtDotQualifiedExprNode(KtReferenceExprNode("Arrangement"), KtReferenceExprNode("SpaceBetween"))
                        )
                    )
                }
                if (node.counterAxisAlignItems == "CENTER") {
                    args.add(
                        KtValueArgNode(
                            "horizontalAlignment",
                            KtDotQualifiedExprNode(KtReferenceExprNode("Alignment"), KtReferenceExprNode("CenterHorizontally"))
                        )
                    )
                }
            } else if (node.layoutMode == "HORIZONTAL") {
                if (node.itemSpacing > 0) {
                    args.add(
                        KtValueArgNode(
                            "horizontalArrangement",
                            KtDotQualifiedExprNode(
                                KtReferenceExprNode("Arrangement"),
                                KtCallExprNode("spacedBy", listOf(KtValueArgNode(null, dpLiteral(node.itemSpacing))))
                            )
                        )
                    )
                } else if (node.primaryAxisAlignItems == "SPACE_BETWEEN") {
                    args.add(
                        KtValueArgNode(
                            "horizontalArrangement",
                            KtDotQualifiedExprNode(KtReferenceExprNode("Arrangement"), KtReferenceExprNode("SpaceBetween"))
                        )
                    )
                }
                if (node.counterAxisAlignItems == "CENTER") {
                    args.add(
                        KtValueArgNode(
                            "verticalAlignment",
                            KtDotQualifiedExprNode(KtReferenceExprNode("Alignment"), KtReferenceExprNode("CenterVertically"))
                        )
                    )
                }
            }
        }

        val childCalls = node.children.filter { it.visible }.map { figmaNodeToCallAst(it) }
        return KtCallExprNode(
            calleeName = callee,
            valueArguments = args,
            trailingLambda = KtLambdaExprNode(statements = childCalls)
        )
    }

    private fun buildModifierAst(node: FigmaNode, isButton: Boolean): KtExprNode? {
        var chain: KtExprNode = KtReferenceExprNode("Modifier")
        var count = 0

        fun appendCall(name: String, args: List<KtValueArgNode>) {
            chain = KtDotQualifiedExprNode(chain, KtCallExprNode(name, args))
            count++
        }

        if (node.layoutSizingHorizontal == "FILL") {
            appendCall("fillMaxWidth", emptyList())
        } else if (node.layoutSizingHorizontal == "FIXED" && node.absoluteBoundingBox != null) {
            appendCall("width", listOf(KtValueArgNode(null, dpLiteral(node.absoluteBoundingBox.width))))
        }

        if (!isButton) {
            node.fills.firstOrNull { it.visible }?.let { paint ->
                val bgArgs = mutableListOf(KtValueArgNode(null, figmaColorToAstCall(paint.color)))
                if (node.cornerRadius > 0) {
                    bgArgs.add(
                        KtValueArgNode(
                            null,
                            KtCallExprNode("RoundedCornerShape", listOf(KtValueArgNode(null, dpLiteral(node.cornerRadius))))
                        )
                    )
                }
                appendCall("background", bgArgs)
            }
            node.strokes.firstOrNull { it.visible }?.let { stroke ->
                val sw = if (node.strokeWeight > 0) node.strokeWeight else 1.0
                val borderArgs = mutableListOf(
                    KtValueArgNode(null, dpLiteral(sw)),
                    KtValueArgNode(null, figmaColorToAstCall(stroke.color))
                )
                if (node.cornerRadius > 0) {
                    borderArgs.add(
                        KtValueArgNode(
                            null,
                            KtCallExprNode("RoundedCornerShape", listOf(KtValueArgNode(null, dpLiteral(node.cornerRadius))))
                        )
                    )
                }
                appendCall("border", borderArgs)
            }

            val pt = node.paddingTop
            val pr = node.paddingRight
            val pb = node.paddingBottom
            val pl = node.paddingLeft
            if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {
                if (pt == pr && pr == pb && pb == pl) {
                    appendCall("padding", listOf(KtValueArgNode(null, dpLiteral(pt))))
                } else if (pt == pb && pl == pr) {
                    val pArgs = mutableListOf<KtValueArgNode>()
                    if (pl > 0) pArgs.add(KtValueArgNode("horizontal", dpLiteral(pl)))
                    if (pt > 0) pArgs.add(KtValueArgNode("vertical", dpLiteral(pt)))
                    appendCall("padding", pArgs)
                } else {
                    appendCall(
                        "padding",
                        listOf(
                            KtValueArgNode("start", dpLiteral(pl)),
                            KtValueArgNode("top", dpLiteral(pt)),
                            KtValueArgNode("end", dpLiteral(pr)),
                            KtValueArgNode("bottom", dpLiteral(pb))
                        )
                    )
                }
            }
        }

        if (node.rotation != 0.0) {
            appendCall("rotate", listOf(KtValueArgNode(null, KtNumberLiteralNode(node.rotation))))
        }
        if (node.overflowDirection == "VERTICAL_SCROLLING") {
            appendCall("verticalScroll", listOf(KtValueArgNode(null, KtCallExprNode("rememberScrollState"))))
        } else if (node.overflowDirection == "HORIZONTAL_SCROLLING") {
            appendCall("horizontalScroll", listOf(KtValueArgNode(null, KtCallExprNode("rememberScrollState"))))
        }
        return if (count > 0) chain else null
    }

    private fun dpLiteral(value: Double): KtDotQualifiedExprNode =
        KtDotQualifiedExprNode(KtNumberLiteralNode(value, value % 1.0 == 0.0), KtReferenceExprNode("dp"))

    private fun figmaColorToAstCall(c: FigmaColor): KtCallExprNode {
        val a = (c.a * 255).roundToInt().coerceIn(0, 255)
        val r = (c.r * 255).roundToInt().coerceIn(0, 255)
        val g = (c.g * 255).roundToInt().coerceIn(0, 255)
        val b = (c.b * 255).roundToInt().coerceIn(0, 255)
        val hexStr = String.format("0x%02X%02X%02X%02X", a, r, g, b)
        return KtCallExprNode("Color", listOf(KtValueArgNode(null, KtReferenceExprNode(hexStr))))
    }
}
