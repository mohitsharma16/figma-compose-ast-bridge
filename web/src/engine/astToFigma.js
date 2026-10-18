// Modular v4.0 AST -> Figma Auto Layout SceneGraph Transformer
export function exprToCodeString(expr) {
  if (!expr) return '';
  switch (expr.nodeType) {
    case 'KtStringTemplateExpression': return `"${expr.value}"`;
    case 'KtConstantExpression': return expr.raw !== undefined ? expr.raw : String(expr.value);
    case 'KtNameReferenceExpression': return expr.identifier;
    case 'KtDotQualifiedExpression': return `${exprToCodeString(expr.receiver)}.${exprToCodeString(expr.selector)}`;
    case 'KtCallExpression': {
      const args = (expr.valueArguments || []).map(a => (a.name ? `${a.name} = ` : '') + exprToCodeString(a.expression)).join(', ');
      return `${expr.calleeName}(${args})`;
    }
    default: return '';
  }
}

export function extractFirstNumber(expr) {
  if (!expr) return null;
  if (expr.nodeType === 'KtConstantExpression' && typeof expr.value === 'number') return expr.value;
  if (expr.nodeType === 'KtDotQualifiedExpression') {
    const l = extractFirstNumber(expr.receiver);
    return l !== null ? l : extractFirstNumber(expr.selector);
  }
  if (expr.nodeType === 'KtCallExpression') {
    for (const arg of expr.valueArguments || []) {
      const v = extractFirstNumber(arg.expression);
      if (v !== null) return v;
    }
  }
  return null;
}

