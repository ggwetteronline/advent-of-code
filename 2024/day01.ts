import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const nums1: number[] = [];
  const nums2: number[] = [];
  data.map((line) => {
    const [a, b] = line.split('   ').map((a) => Number.parseInt(a));
    nums1.push(a);
    nums2.push(b);
  });

  if (part === 'A') {
    // sort lists
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => a - b);
    // get distances
    return nums1.reduce((acc, a, i) => acc + Math.abs(a - nums2[i]), 0);
  } else {
    return nums1.reduce((acc, a) => {
      // how often is a in nums2
      let count = nums2.filter((b) => a == b).length;
      return acc + a * count;
    }, 0);
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 11 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 2815556 },
  { name: 'B test', part: 'B', data: 'test', expected: 31 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 23927637 },
];
