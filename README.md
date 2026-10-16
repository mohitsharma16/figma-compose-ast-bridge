# Bidirectional Figma <-> Jetpack Compose Bridge via Kotlin AST

A bidirectional UI compiler that converts:
1. **Jetpack Compose Kotlin Source Code -> Kotlin AST (`KtFileNode`) -> Unified UI IR -> Figma Auto Layout SceneGraph JSON & Visual UI**
2. **Figma SceneGraph (`FRAME`, `TEXT`, `RECTANGLE`, Auto Layout) -> Unified UI IR -> Synthesized Kotlin AST -> Formatted Jetpack Compose Kotlin Code**

## Project Structure
- `src/main/kotlin/com/figmacompose/ast/model/AstAndFigmaModels.kt`: Typed Kotlin AST hierarchy (`KtFileNode`, `KtFunctionDeclNode`, `KtCallExprNode`, `KtDotQualifiedExprNode`, `KtValueArgNode`, `KtLambdaExprNode`), Unified UI IR, and Figma REST/Plugin API SceneNode models.
- `src/main/kotlin/com/figmacompose/ast/parser/KotlinComposeAstParser.kt`: Recursive-descent Kotlin lexer & AST parser plus `KotlinAstCodeEmitter` for pretty-printing `@Composable` Kotlin source files.
- `src/main/kotlin/com/figmacompose/ast/transformer/AstToFigmaTransformer.kt`: Unrolls `Modifier` dot-qualified AST chains, maps `Column`/`Row`/`Box`/`Card`/`Button`/`Text` to Figma Auto Layout frames, and computes deterministic 2-pass `absoluteBoundingBox` coordinates.
- `src/main/kotlin/com/figmacompose/ast/transformer/FigmaToAstTransformer.kt`: Walks Figma SceneGraph JSON, infers Composable layout primitives and `Modifier` chains, builds a `KtFileNode` AST, and emits Jetpack Compose code.
- `src/main/kotlin/com/figmacompose/ast/Main.kt`: CLI runner demonstrating bidirectional round-trip compilation.
