# KtAstBridge — Bidirectional Figma ↔ Jetpack Compose Compiler via Kotlin AST

Convert **Jetpack Compose (`@Composable`) Kotlin code** into **Figma Auto Layout UI frames** and convert **Figma SceneGraph JSON / layers** back into idiomatic **Jetpack Compose Kotlin code** using a Kotlin Abstract Syntax Tree (AST) compiler pipeline.

## 📂 What Is Inside This Repository
- `docs/index.html` — **Self-contained Interactive Web Studio** (ready for GitHub Pages `/docs` or Cloudflare Pages `docs` deployment). Includes:
  - Live **Jetpack Compose (`.kt`) ↔ Kotlin AST ↔ Figma Auto Layout UI** compiler
  - Interactive **Kotlin AST Tree & PSI Node Inspector** + **Lexer Token Stream**
  - **Device Screen Size Breakpoints** (`Compact 340dp`, `Medium 440dp`, `Expanded 560dp`) & **Portrait ↔ Landscape Rotation**
  - **Element Rotation (`Modifier.rotate`)** & **Scroll Behavior (`Modifier.verticalScroll` / `horizontalScroll`)**
  - Built-in **`? How to Use`** interactive onboarding modal with one-click demos
- `.github/workflows/deploy-pages.yml` — Automated GitHub Actions workflow to deploy `docs/index.html` to GitHub Pages on every push to `main`.
- `build.gradle.kts` & `settings.gradle.kts` — Standalone Kotlin JVM Gradle configuration (`kotlin-compiler-embeddable`, `kotlinpoet`, `kotlinx-serialization-json`).
- `src/main/kotlin/com/figmacompose/ast/`
  - `model/AstAndFigmaModels.kt` — Typed Kotlin AST nodes (`KtFileNode`, `KtFunctionDeclNode`, `KtCallExprNode`, `KtDotQualifiedExprNode`, `KtValueArgNode`, `KtLambdaExprNode`), Unified UI IR (`UiIrNode`, `ModifierIr` with `rotationDegrees` & `overflowDirection`), and Figma REST/Plugin API models (`FigmaNode`).
  - `parser/KotlinComposeAstParser.kt` — Kotlin Lexer, Recursive-Descent AST Parser, and `KotlinAstCodeEmitter`.
  - `transformer/AstToFigmaTransformer.kt` — Unrolls `Modifier` chains (including `.rotate()`, `.verticalScroll()`, `.horizontalScroll()`), maps Composables to Figma Auto Layout frames, and solves 2-pass `absoluteBoundingBox` layout coordinates.
  - `transformer/FigmaToAstTransformer.kt` — Walks Figma SceneGraph JSON and synthesizes a `KtFileNode` AST to emit formatted Jetpack Compose `.kt` code.
  - `Main.kt` — CLI round-trip demo runner.
- `src/test/kotlin/com/figmacompose/ast/RoundTripAstTest.kt` — JUnit 5 test suite verifying Compose → AST → Figma → AST → Compose round-trip fidelity.

## 🌐 Free Hosting Setup (GitHub Pages & Cloudflare Pages)
### Option A: GitHub Pages
1. Push this project to your GitHub repository.
2. Open **Settings → Pages** on GitHub.
3. Choose **Deploy from a branch** → select **`main`** and the **`/docs`** folder → click **Save** (or choose **GitHub Actions** to use `.github/workflows/deploy-pages.yml`).

### Option B: Cloudflare Pages
1. In Cloudflare Dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Select your GitHub repository.
3. Set **Build command** to *(blank)* and **Build output directory** to `docs`, then click **Save and Deploy**.
