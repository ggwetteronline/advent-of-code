import { Run } from '../lib';

// main function
export function run(data: string[], part: 'A' | 'B') {
  const [c, designs] = data.splitByEmptyLine();
  const colors = c[0].split(', ');

  if (part === 'A') {
    return designs
      .mapRecursiveWithMemory<boolean>((rec, remainingDesign: string) => {
        if (remainingDesign.length == 0) return true;
        for (let i = 0; i < colors.length; i++)
          if (
            remainingDesign.startsWith(colors[i]) &&
            rec(remainingDesign.slice(colors[i].length))
          )
            return true;
        return false;
      })
      .filter((d) => d).length;
  } else {
    return designs
      .mapRecursiveWithMemory<number>((rec, remainingDesign: string) => {
        if (remainingDesign.length == 0) return 1;
        let ways = 0;
        for (let i = 0; i < colors.length; i++)
          if (remainingDesign.startsWith(colors[i]))
            ways += rec(remainingDesign.slice(colors[i].length));
        return ways;
      })
      .sum();
  }
}

export const runs: Run<number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 6 },
  { name: 'prod', part: 'A', data: 'prod', expected: 226 },
  { name: 'test', part: 'B', data: 'test', expected: 16 },
  { name: 'prod', part: 'B', data: 'prod', expected: 601201576113503 },
];
