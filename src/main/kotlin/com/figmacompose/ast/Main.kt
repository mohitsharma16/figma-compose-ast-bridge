package com.figmacompose.ast

import com.figmacompose.ast.parser.KotlinAstCodeEmitter
import com.figmacompose.ast.parser.KotlinComposeAstParser
import com.figmacompose.ast.transformer.AstToFigmaTransformer
import com.figmacompose.ast.transformer.FigmaToAstTransformer
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

fun main() {
    val sampleComposeCode = """
        package com.example.fintech

        import androidx.compose.runtime.Composable

        @Composable
        fun PaymentCardScreen() {
            Column(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFF8FAFC)).padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Wallet Balance",
                    fontSize = 14.sp,
                    color = Color(0xFF64748B)
                )
                Text(
                    text = "${'$'}12,480.00",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )
                Button(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Send Instant Transfer",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFFFFFFFF)
                    )
                }
            }
        }
    """.trimIndent()

    val json = Json { prettyPrint = true; encodeDefaults = true }

    // 1. Parse Compose Kotlin Code -> KtFileNode AST
    val parsedAst = KotlinComposeAstParser.parseSource(sampleComposeCode)
    println("=== 1. Parsed Kotlin AST Declarations: ${parsedAst.declarations.size} ===")

    // 2. Transform Kotlin AST -> Figma Auto Layout SceneNode JSON
    val figmaNode = AstToFigmaTransformer().transformFileToFigma(parsedAst)
    val figmaJsonString = json.encodeToString(figmaNode)
    println("=== 2. Generated Figma SceneGraph JSON ===")
    println(figmaJsonString)

    // 3. Transform Figma SceneNode -> Kotlin AST -> Jetpack Compose Kotlin Code
    val synthesizedAst = FigmaToAstTransformer().transformFigmaToAst(figmaNode, "GeneratedWalletCard")
    val emittedKotlin = KotlinAstCodeEmitter.emitFile(synthesizedAst)
    println("=== 3. Emitted Jetpack Compose Code from Figma Node ===")
    println(emittedKotlin)
}
