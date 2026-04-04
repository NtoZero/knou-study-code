import { useState, useEffect, useCallback } from 'react';
import { AlgorithmCategory } from './types/sort';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';
import { BarChart } from './components/visualization/BarChart';
import { HeapTree } from './components/visualization/HeapTree';
import { AuxiliaryView } from './components/visualization/AuxiliaryView';
import { ComparisonMode } from './components/visualization/ComparisonMode';
import { DebugToolbar } from './components/controls/DebugToolbar';
import { ArrayInput } from './components/controls/ArrayInput';
import { AlgorithmSelector } from './components/controls/AlgorithmSelector';
import { CategorySelector } from './components/controls/CategorySelector';
import { SearchInput } from './components/controls/SearchInput';
import { TreeOperationInput } from './components/controls/TreeOperationInput';
import { GraphInput as GraphInputComponent } from './components/controls/GraphInput';
import { PseudocodePanel } from './components/panels/PseudocodePanel';
import { ExplanationPanel } from './components/panels/ExplanationPanel';
import { VariablesPanel } from './components/panels/VariablesPanel';
import { InfoPanel } from './components/panels/InfoPanel';
import { AlgorithmGuidePanel } from './components/panels/AlgorithmGuidePanel';
import { useSortPlayer } from './hooks/useSortPlayer';
import { useArrayInput } from './hooks/useArrayInput';
import { algorithms } from './algorithms';
import { generateRandomArray } from './utils/array';

const categoryDefaults: Record<AlgorithmCategory, string> = {
  sort: 'selection',
  search: 'sequential-search',
  graph: 'dfs',
};

