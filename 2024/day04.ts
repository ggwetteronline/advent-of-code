import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    let sum = 0;
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        if (data[row][col] === 'X') {
          sum += checkXMAS(data, row, col);
        }
      }
    }
    return sum;
  } else {
    let sum = 0;
    // we only go from 1 to length - 1, because there can be no A in MAS at the border
    for (let row = 1; row < data.length - 1; row++) {
      for (let col = 1; col < data[row].length - 1; col++) {
        if (data[row][col] === 'A' && checkMAS(data, row, col)) {
          sum += 1;
        }
      }
    }
    return sum;
  }
}

/**
 * Check for xmas at a position where we already found X
 * @param data all chars in string array
 * @param row row, where we found X
 * @param col col, where we found X
 * @returns amount of XMAS found from this position
 */
function checkXMAS(data: string[], row: number, col: number): number {
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];
  const targetWord = 'XMAS';
  const wordLength = targetWord.length;
  let foundWords = 0;

  for (const direction of directions) {
    let x = col;
    let y = row;
    let matches = true; // if the word matches till now
    // start at 1, because we already found X
    for (let i = 1; i < wordLength && matches; i++) {
      x += direction[0];
      y += direction[1];
      // Check if the new position is within bounds
      if (x < 0 || x >= data[0].length || y < 0 || y >= data.length) {
        matches = false;
        break;
      }
      // Check if the character matches the word
      if (data[y][x] !== targetWord[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      ++foundWords;
    }
  }
  return foundWords;
}

/**
 * Check if MAS is found at a position, where we already found the center A
 * @param data all chars in string array
 * @param row row, where we found X
 * @param col col, where we found X
 * @returns true, if this is a X-MAS
 */
function checkMAS(data: string[], row: number, col: number): boolean {
  return (
    // diagonal top left to bottom right must be MAS or SAM
    ((data[row - 1][col - 1] === 'M' && data[row + 1][col + 1] === 'S') ||
      (data[row - 1][col - 1] === 'S' && data[row + 1][col + 1] === 'M')) &&
    // diagonal top right to bottom left must be MAS or SAM
    ((data[row - 1][col + 1] === 'M' && data[row + 1][col - 1] === 'S') ||
      (data[row - 1][col + 1] === 'S' && data[row + 1][col - 1] === 'M'))
  );
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 18 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 2390 },
  { name: 'B test', part: 'B', data: 'test', expected: 9 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 1809 },
];
