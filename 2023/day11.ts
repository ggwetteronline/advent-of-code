import { lib } from '../lib';

class Galaxy {
  constructor(public x: number, public y: number){}
}

// function logic
function run(data: string[], part: 'A' | 'B') {
  const positions: string[][] = [];
  const galaxies: Galaxy[] = [];
  const emptyRows: number[] = [];
  const emptyColumns: number[] = [];
  for(let line of data) {
    positions.push(line.split(''));
  }
  // add horizontal space
  for(let i = 0; i < positions.length; ++i) {
    let isEmpty = true;
    for(let j = 0; j < positions[i].length && isEmpty; ++j) {
      if(positions[i][j] == '#') {
        isEmpty = false;
      }
    }
    if(isEmpty == true) {
      emptyColumns.push(i);
    }
  }
  //add vertical space
  for(let i = 0; i < positions[0].length; ++i) {
    let isEmpty = true;
    for(let j = 0; j < positions.length && isEmpty; ++j) {
      if(positions[j][i] == '#') {
        isEmpty = false;
      }
    }
    if(isEmpty == true) {
      emptyRows.push(i)
    }
  }
  // get galaxy positions
  const addEmptyMultip = part == 'A' ? 1 : 999999;
  for(let i = 0; i < positions.length; ++i) {
    for(let j = 0; j < positions[i].length; ++j) {
      if(positions[i][j] == '#') {

        galaxies.push(new Galaxy(i + addEmptyMultip * emptyColumns.filter(a => a < i).length, 
        j+ addEmptyMultip * emptyRows.filter(a => a < j).length))
      }
    }
  }
  // calculate distances
  let sum = 0;
  for(let i = 0; i < galaxies.length; ++i) {
    for(let j = i+1; j < galaxies.length; ++j) {
      const a = shortestWay(galaxies[i], galaxies[j]);
      sum += a;
    }
  }
  return sum;
}

function shortestWay(a: Galaxy, b: Galaxy){
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// execute and output
console.log('Test aim: 374');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 9623138
// B: 726820169514