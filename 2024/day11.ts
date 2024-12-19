import { recursiveWithMemory, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const nums = data[0].split(' ').map(Number);
  const blink = part === 'A' ? 25 : 75;

  return nums
    .map((n) => {
      return recursiveWithMemory(
        (rec, num: number, repeat: number) => {
          if (repeat === 0) return 1;
          return blinkf(num)
            .map((n) => rec(n, repeat - 1))
            .sum();
        },
        n,
        blink
      );

      //return recursiveBlink(n, blink);
    })
    .sum();
}

function blinkf(num: number): number[] {
  if (num === 0) {
    // replace 0 by 1
    return [1];
  } else {
    // even amount of digits => split in half
    const numDigits = num.numberOfDigits();
    if (numDigits % 2 == 0) {
      const divisor = Math.pow(10, numDigits / 2);
      const firstPart = Math.floor(num / divisor);
      const secondPart = num % divisor;
      return [firstPart, secondPart];
    } else {
      // else multiply by 2024
      return [num * 2024];
    }
  }
}

// we do not want to calculate the same path multiple times, so we use a memory
const recursiveBlinkMemo = new Map<string, number>();

function recursiveBlink(num: number, repeat: number): number {
  const key = `${num}-${repeat}`;
  if (recursiveBlinkMemo.has(key)) {
    return recursiveBlinkMemo.get(key)!;
  }

  let result: number;
  if (repeat === 0) {
    result = 1;
  } else {
    result = blinkf(num)
      .map((n) => recursiveBlink(n, repeat - 1))
      .sum();
  }

  recursiveBlinkMemo.set(key, result);
  return result;
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 55312 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 199753 },
  { name: 'B test', part: 'B', data: 'test', expected: 65601038650482 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 239413123020116 },
];
