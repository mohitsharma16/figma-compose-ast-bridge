package com.figmacompose.ast.model

import kotlinx.serialization.Serializable

/**
 * ============================================================================
 * 1. KOTLIN AST MODEL (Mirrors org.jetbrains.kotlin.psi.KtElement hierarchy)
 * ============================================================================
 */
sealed class KtAstNode {
    abstract val nodeType: String
}

data class KtFileNode(
    val packageName: String = "com.example.ui",
    val imports: List<String> = emptyList(),
    val declarations: List<KtFunctionDeclNode> = emptyList()
) : KtAstNode() {
    override val nodeType: String = "KtFile"
}

data class KtAnnotationNode(
    val name: String,
    val arguments: List<KtValueArgNode> = emptyList()
) : KtAstNode() {
    override val nodeType: String = "KtAnnotationEntry"
}

data class KtParameterNode(
    val name: String,
    val typeName: String,
    val defaultValue: KtExprNode? = null
) : KtAstNode() {
    override val nodeType: String = "KtParameter"
}

data class KtFunctionDeclNode(
    val name: String,
    val annotations: List<KtAnnotationNode> = listOf(KtAnnotationNode("Composable")),
    val parameters: List<KtParameterNode> = emptyList(),
    val bodyStatements: List<KtCallExprNode> = emptyList()
) : KtAstNode() {
    override val nodeType: String = "KtNamedFunction"
}

sealed class KtExprNode : KtAstNode()

data class KtCallExprNode(
    val calleeName: String,
    val valueArguments: List<KtValueArgNode> = emptyList(),
    val trailingLambda: KtLambdaExprNode? = null
) : KtExprNode() {
    override val nodeType: String = "KtCallExpression"
}

data class KtValueArgNode(
    val name: String? = null, // null for positional arguments
    val expression: KtExprNode
) : KtAstNode() {
    override val nodeType: String = "KtValueArgument"
}

data class KtDotQualifiedExprNode(
    val receiver: KtExprNode,
    val selector: KtExprNode
) : KtExprNode() {
    override val nodeType: String = "KtDotQualifiedExpression"
}

data class KtLambdaExprNode(
    val parameters: List<String> = emptyList(),
    val statements: List<KtCallExprNode> = emptyList()
) : KtExprNode() {
    override val nodeType: String = "KtLambdaExpression"
}

data class KtStringLiteralNode(val value: String) : KtExprNode() {
    override val nodeType: String = "KtStringTemplateExpression"
}

data class KtNumberLiteralNode(val value: Double, val isInt: Boolean = false) : KtExprNode() {
    override val nodeType: String = "KtConstantExpression(Number)"
}

data class KtBooleanLiteralNode(val value: Boolean) : KtExprNode() {
    override val nodeType: String = "KtConstantExpression(Boolean)"
}

data class KtReferenceExprNode(val identifier: String) : KtExprNode() {
    override val nodeType: String = "KtNameReferenceExpression"
}

/**
 * ============================================================================
 * 2. UNIFIED UI INTERMEDIATE REPRESENTATION (IR)
 * Bridges Kotlin AST (Jetpack Compose) <-> Figma SceneGraph Nodes
 * ============================================================================
 */
enum class IrComponentType {
    COLUMN, ROW, BOX, CARD, SURFACE, BUTTON, OUTLINED_BUTTON, TEXT, TEXT_FIELD, ICON, IMAGE, SPACER, DIVIDER
}

data class PaddingIr(
    val top: Double = 0.0,
    val right: Double = 0.0,
    val bottom: Double = 0.0,
    val left: Double = 0.0
)

data class ModifierIr(
    val fillMaxWidth: Boolean = false,
    val fillMaxHeight: Boolean = false,
    val fillMaxSize: Boolean = false,
    val widthDp: Double? = null,
    val heightDp: Double? = null,
    val padding: PaddingIr = PaddingIr(),
    val backgroundColorHex: Long? = null,
    val cornerRadiusDp: Double = 0.0,
    val borderWidthDp: Double = 0.0,
    val borderColorHex: Long? = null,
    val elevationDp: Double = 0.0,
    val rotationDegrees: Double = 0.0,
    val overflowDirection: String = "NONE",
    val alpha: Double = 1.0
)

data class UiIrNode(
    val id: String,
    val name: String,
    val type: IrComponentType,
    val modifier: ModifierIr = ModifierIr(),
    val textContent: String? = null,
    val fontSizeSp: Double = 14.0,
    val fontWeight: String = "Normal",
    val textColorHex: Long = 0xFF0F172A,
    val itemSpacingDp: Double = 0.0,
    val primaryAxisAlign: String = "MIN",   // MIN, CENTER, MAX, SPACE_BETWEEN
    val counterAxisAlign: String = "MIN",   // MIN, CENTER, MAX
    val children: List<UiIrNode> = emptyList()
)

/**
 * ============================================================================
 * 3. FIGMA REST / PLUGIN API SCENE NODE SCHEMA
 * ============================================================================
 */
@Serializable
data class FigmaColor(
    val r: Double,
    val g: Double,
    val b: Double,
    val a: Double = 1.0
)

@Serializable
data class FigmaPaint(
    val type: String = "SOLID",
    val visible: Boolean = true,
    val opacity: Double = 1.0,
    val color: FigmaColor
)

@Serializable
data class FigmaBoundingBox(
    val x: Double,
    val y: Double,
    val width: Double,
    val height: Double
)

@Serializable
data class FigmaTypeStyle(
    val fontFamily: String = "Inter",
    val fontPostScriptName: String = "Inter-Regular",
    val fontWeight: Int = 400,
    val fontSize: Double = 14.0,
    val textAlignHorizontal: String = "LEFT",
    val textAlignVertical: String = "TOP",
    val letterSpacing: Double = 0.0,
    val lineHeightPx: Double = 20.0
)

@Serializable
data class FigmaNode(
    val id: String,
    val name: String,
    val type: String, // DOCUMENT, CANVAS, FRAME, COMPONENT, INSTANCE, TEXT, RECTANGLE
    val visible: Boolean = true,
    val opacity: Double = 1.0,
    val layoutMode: String? = null, // VERTICAL, HORIZONTAL, NONE
    val primaryAxisSizingMode: String? = null, // FIXED, AUTO
    val counterAxisSizingMode: String? = null, // FIXED, AUTO
    val primaryAxisAlignItems: String? = null, // MIN, CENTER, MAX, SPACE_BETWEEN
    val counterAxisAlignItems: String? = null, // MIN, CENTER, MAX
    val layoutSizingHorizontal: String? = null, // FIXED, HUG, FILL
    val layoutSizingVertical: String? = null,   // FIXED, HUG, FILL
    val paddingTop: Double = 0.0,
    val paddingRight: Double = 0.0,
    val paddingBottom: Double = 0.0,
    val paddingLeft: Double = 0.0,
    val itemSpacing: Double = 0.0,
    val cornerRadius: Double = 0.0,
    val rotation: Double = 0.0,
    val overflowDirection: String = "NONE",
    val fills: List<FigmaPaint> = emptyList(),
    val strokes: List<FigmaPaint> = emptyList(),
    val strokeWeight: Double = 0.0,
    val characters: String? = null,
    val style: FigmaTypeStyle? = null,
    val absoluteBoundingBox: FigmaBoundingBox? = null,
    val children: List<FigmaNode> = emptyList()
)
