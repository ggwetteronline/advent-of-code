import { lib } from '../lib';

const path = require('path');

// function logic
function run(data: string[], part: 'A' | 'B') {
  const a: number[][] = [];
  for(let line of data) {
    a.push(lib.getNums(line.split(':')[1]));
  }
  return a
}

// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
console.log('Test aim: 12345');
const runTest = true, runProd = false, runA = true, runB = false;
lib.execute(dataTest, data, runTest, runProd, runA, runB, run);

// A: 
// B: 