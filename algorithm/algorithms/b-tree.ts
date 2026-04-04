import { SortStep, SortGenerator, BalancedTreeAux } from '../types/sort';
import { BTreeNode } from '../types/graph';

const ORDER = 5; // B-tree order (max keys = ORDER - 1 = 4)
const MAX_KEYS = ORDER - 1;

function cloneBTree(node: BTreeNode | null | undefined): BTreeNode | null {
  if (!node) return null;
  return {
    ...node,
    keys: [...node.keys],
    children: node.children ? node.children.map(c => cloneBTree(c)!) : undefined,
  };
}

function layoutBTree(node: BTreeNode | null | undefined, x: number, y: number, spread: number): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  if (node.children) {
    const childCount = node.children.length;
    const totalWidth = (childCount - 1) * spread;
    const startX = x - totalWidth / 2;
    for (let i = 0; i < childCount; i++) {
      layoutBTree(node.children[i], startX + i * spread, y + 70, spread / 2);
    }
  }
}

function resetBTreeStates(node: BTreeNode | null | undefined): void {
  if (!node) return;
  node.state = 'default';
  if (node.children) {
    for (const child of node.children) {
      resetBTreeStates(child);
    }
  }
}

function makeAux(root: BTreeNode | null): BalancedTreeAux {
  const cloned = cloneBTree(root);
  if (cloned) layoutBTree(cloned, 300, 30, 160);
  return {
    kind: 'balanced-tree',
    treeType: 'b-tree',
    root: cloned,
  };
}

function isLeaf(node: BTreeNode): boolean {
  return !node.children || node.children.length === 0;
}

function isFull(node: BTreeNode): boolean {
  return node.keys.length >= MAX_KEYS;
}

/**
 * Split a full child at childIndex under parent.
 * If parent is null, creates a new root.
 */
function splitChild(parent: BTreeNode | null, node: BTreeNode, childIndex: number): BTreeNode {
  const midIdx = Math.floor(node.keys.length / 2);
  const midKey = node.keys[midIdx];

  const leftNode: BTreeNode = {
    keys: node.keys.slice(0, midIdx),
    children: node.children ? node.children.slice(0, midIdx + 1) : undefined,
    state: 'default',
  };
  const rightNode: BTreeNode = {
    keys: node.keys.slice(midIdx + 1),
    children: node.children ? node.children.slice(midIdx + 1) : undefined,
    state: 'default',
  };

  if (!parent) {
    return {
      keys: [midKey],
      children: [leftNode, rightNode],
      state: 'default',
    };
  }

  const insertPos = parent.keys.findIndex(k => k > midKey);
  const pos = insertPos === -1 ? parent.keys.length : insertPos;
  parent.keys.splice(pos, 0, midKey);
  parent.children!.splice(childIndex, 1, leftNode, rightNode);

  return parent;
}

export const bTree: SortGenerator = function* (arr) {
  const a = [...arr];
  let comparisons = 0;
  let root: BTreeNode | null = null;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `B-트리(차수 ${ORDER}) 삽입 시작. 삽입할 값: [${a.join(', ')}].`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(null),
  };

  for (let idx = 0; idx < a.length; idx++) {
    const val = a[idx];
    if (root) resetBTreeStates(root);

    yield {
      array: [...a],
      highlights: [{ index: idx, type: 'current' }],
      codeLine: 0,
      explanation: `BT_Insert: 값 ${val} 삽입 시작.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(root),
    };

    if (!root) {
      root = { keys: [val], state: 'current' };

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'insert' }],
        codeLine: 5,
        explanation: `트리가 비어있음. 루트 노드에 ${val} 삽입.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
      continue;
    }

    // Proactive split: if root is full, split it first
    if (isFull(root)) {
      root.state = 'split';

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 2,
        explanation: `루트가 가득 참[${root.keys.join(',')}]. 분할 수행.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };

      root = splitChild(null, root, -1);

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 3,
        explanation: `루트 분할 완료. 새 루트: [${root.keys.join(',')}].`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
    }

    // Navigate down, proactively splitting full nodes
    let current = root;

    while (!isLeaf(current)) {
      current.state = 'current';
      comparisons++;

      // Find which child to descend to
      let childIdx = current.keys.length;
      for (let i = 0; i < current.keys.length; i++) {
        if (val < current.keys[i]) {
          childIdx = i;
          break;
        } else if (val === current.keys[i]) {
          childIdx = i;
          break;
        }
      }

      // Check for duplicate
      if (current.keys.includes(val)) {
        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 4,
          explanation: `${val}은(는) 이미 노드[${current.keys.join(',')}]에 존재. 삽입 생략.`,
          stats: { comparisons, swaps: 0 },
          auxiliaryData: makeAux(root),
        };
        current.state = 'default';
        break;
      }

      const child = current.children![childIdx];

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 4,
        explanation: `노드[${current.keys.join(',')}]에서 자식 ${childIdx}로 이동.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };

      // Proactive split if child is full
      if (isFull(child)) {
        child.state = 'split';

        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 2,
          explanation: `자식 노드[${child.keys.join(',')}]가 가득 참. 분할 수행.`,
          stats: { comparisons, swaps: 0 },
          auxiliaryData: makeAux(root),
        };

        splitChild(current, child, childIdx);

        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 3,
          explanation: `분할 완료. 부모 노드: [${current.keys.join(',')}].`,
          stats: { comparisons, swaps: 0 },
          auxiliaryData: makeAux(root),
        };

        // Re-determine child after split
        let newChildIdx = current.keys.length;
        for (let i = 0; i < current.keys.length; i++) {
          if (val < current.keys[i]) {
            newChildIdx = i;
            break;
          }
        }
        current.state = 'default';
        current = current.children![newChildIdx];
      } else {
        current.state = 'default';
        current = child;
      }
    }

    // Insert into leaf in sorted order
    if (!current.keys.includes(val)) {
      const insertPos = current.keys.findIndex(k => k > val);
      const pos = insertPos === -1 ? current.keys.length : insertPos;
      current.keys.splice(pos, 0, val);
      current.state = 'current';

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'insert' }],
        codeLine: 5,
        explanation: `리프 노드에 ${val} 삽입. 노드: [${current.keys.join(',')}].`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };

      current.state = 'default';
    }
  }

  yield {
    array: [...a],
    highlights: [],
    codeLine: 5,
    explanation: `B-트리 구성 완료. 총 비교 횟수: ${comparisons}.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(root),
  };
};
