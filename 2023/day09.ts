import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const startRows: number[][] = [];
  for(let line of data) {
    startRows.push(lib.getNums(line));
  }

  let sum = 0;
  for(let currentStartRow of startRows) {
    const tmpRows: number[][] = [];
    tmpRows.push(currentStartRow);
    let deep = 0;
    // create derived rows
    do {
      tmpRows.push([]);
      for(let i = 1; i < tmpRows[deep].length; ++i) {
        tmpRows[deep+1].push(tmpRows[deep][i] - tmpRows[deep][i-1]);
      }
      ++deep;
    } while(isRowZero(tmpRows[deep]) == false)
    // calculate next / previous number
    while( deep > 0) {
      if(part == 'A') {
        tmpRows[deep-1].push(tmpRows[deep-1][tmpRows[deep-1].length-1] + tmpRows[deep][tmpRows[deep].length-1])  
      } else {
        tmpRows[deep-1].unshift(tmpRows[deep-1][0] - tmpRows[deep][0])
      }
      --deep;
    }
    // sum the first / last numbers 
    if(part == 'A') {
      sum+= tmpRows[0][tmpRows[0].length-1]
    } else {
      sum+= tmpRows[0][0]
    }
  }
  return sum;
}

// check if all values in row are zero
function isRowZero(arr: number[]) {
  for(let i = 0; i < arr.length; ++i) {
    if(arr[i] != 0) return false;
  }
  return true;
}

// execute and output
console.log('Test aim: 114');
const runTest = false, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 1584748274
// B: 1026