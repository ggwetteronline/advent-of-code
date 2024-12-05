import { Run, Direction, Point } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    let sum = 0;
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        if (data[row][col] === 'X') {
          sum += checkXMAS(data, { x: col, y: row });
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
function checkXMAS(data: string[], startPoint: Point): number {
  const directions = Direction.getDirectionsArray();
  const targetWord = 'XMAS';
  let foundWords = 0;
  for (const direction of directions) {
    try {
      if (direction.getValuesFromLine(data, startPoint, 4) == targetWord) {
        foundWords++;
      }
    } catch (e) {
      // error is thrown, if we are out of bounds
      // do nothing
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
  const topLeft = data[row - 1][col - 1];
  const topRight = data[row - 1][col + 1];
  const bottomLeft = data[row + 1][col - 1];
  const bottomRight = data[row + 1][col + 1];
  return (
    // diagonal top left to bottom right must be MAS or SAM
    ((topLeft === 'M' && bottomRight === 'S') ||
      (topLeft === 'S' && bottomRight === 'M')) &&
    // diagonal top right to bottom left must be MAS or SAM
    ((topRight === 'M' && bottomLeft === 'S') ||
      (topRight === 'S' && bottomLeft === 'M'))
  );
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 18 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 2390 },
  { name: 'B test', part: 'B', data: 'test', expected: 9 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 1809 },
];
