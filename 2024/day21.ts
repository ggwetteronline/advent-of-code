import { Point, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const numpad = new NumKeypad();
  const directionpad1 = new DirectionKeypad(numpad);
  const directionPads = [directionpad1];
  for (let i = 1; i < (part === 'A' ? 2 : 25); ++i) {
    const directionpad = new DirectionKeypad(directionPads[i - 1]);
    directionPads.push(directionpad);
  }

  return data
    .map((line) => {
      let res = numpad.steps(line);
      for (let i = 0; i <= directionPads.length; i++) {
        const newRes = new Memory();
        for (const [key, value] of res.entries()) {
          const [x, y, evilPath] = key
            .split(',')
            .map((v, i) => (i < 2 ? parseInt(v) : v === 'true')) as [
            number,
            number,
            boolean
          ];
          const path =
            '<'.repeat(-x > 0 ? -x : 0) +
            'v'.repeat(y > 0 ? y : 0) +
            '^'.repeat(-y > 0 ? -y : 0) +
            '>'.repeat(x > 0 ? x : 0);
          // dont go through evil path
          const adjustedPath =
            (evilPath ? path.split('').reverse().join('') : path) + 'A';
          const subRes = directionpad1.steps(adjustedPath, value);

          for (const [subKey, subValue] of subRes.entries()) {
            newRes.set(subKey, (newRes.get(subKey) || 0) + subValue);
          }
        }
        res = newRes;
      }

      return (
        Array.from(res.values()).reduce((sum, v) => sum + v, 0) *
        Number.parseInt(line)
      );
    })
    .sum();
}

class Memory extends Map<string, number> {}

abstract class Keypad {
  readonly keys: Map<string, Point> = new Map();
  evilPos: Point;
  constructor(keys: (string | undefined)[][]) {
    keys.forEach((row, y) => {
      row.forEach((key, x) => {
        if (key === undefined) {
          this.evilPos = { x, y };
          return;
        }
        this.keys.set(key, { x, y });
      });
    });
  }

  steps(code: string, i = 1): Memory {
    const target = this.keys.get('A')!;
    const point = { x: target.x, y: target.y };
    const res = new Memory();
    for (const char of code) {
      const goto = this.keys.get(char)!;
      const crossEvil =
        (goto.x === this.evilPos.x && point.y === this.evilPos.y) ||
        (goto.y === this.evilPos.y && point.x === this.evilPos.x);
      const key = `${goto.x - point.x},${goto.y - point.y},${crossEvil}`;
      res.set(key, (res.get(key) || 0) + i);
      point.x = goto.x;
      point.y = goto.y;
    }
    return res;
  }
}

class NumKeypad extends Keypad {
  constructor() {
    super([
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      [undefined, '0', 'A'],
    ]);
  }
}

class DirectionKeypad extends Keypad {
  constructor(public pressOn: Keypad) {
    super([
      [undefined, '^', 'A'],
      ['<', 'v', '>'],
    ]);
  }
}

export const runs: Run<number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 126384 },
  { name: 'prod', part: 'A', data: 'prod', expected: 231564 },
  // { name: 'test', part: 'B', data: 'test', expected: 0 },
  { name: 'prod', part: 'B', data: 'prod', expected: 281212077733592 },
];
