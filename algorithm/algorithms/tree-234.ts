import { SortStep, SortGenerator, BalancedTreeAux } from '../types/sort';
import { BTreeNode } from '../types/graph';

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
    treeType: '234',
    root: cloned,
  };
}

function isLeaf(node: BTreeNode): boolean {
  return !node.children || node.children.length === 0;
}

function is4Node(node: BTreeNode): boolean {
  return node.keys.length === 3;
}

/**
 * Split a 4-node child at given index under parent.
 * Returns the modified parent (or new root if parent is null).
 */
function splitChild(parent: BTreeNode | null, node: BTreeNode, childIndex: number): BTreeNode {
  // node is a 4-node: keys=[a, b, c], children=[c0, c1, c2, c3] or no children
  const midKey = node.keys[1];
  const leftNode: BTreeNode = {
    keys: [node.keys[0]],
    children: node.children ? [node.children[0], node.children[1]] : undefined,
    state: 'default',
  };
  const rightNode: BTreeNode = {
    keys: [node.keys[2]],
    children: node.children ? [node.children[2], node.children[3]] : undefined,
    state: 'default',
  };

  if (!parent) {
    // node is root, create new root
    return {
      keys: [midKey],
      children: [leftNode, rightNode],
      state: 'default',
    };
  }

  // Insert midKey into parent at correct position
  const insertPos = parent.keys.findIndex(k => k > midKey);
  const pos = insertPos === -1 ? parent.keys.length : insertPos;
  parent.keys.splice(pos, 0, midKey);
  parent.children!.splice(childIndex, 1, leftNode, rightNode);

  return parent;
}

export const tree234Operations: SortGenerator = function* (arr) {
  const a = [...arr];
  let comparisons = 0;
  let root: BTreeNode | null = null;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `2-3-4 트리 연산 시작. 삽입할 값: [${a.join(', ')}].`,
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
      explanation: `값 ${val} 삽입 시작.`,
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

    // Check if root is a 4-node - split proactively
    if (is4Node(root)) {
      root.state = 'split';

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 2,
        explanation: `루트가 4-노드[${root.keys.join(',')}]. 분할 수행.`,
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

    // Navigate down, splitting 4-nodes on the way
    let current = root;
    let parent: BTreeNode | null = null;
    let parentChildIdx = -1;

    while (!isLeaf(current)) {
      current.state = 'current';
      comparisons++;

      // Find which child to go to
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

      // Check if val already exists
      if (current.keys.includes(val)) {
        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 4,
          explanation: `${val}은(는) 이미 노드[${current.keys.join(',')}]에 존재.`,
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

      // Check if child is a 4-node
      if (is4Node(child)) {
        child.state = 'split';

        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 2,
          explanation: `자식 노드[${child.keys.join(',')}]가 4-노드. 분할 수행.`,
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

        // Re-determine which child to go to after split
        let newChildIdx = current.keys.length;
        for (let i = 0; i < current.keys.length; i++) {
          if (val < current.keys[i]) {
            newChildIdx = i;
            break;
          }
        }
        current.state = 'default';
        parent = current;
        parentChildIdx = newChildIdx;
        current = current.children![newChildIdx];
      } else {
        current.state = 'default';
        parent = current;
        parentChildIdx = childIdx;
        current = child;
      }
    }

    // current is a leaf (and not a 4-node since we split on the way down)
    if (!current.keys.includes(val)) {
      // Insert into leaf in sorted order
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

  // Search for the last value
  const searchKey = a[a.length - 1];
  if (root) resetBTreeStates(root);

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 7,
    explanation: `탐색 시작. 키: ${searchKey}.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(root),
  };

  let searchNode: BTreeNode | null = root;

  while (searchNode) {
    searchNode.state = 'compare';
    comparisons++;

    yield {
      array: [...a],
      highlights: [{ index: a.length - 1, type: 'target' }],
      codeLine: 8,
      explanation: `노드[${searchNode.keys.join(',')}]에서 ${searchKey} 탐색.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(root),
    };

    if (searchNode.keys.includes(searchKey)) {
      searchNode.state = 'found';

      yield {
        array: [...a],
        highlights: [{ index: a.length - 1, type: 'found' }],
        codeLine: 9,
        explanation: `노드[${searchNode.keys.join(',')}]에서 키 ${searchKey} 발견. 탐색 성공.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
      return;
    }

    searchNode.state = 'default';

    if (isLeaf(searchNode)) {
      break;
    }

    // Find appropriate child
    let childIdx = searchNode.keys.length;
    for (let i = 0; i < searchNode.keys.length; i++) {
      if (searchKey < searchNode.keys[i]) {
        childIdx = i;
        break;
      }
    }

    yield {
      array: [...a],
      highlights: [{ index: a.length - 1, type: 'target' }],
      codeLine: 10,
      explanation: `자식 ${childIdx}으로 이동.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(root),
    };

    searchNode = searchNode.children ? searchNode.children[childIdx] ?? null : null;
  }

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 11,
    explanation: `키 ${searchKey}을(를) 찾지 못함. 탐색 실패.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(root),
  };
};
