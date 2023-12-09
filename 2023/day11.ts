import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const a: number[][] = [];
  for(let line of data) {
    a.push(lib.getNums(line.split(':')[1]));
  }
  return a
}

// execute and output
console.log('Test aim: 12345');
const runTest = true, runProd = false, runA = true, runB = false;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 
// B: 