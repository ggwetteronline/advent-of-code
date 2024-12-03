import { lib, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    return data
      .map((line) => {
        // search for instructions
        const instructions = lib.getAll(
          line,
          new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/, 'g'),
          false
        ) as [string, string][];
        // multiply values of each instruction
        return instructions
          .map((instruction) => {
            const [a, b] = instruction.map(Number);
            return a * b;
          })
          .sum();
      })
      .sum();
  } else {
    // "At the beginning of the program, mul instructions are enabled."
    // This means, we do not reset the enabled flag after each line
    let enabled = true;
    return data
      .map((line) => {
        // search for mul() instructions and do() and don't() instructions
        const instructions = lib.getAll(
          line,
          new RegExp(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/, 'g'),
          false
        ) as string[][];
        // do() enables mul() instructions, don't() disables them
        return instructions
          .map((instruction) => {
            if (instruction[0] === 'do()') {
              enabled = true;
              return 0;
            } else if (instruction[0] === "don't()") {
              enabled = false;
              return 0;
            } else if (enabled && instruction[0].startsWith('mul(')) {
              // instructions are now ['mul(a,b)', 'a', 'b'], so we have to slice
              const [a, b] = instruction.slice(1).map(Number);
              return a * b;
            }
            return 0;
          })
          .sum();
      })
      .sum();
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 161 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 175615763 },
  {
    name: 'B test',
    part: 'B',
    data: [
      `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
    ],
    expected: 48,
  },
  { name: 'B prod', part: 'B', data: 'prod', expected: 74361272 },
];
