// Modular v4.0 Kotlin Lexer
/******************************************************************************
 * 2. KOTLIN LEXER & RECURSIVE-DESCENT AST PARSER (SUPPORTS WEIGHT, WIDTH, SCROLL)
 ******************************************************************************/
const KEYWORDS = new Set(['package', 'import', 'fun', 'val', 'var', 'true', 'false', 'null']);

export function tokenizeKotlin(source) {
  const tokens = [];
  let pos = 0, line = 1, col = 1;
  const peek = (off = 1) => (pos + off < source.length ? source[pos + off] : '');

  while (pos < source.length) {
    const ch = source[pos];
    if (ch === '\n') {
      pos++; line++; col = 1;
    } else if (/\s/.test(ch)) {
      pos++; col++;
    } else if (ch === '/' && peek(1) === '/') {
      while (pos < source.length && source[pos] !== '\n') { pos++; col++; }
    } else if (ch === '/' && peek(1) === '*') {
      pos += 2; col += 2;
      while (pos < source.length && !(source[pos] === '*' && peek(1) === '/')) {
        if (source[pos] === '\n') { line++; col = 1; } else col++;
        pos++;
      }
      if (pos < source.length) { pos += 2; col += 2; }
    } else if (ch === '@') {
      const startCol = col;
      pos++; col++;
      let name = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
        name += source[pos++]; col++;
      }
      tokens.push({ type: 'AT_ANNOTATION', lexeme: name, line, col: startCol });
    } else if (ch === '"') {
      const startCol = col;
      pos++; col++;
      let str = '';
      while (pos < source.length && source[pos] !== '"') {
        if (source[pos] === '\\' && pos + 1 < source.length) { pos++; col++; }
        str += source[pos++]; col++;
      }
      if (pos < source.length) { pos++; col++; }
      tokens.push({ type: 'STRING', lexeme: str, line, col: startCol });
    } else if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(peek(1)))) {
      const startCol = col;
      let numStr = '';
      if (ch === '-') { numStr += source[pos++]; col++; }
      if (source[pos] === '0' && (peek(1) === 'x' || peek(1) === 'X')) {
        numStr += '0x'; pos += 2; col += 2;
        while (pos < source.length && /[0-9a-fA-F_]/.test(source[pos])) {
          if (source[pos] !== '_') numStr += source[pos];
          pos++; col++;
        }
      } else {
        while (pos < source.length && /[0-9.]/.test(source[pos])) {
          if (source[pos] === '.' && !/[0-9]/.test(peek(1))) break;
          numStr += source[pos++]; col++;
        }
        if (pos < source.length && (source[pos] === 'f' || source[pos] === 'F')) {
          pos++; col++;
        }
      }
      tokens.push({ type: 'NUMBER', lexeme: numStr, line, col: startCol });
    } else if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      let ident = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
        ident += source[pos++]; col++;
      }
      tokens.push({
        type: KEYWORDS.has(ident) ? 'KEYWORD' : 'IDENTIFIER',
        lexeme: ident,
        line,
        col: startCol
      });
    } else if (ch === '-' && peek(1) === '>') {
      tokens.push({ type: 'ARROW', lexeme: '->', line, col });
      pos += 2; col += 2;
    } else {
      const map = {
        '(': 'LPAREN', ')': 'RPAREN', '{': 'LBRACE', '}': 'RBRACE',
        ',': 'COMMA', '.': 'DOT', ':': 'COLON', '=': 'EQUALS'
      };
      if (map[ch]) {
        tokens.push({ type: map[ch], lexeme: ch, line, col });
      }
      pos++; col++;
    }
  }
  tokens.push({ type: 'EOF', lexeme: '', line, col });
  return tokens;
}

