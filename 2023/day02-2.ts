const fs = require('fs');

const REGEX_GAME = new RegExp(/Game (\d+):/, "");
const REGEX_RED = new RegExp(/(\d+) red/, "");
const REGEX_GREEN = new RegExp(/(\d+) green/, "");
const REGEX_BLUE = new RegExp(/(\d+) blue/, "");

let gameSum = 0;

function checkSets(sets: string[]): number {
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
const allFileContents = fs.readFileSync('.\\2023\\day02-data.txt', 'utf-8');
allFileContents.split(/\r?\n/).forEach((line: string) => {
  const gameNo = Number.parseInt(REGEX_GAME.exec(line)![1]);
  const sets = line.split(':')[1].split(';');
  const check = checkSets(sets);
  //console.log(gameNo, sets, check);
  gameSum += check;
});

console.log(gameSum);