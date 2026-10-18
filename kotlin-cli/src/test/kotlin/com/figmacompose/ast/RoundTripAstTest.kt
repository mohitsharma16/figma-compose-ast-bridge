package com.figmacompose.ast

import com.figmacompose.ast.parser.KotlinAstCodeEmitter
import com.figmacompose.ast.parser.KotlinComposeAstParser
import com.figmacompose.ast.transformer.AstToFigmaTransformer
import com.figmacompose.ast.transformer.FigmaToAstTransformer
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class RoundTripAstTest {
    @Test
    fun testComposeToAstToFigmaAndBack() {
        val source = """
            package com.example.ui
            @Composable
            fun ProfileCard() {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(text = "Ada Lovelace", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Button(modifier = Modifier.fillMaxWidth()) {
                        Text(text = "Follow", fontSize = 14.sp)
                    }
                }
            }
        """.trimIndent()

        val ktFileAst = KotlinComposeAstParser.parseSource(source)
        assertEquals(1, ktFileAst.declarations.size)
        assertEquals("ProfileCard", ktFileAst.declarations.first().name)

        val figmaNode = AstToFigmaTransformer().transformFileToFigma(ktFileAst)
        assertEquals("FRAME", figmaNode.type)
        assertEquals("VERTICAL", figmaNode.layoutMode)
        assertEquals(2, figmaNode.children.size)

        val roundTripAst = FigmaToAstTransformer().transformFigmaToAst(figmaNode, "ProfileCard")
        val generatedKotlin = KotlinAstCodeEmitter.emitFile(roundTripAst)
        assertTrue(generatedKotlin.contains("fun ProfileCard"))
        assertTrue(generatedKotlin.contains("Ada Lovelace"))
    }
}