export function hexNumberToCss(num) {
  if (typeof num !== 'number' || isNaN(num)) return '#18181b';
  const unsigned = num >>> 0;
  const r = (unsigned >> 16) & 0xFF;
  const g = (unsigned >> 8) & 0xFF;
  const b = unsigned & 0xFF;
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function cssHexToFigmaColor(hex) {
  const clean = (hex || '#18181b').replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return { r: Number(r.toFixed(3)), g: Number(g.toFixed(3)), b: Number(b.toFixed(3)), a: 1 };
}

export function figmaColorToCssHex(c) {
  if (!c) return '#18181b';
  const r = Math.round((c.r || 0) * 255).toString(16).padStart(2, '0');
  const g = Math.round((c.g || 0) * 255).toString(16).padStart(2, '0');
  const b = Math.round((c.b || 0) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function extractColorCss(expr) {
  if (!expr) return null;
  if (expr.nodeType === 'KtCallExpression' && expr.calleeName === 'Color') {
    const firstArg = expr.valueArguments[0]?.expression;
    if (firstArg && typeof firstArg.value === 'number') {
      return hexNumberToCss(firstArg.value);
    }
  }
  const s = exprToCodeString(expr);
  if (s.endsWith('.White')) return '#ffffff';
  if (s.endsWith('.Black')) return '#18181b';
  if (s.endsWith('.Gray')) return '#71717a';
  if (s.endsWith('.Blue')) return '#2563eb';
  return null;
}

export function unrollModifierChain(expr) {
  const calls = [];
  function walk(node) {
    if (!node) return;
    if (node.nodeType === 'KtDotQualifiedExpression') {
      walk(node.receiver);
      walk(node.selector);
    } else if (node.nodeType === 'KtCallExpression') {
      calls.push(node);
    }
  }
  walk(expr);

  const mod = {
    fillMaxWidth: false,
    weight: null,
    widthDp: null,
    heightDp: null,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    bgHex: null,
    cornerRadius: 0,
    borderWidth: 0,
    borderHex: null,
    rotationDeg: 0,
    overflowDirection: 'NONE',
    rawSteps: calls.map(c => exprToCodeString(c))
  };

  for (const c of calls) {
    if (c.calleeName === 'fillMaxWidth' || c.calleeName === 'fillMaxSize') {
      mod.fillMaxWidth = true;
    } else if (c.calleeName === 'weight') {
      mod.weight = extractFirstNumber(c) || 1;
    } else if (c.calleeName === 'width') {
      mod.widthDp = extractFirstNumber(c);
    } else if (c.calleeName === 'height') {
      mod.heightDp = extractFirstNumber(c);
    } else if (c.calleeName === 'size') {
      const v = extractFirstNumber(c);
      if (v !== null) { mod.widthDp = v; mod.heightDp = v; }
    } else if (c.calleeName === 'padding') {
      for (const arg of c.valueArguments || []) {
        const v = extractFirstNumber(arg.expression) || 0;
        if (!arg.name) {
          mod.padding = { top: v, right: v, bottom: v, left: v };
        } else if (arg.name === 'horizontal') {
          mod.padding.left = v; mod.padding.right = v;
        } else if (arg.name === 'vertical') {
          mod.padding.top = v; mod.padding.bottom = v;
        } else if (arg.name === 'top') mod.padding.top = v;
        else if (arg.name === 'bottom') mod.padding.bottom = v;
        else if (arg.name === 'start' || arg.name === 'left') mod.padding.left = v;
        else if (arg.name === 'end' || arg.name === 'right') mod.padding.right = v;
      }
    } else if (c.calleeName === 'background') {
      const cHex = extractColorCss(c.valueArguments[0]?.expression);
      if (cHex) mod.bgHex = cHex;
      if (c.valueArguments[1]) {
        const r = extractFirstNumber(c.valueArguments[1].expression);
        if (r !== null) mod.cornerRadius = r;
      }
    } else if (c.calleeName === 'clip') {
      const r = extractFirstNumber(c.valueArguments[0]?.expression);
      if (r !== null) mod.cornerRadius = r;
    } else if (c.calleeName === 'border') {
      mod.borderWidth = extractFirstNumber(c.valueArguments[0]?.expression) || 1;
      mod.borderHex = extractColorCss(c.valueArguments[1]?.expression) || '#e4e4e7';
      if (c.valueArguments[2]) {
        const r = extractFirstNumber(c.valueArguments[2].expression);
        if (r !== null) mod.cornerRadius = r;
      }
    } else if (c.calleeName === 'rotate' || c.calleeName === 'graphicsLayer') {
      const deg = extractFirstNumber(c);
      if (deg !== null) mod.rotationDeg = deg;
    } else if (c.calleeName === 'verticalScroll') {
      mod.overflowDirection = 'VERTICAL_SCROLLING';
    } else if (c.calleeName === 'horizontalScroll') {
      mod.overflowDirection = 'HORIZONTAL_SCROLLING';
    }
  }
  return mod;
}

export function findArg(callNode, name, posIndex = null) {
  const args = callNode.valueArguments || [];
  const byName = args.find(a => a.name === name);
  if (byName) return byName;
  if (posIndex !== null && args[posIndex] && !args[posIndex].name) return args[posIndex];
  return null;
}

export function transformAstToFigma(ktFileAst) {
  let figmaIdCounter = 1;
  const nextFigmaId = () => `1:${figmaIdCounter++}`;
  const astMap = new Map();

  const fn = ktFileAst.declarations[0];
  if (!fn || !fn.bodyStatements.length) {
    return {
      root: null,
      isEmptySource: true,
      astMap,
      layerCount: 0
    };
  }

  function callToFigma(call) {
    const id = nextFigmaId();
    const callee = call.calleeName;
    const modArg = findArg(call, 'modifier');
    const mod = modArg ? unrollModifierChain(modArg.expression) : unrollModifierChain(null);
    call._unrolledModifier = mod;
    call._mappedFigmaId = id;
    astMap.set(id, call);

    if (callee === 'Text') {
      const txtArg = findArg(call, 'text', 0);
      const chars = txtArg?.expression?.value || 'Text';
      const fsArg = findArg(call, 'fontSize');
      const fontSize = fsArg ? (extractFirstNumber(fsArg.expression) || 14) : 14;
      const fwArg = findArg(call, 'fontWeight');
      const fwStr = fwArg ? exprToCodeString(fwArg.expression) : 'Normal';
      const fontWeight = fwStr.includes('Bold') ? 700 : fwStr.includes('SemiBold') ? 600 : fwStr.includes('Medium') ? 500 : 400;
      const colArg = findArg(call, 'color');
      const textHex = (colArg ? extractColorCss(colArg.expression) : null) || '#18181b';

      return {
        id,
        astId: call.astId,
        name: `Text_${chars.slice(0, 18)}`,
        type: 'TEXT',
        characters: chars,
        fills: [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(textHex) }],
        style: {
          fontFamily: 'Inter',
          fontWeight,
          fontSize,
          lineHeightPx: Math.round(fontSize * 1.4)
        },
        rotation: mod.rotationDeg || 0,
        layoutSizingHorizontal: mod.fillMaxWidth ? 'FILL' : 'HUG',
        layoutSizingVertical: 'HUG'
      };
    }

    if (callee === 'HorizontalDivider' || callee === 'Divider' || callee === 'Spacer') {
      const isDiv = callee.includes('Divider');
      const colArg = findArg(call, 'color');
      const divHex = (colArg ? extractColorCss(colArg.expression) : null) || '#e4e4e7';
      return {
        id,
        astId: call.astId,
        name: callee,
        type: 'RECTANGLE',
        layoutSizingHorizontal: 'FILL',
        layoutSizingVertical: 'FIXED',
        cornerRadius: 0,
        fills: isDiv ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(divHex) }] : [],
        strokes: [],
        strokeWeight: 0,
        absoluteBoundingBox: { x: 0, y: 0, width: 300, height: mod.heightDp || (isDiv ? 1 : 12) },
        children: []
      };
    }

    const isRow = callee === 'Row' || callee === 'LazyRow';
    const isButton = callee === 'Button' || callee === 'OutlinedButton';
    const layoutMode = isRow || isButton ? 'HORIZONTAL' : callee === 'Box' ? 'NONE' : 'VERTICAL';

    let itemSpacing = 0;
    let primaryAxisAlignItems = isButton ? 'CENTER' : 'MIN';
    let counterAxisAlignItems = isButton ? 'CENTER' : 'MIN';

    const arrArg = findArg(call, 'verticalArrangement') || findArg(call, 'horizontalArrangement');
    if (arrArg) {
      const code = exprToCodeString(arrArg.expression);
      if (code.includes('SpaceBetween')) primaryAxisAlignItems = 'SPACE_BETWEEN';
      else if (code.includes('Center')) primaryAxisAlignItems = 'CENTER';
      else if (code.includes('spacedBy')) itemSpacing = extractFirstNumber(arrArg.expression) || 8;
    }

    const alignArg = findArg(call, 'horizontalAlignment') || findArg(call, 'verticalAlignment');
    if (alignArg) {
      const code = exprToCodeString(alignArg.expression);
      if (code.includes('Center')) counterAxisAlignItems = 'CENTER';
    }

    const defaultBg = isButton ? '#18181b' : (callee === 'Card' || callee === 'Surface' ? '#ffffff' : null);
    const bgHex = mod.bgHex || defaultBg;
    const fills = bgHex ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(bgHex) }] : [];
    const strokes = mod.borderHex ? [{ type: 'SOLID', visible: true, color: cssHexToFigmaColor(mod.borderHex) }] : [];

    const padTop = mod.padding.top || (isButton ? 12 : 0);
    const padRight = mod.padding.right || (isButton ? 18 : 0);
    const padBottom = mod.padding.bottom || (isButton ? 12 : 0);
    const padLeft = mod.padding.left || (isButton ? 18 : 0);
    const radius = mod.cornerRadius || (isButton ? 10 : callee === 'Card' ? 14 : 0);

    const childStatements = call.trailingLambda?.statements || [];
    const children = childStatements.map(st => callToFigma(st));

    return {
      id,
      astId: call.astId,
      name: `${callee}_${id.replace(':', '_')}`,
      composableType: callee,
      type: 'FRAME',
      layoutMode,
      primaryAxisAlignItems,
      counterAxisAlignItems,
      layoutGrow: mod.weight || 0,
      widthDp: mod.widthDp || null,
      heightDp: mod.heightDp || null,
      layoutSizingHorizontal: mod.fillMaxWidth || mod.weight ? 'FILL' : mod.widthDp ? 'FIXED' : 'HUG',
      layoutSizingVertical: mod.heightDp ? 'FIXED' : 'HUG',
      paddingTop: padTop,
      paddingRight: padRight,
      paddingBottom: padBottom,
      paddingLeft: padLeft,
      itemSpacing,
      cornerRadius: radius,
      rotation: mod.rotationDeg || 0,
      overflowDirection: callee === 'LazyColumn' ? 'VERTICAL_SCROLLING' : callee === 'LazyRow' ? 'HORIZONTAL_SCROLLING' : (mod.overflowDirection || 'NONE'),
      fills,
      strokes,
      strokeWeight: mod.borderWidth || 0,
      children
    };
  }

  const rootFigma = callToFigma(fn.bodyStatements[0]);
  rootFigma.name = fn.name || rootFigma.name;
  return { root: rootFigma, isEmptySource: false, astMap, layerCount: figmaIdCounter - 1 };
}

