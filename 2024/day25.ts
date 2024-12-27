import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const locks: number[][] = [];
  const keys: number[][] = [];
  data.splitByEmptyLine().forEach((group) => {
    const a = group.transpose();
    if (group[0].startsWith('#')) {
      locks.push(a.map((row) => row.countChar('#') - 1));
    } else {
      keys.push(a.map((row) => row.countChar('#') - 1));
    }
  });
  let count = 0;
  locks.forEach((lock) => {
    keys.forEach((key) => {
      for (let i = 0; i < lock.length; i++) {
        // the sum is 6 or larger if the locks overlap
        if (lock[i] + key[i] >= 6) {
          return;
        }
      }
      count++;
    });
  });
  return count;
}

export const runs: Run<number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 3 },
  { name: 'prod', part: 'A', data: 'prod', expected: 3508 },
];
