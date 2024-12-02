import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    return data
      .map((line) => {
        const reports = line.split(' ').map(Number);
        return (reports.isAscending() || reports.isDescending()) &&
          reports.every(
            (num, index) =>
              index === 0 || num.diffTo(reports[index - 1]).between(1, 3)
          )
          ? 1
          : 0;
      })
      .sum();
  } else if (part === 'B') {
    return data
      .map((line) => {
        const reports = line.split(' ').map(Number);
        for (let i = 0; i <= reports.length; i++) {
          // does it work, if i remove the i-th element?
          const nums = [...reports.slice(0, i), ...reports.slice(i + 1)];
          if (
            (nums.isAscending() || nums.isDescending()) &&
            nums.every(
              (num, index) =>
                index === 0 || num.diffTo(nums[index - 1]).between(1, 3)
            )
          ) {
            return 1;
          }
        }
        return 0;
      })
      .sum();
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 2 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 369 },
  { name: 'B test', part: 'B', data: 'test', expected: 4 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 428 },
];
