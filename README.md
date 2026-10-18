# KtAstBridge Studio v4.0 — Bidirectional Figma ↔ Kotlin AST ↔ Jetpack Compose

A deterministic **Kotlin PSI / AST compiler** and **Minimalist Multi-Device React Studio** that converts **Jetpack Compose (`@Composable`)** code into **Figma Auto Layout SceneGraph nodes** and vice versa.

---

## ✨ What Is Updated in v4.0 (Elegant Edition)

1. **Strictly Constant Hardware Viewport Sizes (`Mobile`, `Tablet`, `Desktop`)**:
   - **Mobile Frame (`380 × 700 dp`)**, **Tablet Frame (`760 × 550 dp`)**, and **Desktop Window (`960 × 580 dp`)** maintain **100% constant hardware dimensions** irrespective of the loaded design size, content length, or whether the code editor is completely blank.
   - Multi-column rows and fixed widths automatically adapt inside the Mobile portrait frame so mobile designs never stretch sideways.
2. **Simple, Refined & Elegant Design System**:
   - Clean architectural studio aesthetic with warm alabaster surfaces (`#F8FAFC`), crisp white panels (`#FFFFFF`), obsidian accents (`#18181B`), and hairline zinc borders (`#E4E4E7`).
3. **Standard Starter View When Editor is Blank**:
   - Clearing the code editor displays a structured **Standard Starter View** inside the constant-size device viewport with 1-click starter templates (`Standard Starter @Composable`, `Minimalist Private Wealth Card`, `Editorial Studio Hardware Card`) so the user experience is never interrupted.
4. **Direct Figma Page Importer**:
   - Import designs directly via **Figma REST API File URL + Personal Access Token (`figd_...`)**, upload a local `.json` node export, or pick from 4 multi-device templates.
5. **Built-In Website Documentation (`Docs & Guide` Tab)**:
   - Interactive documentation, AST mapping tables, local setup commands, and deployment instructions are accessible right inside the top navigation bar.

---

## 📂 Repository Structure

```text
figma-compose-ast-bridge/
├── README.md                          # Complete project overview & setup handbook
├── build.gradle.kts                   # Standalone Kotlin JVM CLI build script
├── settings.gradle.kts                # Gradle settings
├── docs/
│   ├── USER_GUIDE.md                  # Step-by-step web studio & Figma import guide
│   ├── ARCHITECTURE.md                # Kotlin Lexer, Recursive-Descent AST & Auto Layout solver
│   └── DEPLOYMENT.md                  # Free hosting on Cloudflare Pages & GitHub Pages
├── src/                               # Standalone Kotlin JVM CLI Compiler (kotlin-cli)
│   ├── main/kotlin/com/figmacompose/ast/
│   │   ├── Main.kt
│   │   ├── model/AstAndFigmaModels.kt
│   │   ├── parser/KotlinComposeAstParser.kt
│   │   └── transformer/
│   │       ├── AstToFigmaTransformer.kt
│   │       └── FigmaToAstTransformer.kt
│   └── test/kotlin/com/figmacompose/ast/
│       └── RoundTripAstTest.kt
└── web/                               # Modular React 18 + Vite + Tailwind CSS Studio
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── KtAstBridgeStudio.jsx      # Complete v4.0 Studio Workspace
        ├── engine/                    # Modular AST Lexer, Parser & Transformers
        ├── components/                # Modular React UI Components
        └── data/                      # Multi-Device Presets & Starter Templates
```

---

## 🚀 Quick Start (Local Machine)

### 1. Run the React Web Studio (`web/`)
```bash
cd web
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. Run the Standalone Kotlin CLI Compiler
Requires JDK 17+ and Gradle 8+:
```bash
# Convert Jetpack Compose (.kt) -> Figma JSON
./gradlew run --args="compose2figma samples/WalletScreen.kt build/figma_nodes.json"

# Convert Figma JSON -> Jetpack Compose (.kt)
./gradlew run --args="figma2compose build/figma_nodes.json build/GeneratedScreen.kt"

# Run round-trip AST verification tests
./gradlew test
```

---

## 🌐 Free Hosting on Cloudflare Pages or GitHub Pages

- **Cloudflare Pages**: Connect your GitHub repository in the Cloudflare dashboard, set **Root directory** to `web`, **Build command** to `npm run build`, and **Build output directory** to `dist`.
- **GitHub Pages**: Push to `main` and enable **Settings → Pages → Source: GitHub Actions** (workflow included in `.github/workflows/deploy-pages.yml`).
