import { lib } from '../lib';

const path = require('path');

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const REGEX_GAME = new RegExp(/Game (\d+):/, "");
const REGEX_RED = new RegExp(/(\d+) red/, "");
const REGEX_GREEN = new RegExp(/(\d+) green/, "");
const REGEX_BLUE = new RegExp(/(\d+) blue/, "");

// function logic
function run(data: string[], part: 'A' | 'B') {
  let gameSum = 0;

  data.forEach((line: string) => {
    const gameNo = Number.parseInt(REGEX_GAME.exec(line)![1]);
    const sets = line.split(':')[1].split(';');
    if(part == 'A') {
      const check = checkSets(sets);
      if (check) gameSum += gameNo;
    } else {
      // B 
      gameSum += calcSets(sets);
    }
  });
  return gameSum;
}

function checkSets(sets: string[]): boolean {
  for (let set of sets) {
    const dataRed = REGEX_RED.exec(set);
    if (dataRed && Number.parseInt(dataRed[1]) > MAX_RED) return false;
    const dataGreen = REGEX_GREEN.exec(set);
    if (dataGreen && Number.parseInt(dataGreen[1]) > MAX_GREEN) return false;
    const dataBlue = REGEX_BLUE.exec(set);
    if (dataBlue && Number.parseInt(dataBlue[1]) > MAX_BLUE) return false;
  }
  return true;
}
function calcSets(sets: string[]): number {
  let red = 0, green = 0, blue = 0;
  for (let set of sets) {
    const dataRed = REGEX_RED.exec(set);
    if (dataRed) red = Math.max(red, Number.parseInt(dataRed[1]));
    const dataGreen = REGEX_GREEN.exec(set);
    if (dataGreen) green = Math.max(green, Number.parseInt(dataGreen[1]));
    const dataBlue = REGEX_BLUE.exec(set);
    if (dataBlue) blue = Math.max(blue, Number.parseInt(dataBlue[1]));
  }
  return red * green * blue;
}


// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(dataTest, data, runTest, runProd, runA, runB, run);

// A: 2810
// B: 69110

