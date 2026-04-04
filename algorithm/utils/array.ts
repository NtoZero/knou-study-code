export function generateRandomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function parseArrayInput(input: string): number[] | null {
  const nums = input.split(/[,\s]+/).filter(Boolean).map(Number);
  if (nums.some(isNaN) || nums.length < 2) return null;
  return nums;
}
