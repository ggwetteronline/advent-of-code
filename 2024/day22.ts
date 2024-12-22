import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const codes = data.map(Number);

  if (part === 'A') {
    for (let li = 0; li < codes.length; li++) {
      for (let i = 0; i < 2000; ++i) {
        codes[li] = evolveSecretNumber(codes[li]);
      }
    }
    return codes.sum();
  } else {
    const total: Record<string, number> = {};

    for (let code of codes) {
      let price = code % 10;
      const pattern: [number, number][] = []; // [change, value]

      for (let i = 0; i < 2000; i++) {
        code = evolveSecretNumber(code);
        const price2 = code % 10;
        pattern.push([price2 - price, price2]);
        price = price2;
      }

      const checkedPatterns = new Set<string>();
      for (let i = 0; i < pattern.length - 4; i++) {
        const pat = pattern
          .slice(i, i + 4)
          .map(([delta]) => delta)
          .join(','); // last 4 changes as string (key)
        const val = pattern[i + 3][1]; // value after last change / banans to buy

        // store the bananas we get the first time this pattern occurs
        if (checkedPatterns.has(pat) == false) {
          checkedPatterns.add(pat);
          if (!(pat in total)) {
            total[pat] = val;
          } else {
            total[pat] += val;
          }
        }
      }
    }
    return Math.max(...Object.values(total));
  }
}

const PRUNE_MODULO = 16777216;
function mixAndPrune(value: number, secretNum: number): number {
  secretNum ^= value;
  // no negative result -> so add PRUNE_MODULO and then modulo PRUNE_MODULO
  secretNum = ((secretNum % PRUNE_MODULO) + PRUNE_MODULO) % PRUNE_MODULO;
  return secretNum;
}
function evolveSecretNumber(secretNum: number): number {
  secretNum = mixAndPrune(secretNum * 64, secretNum);
  secretNum = mixAndPrune(Math.floor(secretNum / 32), secretNum);
  secretNum = mixAndPrune(secretNum * 2048, secretNum);
  return secretNum;
}

export const runs: Run<number>[] = [
  {
    name: 'test',
    part: 'A',
    data: ['1', '10', '100', '2024'],
    expected: 37327623,
  },
  { name: 'prod', part: 'A', data: 'prod', expected: 13764677935 },
  { name: 'test', part: 'B', data: 'test', expected: 23 },
  { name: 'prod', part: 'B', data: 'prod', expected: 1619 },
];
