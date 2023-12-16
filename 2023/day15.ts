import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const words = data[0].split(',');
  if(part === 'A') {
    return solveA(words);
  } else {
    return solveB(words);
  }
}

function solveA(words: string[]) {
  let sum = 0;
  for(let word of words) {
    sum += getWordHash(word);
  }
  return sum;
}

function getWordHash(word:string){
  let wordValue = 0;
  for(let char of word) {
    wordValue = ((wordValue + char.charCodeAt(0)) * 17) % 256;
  }
  return wordValue;
}

class Lens {
  constructor(public label: string, public value: number) {}
}

class Box{
  lensList: Lens[] = [];
  constructor() {}
  addLens(lens: Lens) {
    const foundLens = this.lensList.find(l => l.label == lens.label);
    if(foundLens !== undefined) {
      foundLens.value = lens.value;
    } else {
      this.lensList.push(lens);
    }
  }
  removeLens(label: string) {  
    this.lensList = this.lensList.filter(l => l.label !== label);
  }
  getFocusingPower(boxNumber: number): number {
    return this.lensList.reduce((acc, lens, lensIndex) => 
      acc + (boxNumber + 1) * (lensIndex +1 ) * lens.value, 
    0);
  }
}

function solveB(words: string[]) {
  const boxList: Box[] = [];
  // install lenses
  for(let word of words) {
    const [_, label, operation, focal] = (new RegExp(/(.*)([=-])([1-9])?/)).exec(word)!;
    const wordHash = getWordHash(label);
    if(boxList[wordHash] === undefined) boxList[wordHash] = new Box();
    if(operation === '-') 
      boxList[wordHash].removeLens(label);
    else
      boxList[wordHash].addLens(new Lens(label, +focal));
  }
  // calculate focusing power
  return boxList.reduce((acc, box, boxIndex) => acc + box.getFocusingPower(boxIndex), 0);;
}

// execute and output
console.log('Test aim: 1320 | 145');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 517315
// B: 247763