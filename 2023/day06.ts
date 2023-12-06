import { lib } from '../lib';

const path = require('path');

// function logic
function solve(data: string[], part: 'A' | 'B') {
  const races: { time: number, distance: number }[] = [];
  // get race times and distances
  if (part == 'A') {
    const [times, distances] = data.map(a => lib.getNums(a.split(':')[1]));
    for (let i = 0; i < times.length; ++i) {
      races.push({ time: times[i], distance: distances[i] });
    }
  } else {
    const [times, distances] = data.map(a => lib.getNums(a.split(':')[1].replaceAll(' ', '')));
    races.push({ time: times[0], distance: distances[0] });
  }

  // caclulate wins
  let totalWins = 0;
  for (let i = 0; i < races.length; ++i) {
    let winsOfThisRound = 0;
    for (let holdSecs = 1; holdSecs < races[i].time; ++holdSecs) {
      const distanceOfThisRound = holdSecs * (races[i].time - holdSecs);
      if (distanceOfThisRound > races[i].distance) {
        ++winsOfThisRound;
      }
    }
    totalWins = (totalWins == 0) ? winsOfThisRound : totalWins * winsOfThisRound;
  }
  return totalWins;
}

// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(dataTest, data, runTest, runProd, runA, runB, solve);

// A: 633080
// B: 20048741
