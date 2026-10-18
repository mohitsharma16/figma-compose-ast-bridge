import React from 'react';

export function AstTreeView({ ast, selectedFigmaId, onSelectAstNode }) {
  if (!ast) return null;

  const renderCall = (call, depth) => {
    const isMatched = call._mappedFigmaId === selectedFigmaId;
    const argCount = (call.valueArguments || []).length;
    const modSteps = call._unrolledModifier?.rawSteps?.length || 0;
    const badge = modSteps > 0 ? `Modifier(${modSteps})` : `${argCount} args`;

    return (
      <React.Fragment key={call.astId}>
        <div
          onClick={() => onSelectAstNode(call)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`py-1 px-2 rounded cursor-pointer flex items-center justify-between gap-2 transition ${
            isMatched
              ? 'bg-purple-500/25 border border-purple-500/50 text-white'
              : 'hover:bg-slate-900 text-slate-300'
          }`}
        >
          <span className="truncate font-mono text-xs">├─ KtCallExpression: {call.calleeName}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 bg-purple-500/20 text-purple-300 font-mono">
            {badge}
          </span>
        </div>
        {(call.trailingLambda?.statements || []).map((ch) => renderCall(ch, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-1 font-mono text-xs">
      <div
        onClick={() => onSelectAstNode(ast)}
        className="py-1 px-2 rounded cursor-pointer flex items-center justify-between hover:bg-slate-900 text-slate-300"
      >
        <span>📦 KtFile ({ast.packageName})</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {ast.imports.length} imports
        </span>
      </div>
      {ast.declarations.map((fn) => (
        <React.Fragment key={fn.astId}>
          <div
            onClick={() => onSelectAstNode(fn)}
            style={{ paddingLeft: '20px' }}
            className="py-1 px-2 rounded cursor-pointer flex items-center justify-between hover:bg-slate-900 text-slate-200"
          >
            <span>ƒ KtNamedFunction: {fn.name}()</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              @Composable
            </span>
          </div>
          {fn.bodyStatements.map((st) => renderCall(st, 2))}
        </React.Fragment>
      ))}
    </div>
  );
}
