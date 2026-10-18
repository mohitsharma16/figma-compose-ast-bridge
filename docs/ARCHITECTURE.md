# Architecture — Kotlin AST & Figma Auto Layout Bridge

## 1. Kotlin Lexer & Recursive-Descent AST Parser
- Tokenizes `@Composable` Kotlin files into `AT_ANNOTATION`, `KEYWORD`, `IDENTIFIER`, `STRING`, `NUMBER`, and punctuation tokens with exact `line:col` spans.
- Builds a structured AST (`KtFile` → `KtNamedFunction` → `KtCallExpression` → `KtValueArgument` / `KtDotQualifiedExpression` / `KtLambdaExpression`).

## 2. Unrolling `Modifier` Chains
- `unrollModifierChain()` walks nested `KtDotQualifiedExpression` nodes left-to-right to extract:
  - `fillMaxWidth()`, `weight(1f)`, `width(dp)`, `height(dp)`
  - `padding(dp)` and `padding(horizontal, vertical)`
  - `background(Color, RoundedCornerShape(dp))` and `border(width, Color, Shape)`
  - `rotate(deg)` and `verticalScroll()` / `horizontalScroll()`

## 3. Constant-Viewport Responsive Clamping
- `DeviceStage` locks Mobile (`380×700`), Tablet (`760×550`), and Desktop (`960×580`) frames to immutable pixel dimensions with internal scrolling (`overflow-y: auto; overflow-x: hidden`).
- `FigmaNodeRenderer` automatically stacks multi-column horizontal frames when previewed inside a narrow Mobile portrait viewport so designs never overflow or stretch sideways.
