package com.figmacompose.ast.parser

import com.figmacompose.ast.model.*

/**
 * ============================================================================
 * KOTLIN LEXER & RECURSIVE-DESCENT AST PARSER + COMPILER PSI ADAPTER
 * ============================================================================
 * Parses Jetpack Compose Kotlin source code into a typed KtFileNode AST:
 * - Package & Import directives
 * - @Composable / @Preview KtAnnotationNode entries
 * - KtFunctionDeclNode declarations with parameters & default values
 * - Nested KtCallExprNode invocations (Column, Row, Box, Card, Text, Button...)
 * - Named & positional KtValueArgNode arguments
 * - Chained KtDotQualifiedExprNode expressions (e.g. Modifier.fillMaxWidth().padding(16.dp))
 * - Trailing KtLambdaExprNode composable content blocks
 */

enum class TokenType {
    KEYWORD, IDENTIFIER, AT_ANNOTATION, STRING, NUMBER,
    LPAREN, RPAREN, LBRACE, RBRACE, COMMA, DOT, COLON, EQUALS, ARROW, EOF
}

data class Token(
    val type: TokenType,
    val lexeme: String,
    val line: Int,
    val column: Int
)

class KotlinLexer(private val source: String) {
    private var pos = 0
    private var line = 1
    private var col = 1

    private val keywords = setOf("package", "import", "fun", "val", "var", "true", "false", "null")

    fun tokenize(): List<Token> {
        val tokens = mutableListOf<Token>()
        while (pos < source.length) {
            val ch = source[pos]
            when {
                ch == '\n' -> { pos++; line++; col = 1 }
                ch.isWhitespace() -> { pos++; col++ }
                ch == '/' && peek(1) == '/' -> {
                    while (pos < source.length && source[pos] != '\n') { pos++; col++ }
                }
                ch == '/' && peek(1) == '*' -> {
                    pos += 2; col += 2
                    while (pos < source.length && !(source[pos] == '*' && peek(1) == '/')) {
                        if (source[pos] == '\n') { line++; col = 1 } else col++
                        pos++
                    }
                    if (pos < source.length) { pos += 2; col += 2 }
                }
                ch == '@' -> {
                    val startCol = col
                    pos++; col++
                    val sb = StringBuilder()
                    while (pos < source.length && (source[pos].isLetterOrDigit() || source[pos] == '_')) {
                        sb.append(source[pos]); pos++; col++
                    }
                    tokens.add(Token(TokenType.AT_ANNOTATION, sb.toString(), line, startCol))
                }
                ch == '"' -> {
                    val startCol = col
                    pos++; col++
                    val sb = StringBuilder()
                    while (pos < source.length && source[pos] != '"') {
                        if (source[pos] == '\\' && pos + 1 < source.length) {
                            pos++; col++
                        }
                        sb.append(source[pos]); pos++; col++
                    }
                    if (pos < source.length) { pos++; col++ }
                    tokens.add(Token(TokenType.STRING, sb.toString(), line, startCol))
                }
                ch.isDigit() || (ch == '-' && peek(1)?.isDigit() == true) -> {
                    val startCol = col
                    val sb = StringBuilder()
                    if (ch == '-') { sb.append(ch); pos++; col++ }
                    if (source[pos] == '0' && (peek(1) == 'x' || peek(1) == 'X')) {
                        sb.append("0x"); pos += 2; col += 2
                        while (pos < source.length && (source[pos].isDigit() || source[pos].lowercaseChar() in 'a'..'f' || source[pos] == '_')) {
                            if (source[pos] != '_') sb.append(source[pos])
                            pos++; col++
                        }
                    } else {
                        while (pos < source.length && (source[pos].isDigit() || source[pos] == '.')) {
                            if (source[pos] == '.' && peek(1)?.isDigit() != true) break
                            sb.append(source[pos]); pos++; col++
                        }
                        if (pos < source.length && (source[pos] == 'f' || source[pos] == 'F')) {
                            pos++; col++
                        }
                    }
                    tokens.add(Token(TokenType.NUMBER, sb.toString(), line, startCol))
                }
                ch.isLetter() || ch == '_' -> {
                    val startCol = col
                    val sb = StringBuilder()
                    while (pos < source.length && (source[pos].isLetterOrDigit() || source[pos] == '_')) {
                        sb.append(source[pos]); pos++; col++
                    }
                    val word = sb.toString()
                    val type = if (word in keywords) TokenType.KEYWORD else TokenType.IDENTIFIER
                    tokens.add(Token(type, word, line, startCol))
                }
                ch == '-' && peek(1) == '>' -> {
                    tokens.add(Token(TokenType.ARROW, "->", line, col))
                    pos += 2; col += 2
                }
                ch == '(' -> { tokens.add(Token(TokenType.LPAREN, "(", line, col)); pos++; col++ }
                ch == ')' -> { tokens.add(Token(TokenType.RPAREN, ")", line, col)); pos++; col++ }
                ch == '{' -> { tokens.add(Token(TokenType.LBRACE, "{", line, col)); pos++; col++ }
                ch == '}' -> { tokens.add(Token(TokenType.RBRACE, "}", line, col)); pos++; col++ }
                ch == ',' -> { tokens.add(Token(TokenType.COMMA, ",", line, col)); pos++; col++ }
                ch == '.' -> { tokens.add(Token(TokenType.DOT, ".", line, col)); pos++; col++ }
                ch == ':' -> { tokens.add(Token(TokenType.COLON, ":", line, col)); pos++; col++ }
                ch == '=' -> { tokens.add(Token(TokenType.EQUALS, "=", line, col)); pos++; col++ }
                else -> { pos++; col++ }
            }
        }
        tokens.add(Token(TokenType.EOF, "", line, col))
        return tokens
    }

