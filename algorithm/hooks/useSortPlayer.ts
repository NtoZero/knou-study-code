import { useReducer, useCallback, useRef, useEffect } from 'react';
import { SortStep, SortGenerator, AlgorithmGenerator } from '../types/sort';

interface PlayerState {
  steps: SortStep[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number; // ms per step
  algorithmId: string;
  inputArray: number[];
}

type PlayerAction =
  | { type: 'LOAD'; steps: SortStep[]; algorithmId: string; inputArray: number[] }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'GO_TO'; index: number }
  | { type: 'SET_SPEED'; speed: number };

function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        steps: action.steps,
        currentIndex: 0,
        isPlaying: false,
        algorithmId: action.algorithmId,
        inputArray: action.inputArray,
      };
    case 'STEP_FORWARD':
      if (state.currentIndex >= state.steps.length - 1) {
        return { ...state, isPlaying: false };
      }
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'STEP_BACKWARD':
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESET':
      return { ...state, currentIndex: 0, isPlaying: false };
    case 'GO_TO':
      return { ...state, currentIndex: Math.max(0, Math.min(action.index, state.steps.length - 1)) };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    default:
      return state;
  }
}

const initialState: PlayerState = {
  steps: [],
  currentIndex: 0,
  isPlaying: false,
  speed: 300,
  algorithmId: 'selection',
  inputArray: [],
};

export function useSortPlayer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef<number | null>(null);

  const load = useCallback((generator: AlgorithmGenerator, array: number[], algorithmId: string) => {
    const gen = (generator as SortGenerator)([...array]);
    const steps: SortStep[] = [];
    let result = gen.next();
    while (!result.done) {
      steps.push(result.value);
      result = gen.next();
    }
    dispatch({ type: 'LOAD', steps, algorithmId, inputArray: array });
  }, []);

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const stepForward = useCallback(() => dispatch({ type: 'STEP_FORWARD' }), []);
  const stepBackward = useCallback(() => dispatch({ type: 'STEP_BACKWARD' }), []);
  const goTo = useCallback((index: number) => dispatch({ type: 'GO_TO', index }), []);
  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', speed }), []);

  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = window.setInterval(() => {
        dispatch({ type: 'STEP_FORWARD' });
      }, state.speed);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isPlaying, state.speed]);

  const currentStep = state.steps[state.currentIndex] || null;
  const isAtEnd = state.currentIndex >= state.steps.length - 1;
  const isAtStart = state.currentIndex === 0;
  const totalSteps = state.steps.length;
  const progress = totalSteps > 0 ? state.currentIndex / (totalSteps - 1) : 0;

  return {
    state,
    currentStep,
    isAtEnd,
    isAtStart,
    totalSteps,
    progress,
    load,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    goTo,
    setSpeed,
  };
}
