import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const elfCarry = data
    .splitByEmptyLine()
    .map((group) => group.map(Number).sum());
  if (part === 'A') {
    return Math.max(...elfCarry);
  } else {
    elfCarry.sort((a, b) => b - a);
    return elfCarry.slice(0, 3).sum();
  }
}

// execute and output
lib.execute2('2022', 'day01.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 24000 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 72602 },
  { name: 'B test', part: 'B', data: 'test', expected: 45000 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 207410 },
]);