    private fun peek(offset: Int): Char? =
        if (pos + offset < source.length) source[pos + offset] else null
}

class KotlinComposeAstParser(private val tokens: List<Token>) {
    private var idx = 0

    companion object {
        fun parseSource(source: String): KtFileNode {
            val tokens = KotlinLexer(source).tokenize()
            return KotlinComposeAstParser(tokens).parseFile()
        }
    }

    fun parseFile(): KtFileNode {
        var packageName = "com.example.ui"
        val imports = mutableListOf<String>()
        val functions = mutableListOf<KtFunctionDeclNode>()

        while (!isAtEnd()) {
            when {
                checkKeyword("package") -> {
                    advance()
                    packageName = parseQualifiedIdentifier()
                }
                checkKeyword("import") -> {
                    advance()
                    imports.add(parseQualifiedIdentifier())
                }
                check(TokenType.AT_ANNOTATION) || checkKeyword("fun") -> {
                    functions.add(parseFunctionDeclaration())
                }
                else -> advance()
            }
        }
        return KtFileNode(packageName, imports, functions)
    }

    private fun parseFunctionDeclaration(): KtFunctionDeclNode {
        val annotations = mutableListOf<KtAnnotationNode>()
        while (check(TokenType.AT_ANNOTATION)) {
            val annName = advance().lexeme
            val annArgs = if (match(TokenType.LPAREN)) parseValueArgumentList() else emptyList()
            annotations.add(KtAnnotationNode(annName, annArgs))
        }
        if (checkKeyword("fun")) advance()
        val fnName = if (check(TokenType.IDENTIFIER)) advance().lexeme else "GeneratedScreen"
        val params = mutableListOf<KtParameterNode>()
        if (match(TokenType.LPAREN)) {
            while (!check(TokenType.RPAREN) && !isAtEnd()) {
                if (check(TokenType.IDENTIFIER)) {
                    val pName = advance().lexeme
                    var pType = "Any"
                    if (match(TokenType.COLON)) {
                        pType = parseQualifiedIdentifier()
                    }
                    var defaultExpr: KtExprNode? = null
                    if (match(TokenType.EQUALS)) {
                        defaultExpr = parseExpression()
                    }
                    params.add(KtParameterNode(pName, pType, defaultExpr))
                }
                if (!match(TokenType.COMMA)) break
            }
            match(TokenType.RPAREN)
        }
        val bodyStatements = mutableListOf<KtCallExprNode>()
        if (match(TokenType.LBRACE)) {
            while (!check(TokenType.RBRACE) && !isAtEnd()) {
                if (checkKeyword("val") || checkKeyword("var")) {
                    // Skip local variable assignment up to next Composable statement
                    advance()
                    if (check(TokenType.IDENTIFIER)) advance()
                    if (match(TokenType.EQUALS)) parseExpression()
                } else {
                    val expr = parseExpression()
                    if (expr is KtCallExprNode) {
                        bodyStatements.add(expr)
                    }
                }
            }
            match(TokenType.RBRACE)
        }
        return KtFunctionDeclNode(fnName, annotations, params, bodyStatements)
    }

