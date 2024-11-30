import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  return data
    .map((line) => {
      const [elfA, elfB] = line
        .split(',')
        .map((a) => a.split('-').map((b) => Number.parseInt(b)));
      if (part === 'A') {
        if (
          (elfA[0] >= elfB[0] && elfA[1] <= elfB[1]) ||
          (elfA[0] <= elfB[0] && elfA[1] >= elfB[1])
        ) {
          return 1;
        }
      } else {
        if (
          // at least one number of b is between a
          (elfA[0] <= elfB[0] && elfB[0] <= elfA[1]) ||
          (elfA[0] <= elfB[1] && elfB[1] <= elfA[1]) ||
          // at least one number of a is between b
          (elfB[0] <= elfA[0] && elfA[0] <= elfB[1]) ||
          (elfB[0] <= elfA[1] && elfA[1] <= elfB[1])
        ) {
          return 1;
        }
      }
      return 0;
    })
    .sum();
}

// execute and output
lib.execute2('2022', 'day04.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 2 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 448 },
  { name: 'B test', part: 'B', data: 'test', expected: 4 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 794 },
]);
