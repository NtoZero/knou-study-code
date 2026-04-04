import { SortStep, SortGenerator, BalancedTreeAux } from '../types/sort';
import { TreeNode } from '../types/graph';

function cloneTree(node: TreeNode | null | undefined): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function layoutTree(node: TreeNode | null | undefined, x: number, y: number, spread: number): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  layoutTree(node.left, x - spread, y + 55, spread / 2);
  layoutTree(node.right, x + spread, y + 55, spread / 2);
}

function resetStates(node: TreeNode | null | undefined): void {
  if (!node) return;
  node.state = 'default';
  resetStates(node.left);
  resetStates(node.right);
}

function makeAux(root: TreeNode | null): BalancedTreeAux {
  const cloned = cloneTree(root);
  if (cloned) layoutTree(cloned, 300, 35, 120);
  return {
    kind: 'balanced-tree',
    treeType: 'red-black',
    root: cloned,
  };
}

// Internal tree node with parent pointer for fixup operations
interface RBNode {
  value: number;
  color: 'red' | 'black';
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
}

function rotateLeft(root: RBNode, x: RBNode): RBNode {
  const y = x.right!;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) {
    root = y;
  } else if (x === x.parent.left) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }
  y.left = x;
  x.parent = y;
  return root;
}

function rotateRight(root: RBNode, y: RBNode): RBNode {
  const x = y.left!;
  y.left = x.right;
  if (x.right) x.right.parent = y;
  x.parent = y.parent;
  if (!y.parent) {
    root = x;
  } else if (y === y.parent.left) {
    y.parent.left = x;
  } else {
    y.parent.right = x;
  }
  x.right = y;
  y.parent = x;
  return root;
}

function rbToTreeNode(node: RBNode | null): TreeNode | null {
  if (!node) return null;
  return {
    value: node.value,
    color: node.color,
    left: rbToTreeNode(node.left),
    right: rbToTreeNode(node.right),
    state: 'default',
  };
}

function bstInsert(root: RBNode | null, val: number): { root: RBNode; inserted: RBNode } {
  const z: RBNode = { value: val, color: 'red', left: null, right: null, parent: null };
  if (!root) {
    return { root: z, inserted: z };
  }

  let y: RBNode | null = null;
  let x: RBNode | null = root;
  while (x) {
    y = x;
    if (val < x.value) {
      x = x.left;
    } else {
      x = x.right;
    }
  }
  z.parent = y;
  if (val < y!.value) {
    y!.left = z;
  } else {
    y!.right = z;
  }
  return { root, inserted: z };
}

export const redBlackTree: SortGenerator = function* (arr) {
  const a = [...arr];
  let comparisons = 0;
  let rbRoot: RBNode | null = null;

  function currentTreeNode(): TreeNode | null {
    return rbToTreeNode(rbRoot);
  }

  function currentAux(): BalancedTreeAux {
    return makeAux(currentTreeNode());
  }

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `레드-블랙 트리 삽입 시작. 삽입할 값: [${a.join(', ')}].`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: currentAux(),
  };

  for (let idx = 0; idx < a.length; idx++) {
    const val = a[idx];

    yield {
      array: [...a],
      highlights: [{ index: idx, type: 'current' }],
      codeLine: 0,
      explanation: `RB_Insert: 값 ${val} 삽입 시작.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: currentAux(),
    };

    // BST insert (new node is red)
    const { root: newRoot, inserted: z } = bstInsert(rbRoot, val);
    rbRoot = newRoot;
    comparisons++;

    yield {
      array: [...a],
      highlights: [{ index: idx, type: 'insert' }],
      codeLine: 1,
      explanation: `BST 방식으로 ${val} 삽입 (빨강 노드).`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: currentAux(),
    };

    // Fix-up
    let x = z;
    while (x !== rbRoot && x.parent && x.parent.color === 'red') {
      const grandparent = x.parent.parent;
      if (!grandparent) break;

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 2,
        explanation: `노드 ${x.value}의 부모(${x.parent.value})가 빨강. 위반 검사.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: currentAux(),
      };

      if (x.parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === 'red') {
          // Case 1: uncle is red - recolor
          x.parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 3,
            explanation: `삼촌(${uncle.value})이 빨강. 부모·삼촌 → 검정, 조부모(${grandparent.value}) → 빨강.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 4,
            explanation: `리컬러링 완료. 조부모(${grandparent.value})로 이동하여 계속 검사.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };

          x = grandparent;
        } else {
          // Case 2/3: uncle is black
          if (x === x.parent.right) {
            // Case 2: LR case - left rotate parent first
            x = x.parent;
            rbRoot = rotateLeft(rbRoot!, x);

            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'current' }],
              codeLine: 6,
              explanation: `LR 경우. 부모(${x.value}) 기준 좌회전.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: currentAux(),
            };
          }

          // Case 3: LL case - right rotate grandparent
          x.parent!.color = 'black';
          grandparent.color = 'red';
          rbRoot = rotateRight(rbRoot!, grandparent);

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 7,
            explanation: `부모(${x.parent!.value}) → 검정, 조부모(${grandparent.value}) → 빨강. 우회전.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };
        }
      } else {
        // Mirror: parent is right child of grandparent
        const uncle = grandparent.left;

        if (uncle && uncle.color === 'red') {
          // Case 1: uncle is red - recolor
          x.parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 3,
            explanation: `삼촌(${uncle.value})이 빨강. 부모·삼촌 → 검정, 조부모(${grandparent.value}) → 빨강.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 4,
            explanation: `리컬러링 완료. 조부모(${grandparent.value})로 이동하여 계속 검사.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };

          x = grandparent;
        } else {
          if (x === x.parent.left) {
            // Case 2: RL case - right rotate parent first
            x = x.parent;
            rbRoot = rotateRight(rbRoot!, x);

            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'current' }],
              codeLine: 6,
              explanation: `RL 경우. 부모(${x.value}) 기준 우회전.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: currentAux(),
            };
          }

          // Case 3: RR case - left rotate grandparent
          x.parent!.color = 'black';
          grandparent.color = 'red';
          rbRoot = rotateLeft(rbRoot!, grandparent);

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 7,
            explanation: `부모(${x.parent!.value}) → 검정, 조부모(${grandparent.value}) → 빨강. 좌회전.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: currentAux(),
          };
        }
      }
    }

    // Root must be black
    rbRoot!.color = 'black';

    yield {
      array: [...a],
      highlights: [{ index: idx, type: 'insert' }],
      codeLine: 8,
      explanation: `루트를 검정으로 설정. ${val} 삽입 완료.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: currentAux(),
    };
  }

  yield {
    array: [...a],
    highlights: [],
    codeLine: 8,
    explanation: `레드-블랙 트리 구성 완료. 총 비교 횟수: ${comparisons}.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: currentAux(),
  };
};
