import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  // define regex
  const findFirst =
    part == 'A'
      ? new RegExp(/.*?([1-9])/, '')
      : new RegExp(
          /.*?([1-9]|one|two|three|four|five|six|seven|eight|nine)/,
          ''
        );
  const findLast =
    part == 'A'
      ? new RegExp(/.*([1-9])/, '')
      : new RegExp(
          /.*([1-9]|one|two|three|four|five|six|seven|eight|nine)/,
          ''
        );
  // iterate over lines and sum up
  return data.sum((line) =>
    Number.parseInt(
      replace(findFirst.exec(line)![1]) + replace(findLast.exec(line)![1])
    )
  );
}
// one liner part A
// input.split(/\r?\n/).reduce((sum, line) => sum + +(new RegExp(/.*?([1-9])/).exec(line)![1] + new RegExp(/.*([1-9])/).exec(line)![1]), 0);
// part B
// input.split(/\r?\n/).reduce((sum, line) => sum + +([new RegExp(/.*?([1-9]|one|two|three|four|five|six|seven|eight|nine)/, '').exec(line)![1],new RegExp(/.*([1-9]|one|two|three|four|five|six|seven|eight|nine)/, '').exec(line)![1]].reduce((a, v) => a + [['one', '1'],['two', '2'],['three', '3'],['four', '4'],['five', '5'],['six', '6'],['seven', '7'],['eight', '8'],['nine', '9']].reduce((a2, v2) => a2.replace(v2[0], v2[1]),v), '')),0);

const replaceArray: [string, string][] = [
  ['1', 'one'],
  ['2', 'two'],
  ['3', 'three'],
  ['4', 'four'],
  ['5', 'five'],
  ['6', 'six'],
  ['7', 'seven'],
  ['8', 'eight'],
  ['9', 'nine'],
];

function replace(num: string): string {
  replaceArray.forEach((e) => {
    num = num.replace(e[1], e[0]);
  });
  return num;
}

// execute and output
// Attention! test data of Part A and B are different. Change day01-data_test.txt before running test for A

lib.execute2('2023', 'day01.ts', run, [
  {
    name: 'A test',
    part: 'A',
    data: ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet'],
    expected: 142,
  },
  //  { name: 'A prod', part: 'A', data: 'prod', expected: 54390 },
  { name: 'B test', part: 'B', data: 'test', expected: 281 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 54277 },
]);

// A: 54390
// B: 54277
