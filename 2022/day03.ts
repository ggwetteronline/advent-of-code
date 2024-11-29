import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    return data
      .map((line) => {
        const [partsA, partsB] = line.splitAt(line.length / 2);
        const letter = partsA.getCommonLetter(partsB);
        return letter.charToNumber();
      })
      .sum();
  } else {
    return data
      .toGroupsOf(3)
      .map((group) => {
        const [elfA, elfB, elfC] = group;
        return elfA.getCommonLetter([elfB, elfC]).charToNumber();
      })
      .sum();
  }
}

// execute and output
lib.execute2('2022', 'day03.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 157 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 7817 },
  { name: 'B test', part: 'B', data: 'test', expected: 70 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 2444 },
]);
