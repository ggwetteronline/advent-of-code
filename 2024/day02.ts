import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  return 0;
}

// execute and output
lib.execute2('2024', 'day02.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 24000 },
  //{ name: 'A prod', part: 'A', data: 'prod', expected: 72602 },
  //{ name: 'B test', part: 'B', data: 'test', expected: 45000 },
  //{ name: 'B prod', part: 'B', data: 'prod', expected: 207410 },
]);
