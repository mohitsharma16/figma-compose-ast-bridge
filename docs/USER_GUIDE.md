# User Guide — KtAstBridge Studio v4.0

## 1. Writing Jetpack Compose Code & Previewing Across Devices
1. Select **Split Studio (Code + UI)** or **Full-Size UI Preview** in the top navigation bar.
2. Switch between **Mobile (`380 × 700 dp`)**, **Tablet (`760 × 550 dp`)**, and **Desktop (`960 × 580 dp`)** in the top-right device switcher.
3. Each device frame maintains a **strictly constant hardware size**—even if you clear the editor or load a multi-column layout.
4. If the editor is empty, click **Load Standard Starter @Composable** inside the preview or click the **Standard** button in the editor header to insert a clean starter template.

## 2. Importing Design Pages from Figma
1. Click **Import from Figma** in the top navigation bar.
2. **Live Figma API**: Paste your Figma File/Frame URL (`https://www.figma.com/design/<FILE_KEY>/...`) and your Figma Personal Access Token (`figd_...`), then click **Import & Generate**.
3. **Upload `.json` Export**: Click **Upload Figma .json File** to import any exported Figma REST API or Plugin JSON tree.
4. **1-Click Templates**: Choose any of the 4 pre-built Mobile, Tablet, or Desktop Figma pages to immediately generate `@Composable` Kotlin code.

## 3. Using the Visual Layer Inspector
1. Click any element inside the Mobile, Tablet, or Desktop preview.
2. Adjust **Text / Layer Name**, **Auto Layout Direction (`VERTICAL`, `HORIZONTAL`, `NONE`)**, **Fill / Text Color**, **Padding (`dp`)**, **Gap / Font Size**, **Corner Radius (`dp`)**, **Rotation (`deg`)**, or **Scroll Behavior (`verticalScroll`, `horizontalScroll`)**.
3. With **Auto-Sync** enabled, every change immediately updates the `@Composable` Kotlin source code.
