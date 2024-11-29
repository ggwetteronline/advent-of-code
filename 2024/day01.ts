import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const elfCarry: number[] = [];
  let currElfCarry = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== '') {
      const num = Number.parseInt(data[i]);
      currElfCarry += num;
    } else {
      elfCarry.push(currElfCarry);
      currElfCarry = 0;
    }
  }
  // after the last elfs inventory is no blank line
  elfCarry.push(currElfCarry);
  if (part === 'A') {
    return Math.max(...elfCarry);
  } else {
    elfCarry.sort((a, b) => b - a);
    return elfCarry[0] + elfCarry[1] + elfCarry[2];
  }
}

// execute and output
lib.execute2('2024', 'day01.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 24000 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 72602 },
  { name: 'B test', part: 'B', data: 'test', expected: 45000 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 207410 },
]);