    private fun parseExpression(): KtExprNode {
        var expr = parsePrimaryExpression()
        while (match(TokenType.DOT)) {
            val selector = parsePrimaryExpression()
            expr = KtDotQualifiedExprNode(expr, selector)
        }
        return expr
    }

    private fun parsePrimaryExpression(): KtExprNode {
        return when {
            check(TokenType.STRING) -> KtStringLiteralNode(advance().lexeme)
            check(TokenType.NUMBER) -> {
                val raw = advance().lexeme
                val num = if (raw.startsWith("0x", ignoreCase = true)) {
                    raw.substring(2).toLong(16).toDouble()
                } else {
                    raw.toDoubleOrNull() ?: 0.0
                }
                KtNumberLiteralNode(num, !raw.contains('.'))
            }
            checkKeyword("true") -> { advance(); KtBooleanLiteralNode(true) }
            checkKeyword("false") -> { advance(); KtBooleanLiteralNode(false) }
            check(TokenType.LBRACE) -> parseLambdaExpression()
            check(TokenType.IDENTIFIER) -> {
                val ident = advance().lexeme
                val hasArgs = check(TokenType.LPAREN)
                val args = if (match(TokenType.LPAREN)) parseValueArgumentList() else emptyList()
                val trailingLambda = if (check(TokenType.LBRACE)) parseLambdaExpression() else null
                if (hasArgs || trailingLambda != null) {
                    KtCallExprNode(ident, args, trailingLambda)
                } else {
                    KtReferenceExprNode(ident)
                }
            }
            else -> {
                val tok = advance()
                KtReferenceExprNode(tok.lexeme)
            }
        }
    }

    private fun parseValueArgumentList(): List<KtValueArgNode> {
        val args = mutableListOf<KtValueArgNode>()
        while (!check(TokenType.RPAREN) && !isAtEnd()) {
            val isNamed = check(TokenType.IDENTIFIER) && peekToken(1).type == TokenType.EQUALS
            if (isNamed) {
                val argName = advance().lexeme
                match(TokenType.EQUALS)
                val expr = parseExpression()
                args.add(KtValueArgNode(argName, expr))
            } else {
                val expr = parseExpression()
                args.add(KtValueArgNode(null, expr))
            }
            if (!match(TokenType.COMMA)) break
        }
        match(TokenType.RPAREN)
        return args
    }

    private fun parseLambdaExpression(): KtLambdaExprNode {
        match(TokenType.LBRACE)
        val lambdaParams = mutableListOf<String>()
        // Optional lambda params before `->`
        val savedIdx = idx
        val tempParams = mutableListOf<String>()
        while (check(TokenType.IDENTIFIER)) {
            tempParams.add(advance().lexeme)
            if (!match(TokenType.COMMA)) break
        }
        if (match(TokenType.ARROW)) {
            lambdaParams.addAll(tempParams)
        } else {
            idx = savedIdx
        }

        val statements = mutableListOf<KtCallExprNode>()
        while (!check(TokenType.RBRACE) && !isAtEnd()) {
            val expr = parseExpression()
            if (expr is KtCallExprNode) {
                statements.add(expr)
            }
        }
        match(TokenType.RBRACE)
        return KtLambdaExprNode(lambdaParams, statements)
    }

    private fun parseQualifiedIdentifier(): String {
        val sb = StringBuilder()
        while (check(TokenType.IDENTIFIER) || check(TokenType.DOT)) {
            sb.append(advance().lexeme)
        }
        return sb.toString()
    }

    private fun check(type: TokenType): Boolean = !isAtEnd() && tokens[idx].type == type
    private fun checkKeyword(word: String): Boolean =
        !isAtEnd() && tokens[idx].type == TokenType.KEYWORD && tokens[idx].lexeme == word

    private fun match(type: TokenType): Boolean {
        if (check(type)) { advance(); return true }
        return false
    }

