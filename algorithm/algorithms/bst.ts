import { SortStep, SortGenerator, BSTAux } from '../types/sort';
import { TreeNode } from '../types/graph';

function cloneTree(node: TreeNode | null | undefined): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function collectNodes(node: TreeNode | null | undefined): TreeNode[] {
  if (!node) return [];
  return [node, ...collectNodes(node.left), ...collectNodes(node.right)];
}

function layoutTree(node: TreeNode | null | undefined, x: number, y: number, spread: number): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  layoutTree(node.left, x - spread, y + 60, spread / 2);
  layoutTree(node.right, x + spread, y + 60, spread / 2);
}

function resetStates(node: TreeNode | null | undefined): void {
  if (!node) return;
  node.state = 'default';
  resetStates(node.left);
  resetStates(node.right);
}

function findNode(node: TreeNode | null | undefined, value: number): TreeNode | null {
  if (!node) return null;
  if (node.value === value) return node;
  return findNode(node.left, value) || findNode(node.right, value);
}

function makeAux(root: TreeNode | null): BSTAux {
  const cloned = cloneTree(root);
  if (cloned) layoutTree(cloned, 300, 30, 120);
  return {
    kind: 'bst',
    nodes: cloned ? collectNodes(cloned) : [],
    root: cloned,
  };
}

export const bstOperations: SortGenerator = function* (arr) {
  const a = [...arr];
  let comparisons = 0;
  let root: TreeNode | null = null;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `BST 연산 시작. 삽입할 값: [${a.join(', ')}].`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(null),
  };

  // Insert each value
  for (let idx = 0; idx < a.length; idx++) {
    const val = a[idx];
    resetStates(root);

    yield {
      array: [...a],
      highlights: [{ index: idx, type: 'current' }],
      codeLine: 9,
      explanation: `BST_Insert: 값 ${val} 삽입 시작.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(root),
    };

    if (!root) {
      root = { value: val, left: null, right: null, state: 'insert' };

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'insert' }],
        codeLine: 19,
        explanation: `트리가 비어있음. 새 노드 ${val}을(를) 루트로 생성.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
    } else {
      let current: TreeNode = root;
      let inserted = false;

      while (!inserted) {
        comparisons++;
        current.state = 'compare';

        yield {
          array: [...a],
          highlights: [{ index: idx, type: 'current' }],
          codeLine: 11,
          explanation: `${val}과 노드 ${current.value} 비교.`,
          stats: { comparisons, swaps: 0 },
          auxiliaryData: makeAux(root),
        };

        current.state = 'default';

        if (val < current.value) {
          if (!current.left) {
            current.left = { value: val, left: null, right: null, state: 'insert' };
            inserted = true;

            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'insert' }],
              codeLine: 20,
              explanation: `${val} < ${current.value}. 왼쪽 자식에 ${val} 삽입.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: makeAux(root),
            };
          } else {
            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'current' }],
              codeLine: 15,
              explanation: `${val} < ${current.value}. 왼쪽 서브트리로 이동.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: makeAux(root),
            };
            current = current.left;
          }
        } else if (val > current.value) {
          if (!current.right) {
            current.right = { value: val, left: null, right: null, state: 'insert' };
            inserted = true;

            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'insert' }],
              codeLine: 21,
              explanation: `${val} > ${current.value}. 오른쪽 자식에 ${val} 삽입.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: makeAux(root),
            };
          } else {
            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'current' }],
              codeLine: 16,
              explanation: `${val} > ${current.value}. 오른쪽 서브트리로 이동.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: makeAux(root),
            };
            current = current.right;
          }
        } else {
          // Duplicate value
          inserted = true;
          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 12,
            explanation: `${val}은(는) 이미 트리에 존재. 삽입 생략.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: makeAux(root),
          };
        }
      }
    }

    resetStates(root);
  }

  // Search for the last value
  const searchKey = a[a.length - 1];
  resetStates(root);

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 0,
    explanation: `BST_Search: 키 ${searchKey} 탐색 시작.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(root),
  };

  let searchNode: TreeNode | null = root;

  while (searchNode) {
    comparisons++;
    searchNode.state = 'compare';

    if (searchKey === searchNode.value) {
      searchNode.state = 'found';

      yield {
        array: [...a],
        highlights: [{ index: a.length - 1, type: 'found' }],
        codeLine: 3,
        explanation: `키 ${searchKey} = 노드 ${searchNode.value}. 탐색 성공.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
      return;
    }

    if (searchKey < searchNode.value) {
      yield {
        array: [...a],
        highlights: [{ index: a.length - 1, type: 'target' }],
        codeLine: 5,
        explanation: `${searchKey} < ${searchNode.value}. 왼쪽 서브트리로 이동.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
      searchNode.state = 'default';
      searchNode = searchNode.left ?? null;
    } else {
      yield {
        array: [...a],
        highlights: [{ index: a.length - 1, type: 'target' }],
        codeLine: 6,
        explanation: `${searchKey} > ${searchNode.value}. 오른쪽 서브트리로 이동.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(root),
      };
      searchNode.state = 'default';
      searchNode = searchNode.right ?? null;
    }
  }

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 7,
    explanation: `null 도달. 키 ${searchKey}을(를) 찾지 못함.`,
    stats: { comparisons, swaps: 0 },
    auxiliaryData: makeAux(root),
  };
};
