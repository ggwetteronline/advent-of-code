import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const rdata = data[0].split('').map(Number);
  const unzipped: (number | undefined)[] = [];
  let value = true;
  let id = 0;
  rdata.forEach((num) => {
    if (value) {
      for (let i = 0; i < num; i++) {
        unzipped.push(id);
      }
      ++id;
    } else {
      for (let i = 0; i < num; i++) {
        unzipped.push(undefined);
      }
    }
    value = !value;
  });
  if (part === 'A') {
    // swap all undefined with the last defined number
    let endPos = unzipped.length - 1;
    for (let i = 0; i < endPos; i++) {
      if (unzipped[i] === undefined) {
        while (unzipped[endPos] == undefined) {
          --endPos;
        }
        unzipped[i] = unzipped[endPos];
        unzipped[endPos] = undefined;
      }
    }
    // multiply positiom with id
    return unzipped.map((a, i) => (a === undefined ? 0 : i * a)).sum();
  } else {
    // swap all blocks of same id from end to the first block of undefined that fits
    for (let i = unzipped.length - 1; i >= 0; i--) {
      // get last defined block
      while (unzipped[i] === undefined) {
        --i;
      }
      const { id, width } = getLastDefinedBlock(unzipped, i);
      i -= width - 1;

      // get the first block of undefined that fits
      const startPos = getFirstUndefinedBlockThatFits(unzipped, 0, i, width);
      if (startPos) {
        for (let j = 0; j < width; j++) {
          unzipped[startPos - width + j] = id;
          unzipped[i + j] = undefined;
        }
      }
    }
    // console.log(unzipped);

    // multiply positiom with id
    return unzipped.map((a, i) => (a === undefined ? 0 : i * a)).sum();
  }
}

function getLastDefinedBlock(
  unzipped: (number | undefined)[],
  endPos: number
): { id: number; width: number } {
  const id = unzipped[endPos]!;
  let width = 0;
  while (unzipped[endPos] == id) {
    ++width;
    --endPos;
  }
  return { id, width };
}

function getFirstUndefinedBlockThatFits(
  unzipped: (number | undefined)[],
  startPos: number,
  endPos: number,
  definedWidth: number
): number | false {
  let undefinedWidth = 0;
  do {
    undefinedWidth = 0;
    while (unzipped[startPos] !== undefined && startPos < endPos) {
      ++startPos;
    }
    if (startPos === endPos) {
      return false;
    }
    while (unzipped[startPos] === undefined && undefinedWidth < definedWidth) {
      ++undefinedWidth;
      ++startPos;
    }
  } while (undefinedWidth < definedWidth);

  return startPos;
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 1928 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 6356833654075 },
  { name: 'B test', part: 'B', data: 'test', expected: 2858 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 6389911791746 },
];
