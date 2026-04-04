import { useState, useCallback } from 'react';
import { generateRandomArray, parseArrayInput } from '../utils/array';

export function useArrayInput(defaultSize = 10) {
  const [array, setArray] = useState<number[]>(() => generateRandomArray(defaultSize));
  const [inputText, setInputText] = useState('');

  const randomize = useCallback((size = defaultSize) => {
    const newArr = generateRandomArray(size);
    setArray(newArr);
    setInputText('');
  }, [defaultSize]);

  const applyInput = useCallback(() => {
    const parsed = parseArrayInput(inputText);
    if (parsed) {
      setArray(parsed);
      return true;
    }
    return false;
  }, [inputText]);

  return { array, inputText, setInputText, randomize, applyInput, setArray };
}
