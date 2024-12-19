import { Run } from '../lib';
import { forEachRecursiveWithMemory, recursiveWithMemory } from '../lib/lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const [c, designs] = data.splitByEmptyLine();
  const colors = c[0].split(', ');

  if (part === 'A') {
    return forEachRecursiveWithMemory(
      (rec: (c: string) => boolean, remainingDesign: string) => {
        if (remainingDesign.length == 0) return true;
        for (let i = 0; i < colors.length; i++) {
          if (
            remainingDesign.startsWith(colors[i]) &&
            rec(remainingDesign.slice(colors[i].length))
          )
            return true;
        }
        return false;
      },
      designs
    ).filter((d) => d).length;
  } else {
    return forEachRecursiveWithMemory((rec, remainingDesign: string) => {
      if (remainingDesign.length == 0) return 1;
      let ways = 0;
      for (let i = 0; i < colors.length; i++) {
        if (remainingDesign.startsWith(colors[i])) {
          ways += rec(remainingDesign.slice(colors[i].length)) as number;
        }
      }
      return ways;
    }, designs).sum();
  }
}

export const runs: Run<number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 6 },
  { name: 'prod', part: 'A', data: 'prod', expected: 226 },
  { name: 'test', part: 'B', data: 'test', expected: 16 },
  { name: 'prod', part: 'B', data: 'prod', expected: 601201576113503 },
];