export default function App() {
  const [category, setCategory] = useState<AlgorithmCategory>('sort');
  const [algorithmId, setAlgorithmId] = useState('selection');
  const [compareMode, setCompareMode] = useState(false);
  const [compareId, setCompareId] = useState('bubble');
  const [infoOpen, setInfoOpen] = useState(false);
  const player = useSortPlayer();
  const arrayInput = useArrayInput(10);

  // Search-specific state
  const [searchKey, setSearchKey] = useState(5);

  // Tree-specific state
  const [treeValues, setTreeValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);

  // Graph-specific state
  const [graphIndex, setGraphIndex] = useState(0);
  const [startVertex, setStartVertex] = useState(0);

  const currentAlg = algorithms[algorithmId];
  const inputType = currentAlg?.meta.inputType || 'array';

  // Build the input array based on algorithm type
  const getInputArray = useCallback((): number[] => {
    if (!currentAlg) return arrayInput.array;
    const it = currentAlg.meta.inputType;

    if (it === 'graph') {
      return [graphIndex, startVertex];
    }
    if (it === 'tree') {
      return treeValues;
    }
    // For search algorithms that need a key appended
    if (algorithmId === 'sequential-search' || algorithmId === 'binary-search') {
      return [...arrayInput.array, searchKey];
    }
    return arrayInput.array;
  }, [currentAlg, algorithmId, arrayInput.array, searchKey, treeValues, graphIndex, startVertex]);

  useEffect(() => {
    if (!currentAlg) return;
    const input = getInputArray();
    player.load(currentAlg.generator as any, input, algorithmId);
  }, [algorithmId, arrayInput.array, searchKey, treeValues, graphIndex, startVertex]);

  const handleCategoryChange = (cat: AlgorithmCategory) => {
    setCategory(cat);
    const defaultId = categoryDefaults[cat];
    setAlgorithmId(defaultId);
    setCompareMode(false);
  };

  const handleAlgorithmChange = (id: string) => {
    setAlgorithmId(id);
    // Update category based on algorithm
    const meta = algorithms[id]?.meta;
    if (meta?.category) setCategory(meta.category);

    if (id === compareId) {
      const other = Object.keys(algorithms).find(k => k !== id);
      if (other) setCompareId(other);
    }

    // Set default graph index for specific algorithms
    if (meta?.inputType === 'graph') {
      const defaultGraphIndices: Record<string, number> = {
        dfs: 0, bfs: 0,
        'topological-sort': 2, 'connected-components': 1,
        kruskal: 4, prim: 4, dijkstra: 5,
        'bellman-ford': 7, 'floyd-warshall': 9, 'ford-fulkerson': 10,
      };
      if (defaultGraphIndices[id] !== undefined) {
        setGraphIndex(defaultGraphIndices[id]);
      }
      setStartVertex(0);
    }
  };

  const handleApplyInput = () => {
    return arrayInput.applyInput();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      switch (e.key) {
        case 'F10':
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          player.stepForward();
          break;
        case 'F9':
        case 'ArrowLeft':
          e.preventDefault();
          player.stepBackward();
          break;
        case 'F5':
          e.preventDefault();
          if (e.shiftKey) {
            player.reset();
          } else {
            player.isAtEnd ? player.reset() : player.play();
          }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [player.stepForward, player.stepBackward, player.play, player.reset, player.isAtEnd]);

  if (compareMode) {
    return (
      <div className="h-screen flex flex-col">
        <Header>
          <CategorySelector selected={category} onSelect={handleCategoryChange} />
          <AlgorithmSelector
            selected={algorithmId}
            onSelect={handleAlgorithmChange}
            compareMode={compareMode}
            compareId={compareId}
            onCompareSelect={setCompareId}
            onToggleCompare={() => setCompareMode(m => !m)}
          />
        </Header>
        <div className="flex-1 overflow-y-auto p-4">
          <ComparisonMode algorithmIds={[algorithmId, compareId]} array={arrayInput.array} />
        </div>
      </div>
    );
  }

  // Determine which input component to show
  const renderInput = () => {
    if (inputType === 'graph') {
      return (
        <GraphInputComponent
          graphIndex={graphIndex}
          onGraphIndexChange={setGraphIndex}
          startVertex={startVertex}
          onStartVertexChange={setStartVertex}
          disabled={player.state.isPlaying}
        />
      );
    }
    if (inputType === 'tree') {
      return (
        <TreeOperationInput
          initialValues={treeValues}
          onInitialValuesChange={setTreeValues}
          onApply={() => {}}
          onRandomize={() => {
            const vals = generateRandomArray(7, 99);
            setTreeValues(vals);
          }}
          disabled={player.state.isPlaying}
        />
      );
    }
    if (algorithmId === 'sequential-search' || algorithmId === 'binary-search') {
      return (
        <SearchInput
          arrayText={arrayInput.inputText}
          onArrayChange={arrayInput.setInputText}
          searchKey={searchKey}
          onSearchKeyChange={setSearchKey}
          onApply={handleApplyInput}
          onRandomize={() => {
            arrayInput.randomize();
            setSearchKey(Math.floor(Math.random() * 50) + 1);
          }}
          disabled={player.state.isPlaying}
        />
      );
    }
    return (
      <ArrayInput
        inputText={arrayInput.inputText}
        onInputChange={arrayInput.setInputText}
        onApply={handleApplyInput}
        onRandomize={() => arrayInput.randomize()}
        disabled={player.state.isPlaying}
      />
    );
  };

  // Determine if we should show BarChart (only for array-based sort/search)
  const showBarChart = inputType === 'array';

  const left = player.currentStep && (
    <>
      {showBarChart && <BarChart step={player.currentStep} />}

      {player.currentStep.auxiliaryData?.kind === 'heap' && (
        <HeapTree step={player.currentStep} heapAux={player.currentStep.auxiliaryData} />
      )}
      {player.currentStep.auxiliaryData && player.currentStep.auxiliaryData.kind !== 'heap' && (
        <AuxiliaryView data={player.currentStep.auxiliaryData} />
      )}

      <AlgorithmGuidePanel algorithmId={algorithmId} />

      <ExplanationPanel step={player.currentStep} />
    </>
  );

  const right = player.currentStep && (
    <>
      <PseudocodePanel pseudocode={currentAlg.pseudocode} currentLine={player.currentStep.codeLine} />
      <VariablesPanel step={player.currentStep} />
      <details open={infoOpen} onToggle={(e) => setInfoOpen((e.target as HTMLDetailsElement).open)}>
        <summary className="text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 py-1">
          알고리즘 정보
        </summary>
        <InfoPanel meta={currentAlg.meta} />
      </details>
    </>
  );

  return (
    <div className="h-screen flex flex-col">
      <Header>
        <CategorySelector selected={category} onSelect={handleCategoryChange} />
        <AlgorithmSelector
          selected={algorithmId}
          onSelect={handleAlgorithmChange}
          compareMode={compareMode}
          compareId={compareId}
          onCompareSelect={setCompareId}
          onToggleCompare={() => setCompareMode(m => !m)}
        />
        {renderInput()}
        <div className="flex-1" />
        {player.currentStep && (
          <DebugToolbar
            isPlaying={player.state.isPlaying}
            isAtStart={player.isAtStart}
            isAtEnd={player.isAtEnd}
            currentIndex={player.state.currentIndex}
            totalSteps={player.totalSteps}
            onPlay={player.play}
            onPause={player.pause}
            onStepForward={player.stepForward}
            onStepBackward={player.stepBackward}
            onReset={player.reset}
          />
        )}
      </Header>
      <MainLayout left={left} right={right} />
    </div>
  );
}
