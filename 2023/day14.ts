import { lib } from '../lib';

type RockField = '#' | 'O' | '.';
// function logic
function run(data: string[], part: 'A' | 'B') {
  const rocks: RockField[][] = [];
  for(let line of data) {
    rocks.push(line.split('') as RockField[]);
  }
  let copys: string[] = [];
  if(part == 'A') {
    tiltNorth(rocks);
  } else {
    for(let i= 0; i <1000000000; ++i) {
      tiltNorth(rocks);
      tiltWest(rocks);
      tiltSouth(rocks);
      tiltEast(rocks);
      if(i >= 1000 && i<2000) {
        // shake a bit, then look for repeats
        const save = rocks.toFieldString();
        if(copys.includes(save)) {
          const repeatIn = i - (copys.indexOf(save)+1000);
          const remaining = (1000000000 - i) % repeatIn;
          i = 1000000000 - (remaining != 0 ? remaining : repeatIn);
        }
        copys.push(save);
      }
    }
  }
  // count 
  let sum = 0;
  for(let y = 0; y < rocks.length; ++y) {
    const rocksInLine = rocks[y].filter(a => a == 'O').length;
    sum += rocksInLine * (rocks.length-y);
  }

  return sum
}

function tiltNorth(input: RockField[][]): void{
  for(let x = 0; x < input[0].length; ++x) {
    let maxY = 0;
    for(let y = 0; y < input.length; ++y) {
      switch(input[y][x]){
        case '#':
          maxY = y+1;
          break;
        case 'O':
          input[y][x] = '.';
          input[maxY][x] = 'O';
          maxY++;
        case '.':
          break;
      }
    }
  }
}

function tiltSouth(input: RockField[][]): void{
  for(let x = 0; x < input[0].length; ++x) {
    let maxY = input.length-1;
    for(let y = input.length -1; y >=0 ; --y) {
      switch(input[y][x]) {
        case '#':
          maxY = y-1;
          break;
        case 'O':
          input[y][x] = '.';
          input[maxY][x] = 'O';
          maxY--;
          break;
        case '.':
          break;
      }
    }
  }
}

function tiltWest(input: RockField[][]): void {
  for(let y = 0; y < input.length; ++y) {
    let maxX = 0;
    for(let x = 0; x < input[0].length; ++x) {
      switch(input[y][x]) {
        case '#':
          maxX = x+1;
          break;
        case 'O':
          input[y][x] = '.';
          input[y][maxX] = 'O';
          maxX++;
          break;
        case '.':break;
      }
    }
  }
}

function tiltEast(input: RockField[][]): void{
  for(let y = 0; y < input.length; ++y) {
    let maxX = input[0].length -1;
    for(let x = input[0].length -1; x >= 0; --x) {
      switch(input[y][x]){
        case '#':
          maxX = x-1;
          break;
        case 'O':
          input[y][x] = '.';
          input[y][maxX] = 'O';
          maxX--;
        case '.': break;
      }
    }
  }
}

// execute and output
console.log('Test aim: 136, 64');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 107951
// B: 95736