    private fun advance(): Token = if (!isAtEnd()) tokens[idx++] else tokens.last()
    private fun peekToken(offset: Int): Token =
        if (idx + offset < tokens.size) tokens[idx + offset] else tokens.last()
    private fun isAtEnd(): Boolean = tokens[idx].type == TokenType.EOF
}

/**
 * Emits formatted, idiomatic Jetpack Compose Kotlin code directly from a KtFileNode AST.
 */
object KotlinAstCodeEmitter {
    fun emitFile(file: KtFileNode): String {
        val sb = StringBuilder()
        sb.appendLine("package ${file.packageName}")
        sb.appendLine()
        val defaultImports = if (file.imports.isEmpty()) listOf(
            "androidx.compose.foundation.background",
            "androidx.compose.foundation.border",
            "androidx.compose.foundation.layout.*",
            "androidx.compose.foundation.shape.RoundedCornerShape",
            "androidx.compose.material3.*",
            "androidx.compose.runtime.Composable",
            "androidx.compose.ui.Alignment",
            "androidx.compose.ui.Modifier",
            "androidx.compose.ui.draw.clip",
            "androidx.compose.ui.graphics.Color",
            "androidx.compose.ui.text.font.FontWeight",
            "androidx.compose.ui.unit.dp",
            "androidx.compose.ui.unit.sp"
        ) else file.imports
        defaultImports.forEach { sb.appendLine("import $it") }
        sb.appendLine()

        file.declarations.forEach { fn ->
            fn.annotations.forEach { ann -> sb.appendLine("@${ann.name}") }
            val paramStr = fn.parameters.joinToString(", ") { p ->
                val def = p.defaultValue?.let { " = ${emitExpr(it, 0)}" } ?: ""
                "${p.name}: ${p.typeName}$def"
            }
            sb.appendLine("fun ${fn.name}($paramStr) {")
            fn.bodyStatements.forEach { stmt ->
                sb.appendLine(emitCall(stmt, 1))
            }
            sb.appendLine("}")
        }
        return sb.toString()
    }

    private fun emitCall(call: KtCallExprNode, indent: Int): String {
        val pad = "    ".repeat(indent)
        val argPad = "    ".repeat(indent + 1)
        val sb = StringBuilder()
        sb.append("$pad${call.calleeName}")
        if (call.valueArguments.isNotEmpty() || call.trailingLambda == null) {
            if (call.valueArguments.size == 1 && call.valueArguments[0].name == null && call.trailingLambda == null) {
                sb.append("(${emitExpr(call.valueArguments[0].expression, indent)})")
            } else if (call.valueArguments.isEmpty()) {
                if (call.trailingLambda == null) sb.append("()")
            } else {
                sb.appendLine("(")
                call.valueArguments.forEachIndexed { i, arg ->
                    val prefix = arg.name?.let { "$it = " } ?: ""
                    val comma = if (i < call.valueArguments.size - 1) "," else ""
                    sb.appendLine("$argPad$prefix${emitExpr(arg.expression, indent + 1)}$comma")
                }
                sb.append("$pad)")
            }
        }
        call.trailingLambda?.let { lambda ->
            sb.appendLine(" {")
            lambda.statements.forEach { childStmt ->
                sb.appendLine(emitCall(childStmt, indent + 1))
            }
            sb.append("$pad}")
        }
        return sb.toString()
    }

    private fun emitExpr(expr: KtExprNode, indent: Int): String = when (expr) {
        is KtStringLiteralNode -> "\"${expr.value.replace("\"", "\\\"")}\""
        is KtNumberLiteralNode -> if (expr.isInt) expr.value.toLong().toString() else expr.value.toString()
        is KtBooleanLiteralNode -> expr.value.toString()
        is KtReferenceExprNode -> expr.identifier
        is KtCallExprNode -> {
            val args = expr.valueArguments.joinToString(", ") { a ->
                val p = a.name?.let { "$it = " } ?: ""
                "$p${emitExpr(a.expression, indent)}"
            }
            "${expr.calleeName}($args)"
        }
        is KtDotQualifiedExprNode -> "${emitExpr(expr.receiver, indent)}.${emitExpr(expr.selector, indent)}"
        is KtLambdaExprNode -> "{}"
    }
}
