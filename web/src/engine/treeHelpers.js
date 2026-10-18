// Modular v4.0 SceneGraph Tree Helpers
/******************************************************************************
 * 3. TREE HELPERS
 ******************************************************************************/
export function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function findFigmaNodeById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findFigmaNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function deleteFigmaNodeById(parent, targetId) {
  if (!parent || !parent.children) return false;
  const idx = parent.children.findIndex(c => c.id === targetId);
  if (idx !== -1) {
    parent.children.splice(idx, 1);
    return true;
  }
  for (const ch of parent.children) {
    if (deleteFigmaNodeById(ch, targetId)) return true;
  }
  return false;
}

export function getNextMaxFigmaId(node) {
  let max = 1;
  function walk(n) {
    if (!n) return;
    const parts = String(n.id || '1:1').split(':');
    const num = parseInt(parts[1] || '1', 10);
    if (num > max) max = num;
    (n.children || []).forEach(walk);
  }
  walk(node);
  return `1:${max + 1}`;
}

