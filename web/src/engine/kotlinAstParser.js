// Modular v4.0 Recursive-Descent Kotlin AST Parser
export function parseKotlinAst(tokens) {
  let idx = 0;
  let astIdSeq = 1;
  const nextAstId = () => 'ast-' + (astIdSeq++);

  const isAtEnd = () => tokens[idx].type === 'EOF';
  const check = (type) => !isAtEnd() && tokens[idx].type === type;
  const checkKw = (word) => !isAtEnd() && tokens[idx].type === 'KEYWORD' && tokens[idx].lexeme === word;
  const advance = () => (!isAtEnd() ? tokens[idx++] : tokens[tokens.length - 1]);
  const peekTok = (off = 1) => (idx + off < tokens.length ? tokens[idx + off] : tokens[tokens.length - 1]);
  const match = (type) => { if (check(type)) { advance(); return true; } return false; };

  function parseQualifiedIdent() {
    let out = '';
    while (check('IDENTIFIER') || check('DOT') || (!isAtEnd() && tokens[idx].lexeme === '*')) {
      out += advance().lexeme;
    }
    return out || 'com.example.ui';
  }

  function parseValueArgList() {
    const args = [];
    while (!check('RPAREN') && !isAtEnd()) {
      const isNamed = check('IDENTIFIER') && peekTok(1).type === 'EQUALS';
      if (isNamed) {
        const name = advance().lexeme;
        match('EQUALS');
        const expr = parseExpression();
        args.push({ astId: nextAstId(), nodeType: 'KtValueArgument', name, expression: expr });
      } else {
        const expr = parseExpression();
        args.push({ astId: nextAstId(), nodeType: 'KtValueArgument', name: null, expression: expr });
      }
      if (!match('COMMA')) break;
    }
    match('RPAREN');
    return args;
  }

  function parseLambda() {
    const line = tokens[idx].line;
    match('LBRACE');
    const statements = [];
    while (!check('RBRACE') && !isAtEnd()) {
      const expr = parseExpression();
      if (expr && expr.nodeType === 'KtCallExpression') {
        statements.push(expr);
      }
    }
    match('RBRACE');
    return { astId: nextAstId(), nodeType: 'KtLambdaExpression', line, statements };
  }

  function parsePrimary() {
    const tok = tokens[idx];
    if (check('STRING')) {
      return { astId: nextAstId(), nodeType: 'KtStringTemplateExpression', value: advance().lexeme, line: tok.line };
    }
    if (check('NUMBER')) {
      const raw = advance().lexeme;
      const isHex = /^0x/i.test(raw);
      const numVal = isHex ? parseInt(raw, 16) : parseFloat(raw);
      return { astId: nextAstId(), nodeType: 'KtConstantExpression', raw, value: numVal, isHex, line: tok.line };
    }
    if (checkKw('true') || checkKw('false')) {
      return { astId: nextAstId(), nodeType: 'KtConstantExpression', value: advance().lexeme === 'true', line: tok.line };
    }
    if (check('LBRACE')) {
      return parseLambda();
    }
    if (check('IDENTIFIER')) {
      const ident = advance().lexeme;
      const hasParen = check('LPAREN');
      const valueArguments = match('LPAREN') ? parseValueArgList() : [];
      const trailingLambda = check('LBRACE') ? parseLambda() : null;
      if (hasParen || trailingLambda) {
        return {
          astId: nextAstId(),
          nodeType: 'KtCallExpression',
          calleeName: ident,
          valueArguments,
          trailingLambda,
          line: tok.line
        };
      }
      return { astId: nextAstId(), nodeType: 'KtNameReferenceExpression', identifier: ident, line: tok.line };
    }
    const fallback = advance();
    return { astId: nextAstId(), nodeType: 'KtNameReferenceExpression', identifier: fallback.lexeme, line: fallback.line };
  }

  function parseExpression() {
    let expr = parsePrimary();
    while (match('DOT')) {
      const selector = parsePrimary();
      expr = {
        astId: nextAstId(),
        nodeType: 'KtDotQualifiedExpression',
        receiver: expr,
        selector,
        line: expr.line
      };
    }
    return expr;
  }

  function parseFunctionDecl() {
    const annotations = [];
    while (check('AT_ANNOTATION')) {
      const tok = advance();
      const args = match('LPAREN') ? parseValueArgList() : [];
      annotations.push({ astId: nextAstId(), nodeType: 'KtAnnotationEntry', name: tok.lexeme, args, line: tok.line });
    }
    if (checkKw('fun')) advance();
    const fnTok = check('IDENTIFIER') ? advance() : { lexeme: 'GeneratedScreen', line: 1 };
    if (match('LPAREN')) {
      while (!check('RPAREN') && !isAtEnd()) advance();
      match('RPAREN');
    }
    const bodyStatements = [];
    if (match('LBRACE')) {
      while (!check('RBRACE') && !isAtEnd()) {
        const expr = parseExpression();
        if (expr && expr.nodeType === 'KtCallExpression') {
          bodyStatements.push(expr);
        }
      }
      match('RBRACE');
    }
    return {
      astId: nextAstId(),
      nodeType: 'KtNamedFunction',
      name: fnTok.lexeme,
      annotations,
      bodyStatements,
      line: fnTok.line
    };
  }

  let packageName = 'com.example.ui';
  const imports = [];
  const declarations = [];

  while (!isAtEnd()) {
    if (checkKw('package')) {
      advance();
      packageName = parseQualifiedIdent();
    } else if (checkKw('import')) {
      advance();
      imports.push(parseQualifiedIdent());
    } else if (check('AT_ANNOTATION') || checkKw('fun')) {
      declarations.push(parseFunctionDecl());
    } else {
      advance();
    }
  }

  return {
    astId: nextAstId(),
    nodeType: 'KtFile',
    packageName,
    imports,
    declarations,
    totalAstNodes: astIdSeq - 1
  };
}

