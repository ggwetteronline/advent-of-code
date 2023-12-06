import { lib } from '../lib';

const path = require('path');

// function logic
function run(data: string[], part: 'A' | 'B') {
  if(part == 'A') 
    return solveA(data);
  else 
    return solveB(data);
}

function solveA(data: string[]) {
  let sum = 0;
  data.forEach((line: string) => {
    const [numElf, numWin] = line.split(': ')[1].split(' | ').map(nums => lib.getNums(nums)); 
    const winningCount = numElf.filter(numE => numWin.includes(numE)).length;
    const winPow = winningCount > 0 ? Math.pow(2, winningCount - 1) : 0;
    sum += winPow;
  });
  return sum;;
}

function solveB(data: string[]) {
  const cards: { cardCount: number, nums: number[], winNums: number[] }[] = [];
  // read data, each card exists one time
  for (let line of data) {
    const [numElf, numWin] = line.split(': ')[1].split(' | ').map(nums => lib.getNums(nums)); 
    cards.push({ cardCount: 1, nums: numElf, winNums: numWin });
  }
  // iterate over cards
  for (let cardNo = 0; cardNo < cards.length; ++cardNo) {
    // count wins
    const winningCount = cards[cardNo].nums.filter(numE => cards[cardNo].winNums.includes(numE)).length;
    // add card copys
    for (let i = cardNo + 1; i < cardNo + winningCount + 1; ++i) {
      if (cards[i] != undefined)
        cards[i].cardCount += cards[cardNo].cardCount
    }
  }
  return cards.map(a => a.cardCount).reduce((partialSum, a) => partialSum + a, 0);
}

// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(dataTest, data, runTest, runProd, runA, runB, run);

// A: 26443
// B: 6284877