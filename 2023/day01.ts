import { lib } from '../lib';

const path = require('path');

const searchArray = ([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
  [4, 'four'],
  [5, 'five'],
  [6, 'six'],
  [7, 'seven'],
  [8, 'eight'],
  [9, 'nine']
] as [number, string][])

// function logic
function run(data: string[], part: 'A' | 'B') {
  // read data 
  let sum = 0;
  for(let line of data) {
    sum += (findFirst(line, part == 'A') *10);
    sum += findLast(line, part == 'A');
  }
  return sum;
}

function findFirst(text: string, onlyNumbers: boolean){
  let firstIndexes: {num: number, position:number}[] = [];
  searchArray.forEach(num => 
    {
      const numIndex = text.indexOf(num[0].toString());
      let minIndex = numIndex;
      if(onlyNumbers == false) {
        const textIndex = text.indexOf(num[1]);
        // we check what we find first, number or string, but have to consider -1 as error value for not found
        minIndex = numIndex != -1 && textIndex != -1 ? Math.min(numIndex,textIndex) : Math.max(numIndex,textIndex);
    }
    firstIndexes.push({num: num[0] as number, position:minIndex})
  });
  firstIndexes = firstIndexes.filter(el => el.position != -1);
  let smallestIndex = Math.min(...firstIndexes.map(el => el.position));
  return firstIndexes.find(index => index.position == smallestIndex)!.num;
}

function findLast(text: string, onlyNumbers: boolean){
  let highIndexes: {num: number, position:number}[] = [];
  // because we look for highest index, we can ignore error value -1
  searchArray.forEach(num => highIndexes.push({num: num[0] as number, position: onlyNumbers ?  text.lastIndexOf(num[0].toString()) : Math.max(text.lastIndexOf(num[0].toString()),text.lastIndexOf(num[1]) )}));
  highIndexes = highIndexes.filter(el => el.position != -1);
  let highestIndex = Math.max(...highIndexes.map(el => el.position));
  return highIndexes.find(index => index.position == highestIndex)!.num;
}

// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
// Attention test data of PartA and B are different. Change day01-data_test.txt before running test for A
const runTest = true, runProd = true, runA = false, runB = true;
lib.execute(dataTest, data, runTest, runProd, runA, runB, run);

// A: 54390
// B: 54277



