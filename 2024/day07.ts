import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  return data
    .map((line) => {
      const [result, ...values] = line.split(/: | /).map(Number);
      return checkAndNext(0, values, result, part === 'B');
    })
    .sum();
}

function checkAndNext(
  result: number,
  remaining: number[],
  target: number,
  concat: boolean
): number {
  if (result === target && remaining.length === 0) {
    // we got the result
    return result;
  }
  if (result > target || remaining.length === 0) {
    // we can't get the result, abort
    return 0; // we return 0 so this path is ignored by Math.max / the sum
  }
  const [next, ...rest] = remaining;
  const nextMult = calcMult(result, next, rest, target, concat);
  const nextSum = calcSum(result, next, rest, target, concat);
  const nextConcat = concat ? calcConcat(result, next, rest, target) : 0;
  // get the max of the three possible next steps (all invalid paths return 0)
  return Math.max(nextMult, nextSum, nextConcat);
}

function calcMult(
  a: number,
  b: number,
  remaining: number[],
  target: number,
  concat: boolean
): number {
  return checkAndNext(a * b, remaining, target, concat);
}

function calcSum(
  a: number,
  b: number,
  remaining: number[],
  target: number,
  concat: boolean
): number {
  return checkAndNext(a + b, remaining, target, concat);
}

function calcConcat(
  a: number,
  b: number,
  remaining: number[],
  target: number
): number {
  return checkAndNext(Number.parseInt(`${a}${b}`), remaining, target, true);
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 3749 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 465126289353 },
  { name: 'B test', part: 'B', data: 'test', expected: 11387 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 70597497486371 },
];
