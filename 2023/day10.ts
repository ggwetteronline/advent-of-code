import { lib } from '../lib';

type Direction = 'N' | 'W' | 'E' | 'S' | '.';
type PipeSymbol = 'S' | '|' | '-' | 'F' | 'L' | 'J' | '7' | '.';
const NOT_IN_MAIN_PIPE = -1;

class Pipe{
  count = 0;
  distance: number = NOT_IN_MAIN_PIPE;
  inside = true;
  checked = false;
  constructor(public y: number, public x: number, public symbol: PipeSymbol ,public from: Direction, public to: Direction) {

  }
  goesTo(n: Direction) {
    return this.from == n || this.to == n;
  }
  getNext( matrix: Pipe[][]): Pipe{
    // get next Pipe and swap its from and to, so we do not go back in next step
    switch(this.to) {
      case 'N': {
        const next = matrix[this.y-1][this.x];
        if(next.from != 'S') next.switchDirections();
        return next;
      };
      case 'W': {
        const next = matrix[this.y][this.x-1];
        if(next.from != 'E') next.switchDirections();
        return next;
      };
      case 'E': {
        const next =matrix[this.y][this.x+1];
        if(next.from != 'W') next.switchDirections();
        return next;
      }
      case 'S': {
        const next =matrix[this.y+1][this.x];
        if(next.from != 'N') next.switchDirections();
        return next; 
      }
    }
    return this;
  }
  switchDirections(){
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;
  }
}

// function logic
function run(data: string[], part: 'A' | 'B') {
  const pipeMatrix: Pipe[][] = [];
  let start: Pipe | undefined = undefined;
  for(let i = 0; i < data.length; ++i) {
    const line = data[i];
    const b: Pipe[]= [];
    for(let j = 0; j < line.length; ++j) {
      let char = line[j];
      switch(char) {
        case '|': b.push(new Pipe(i, j, char, 'N','S')); break;
        case '-': b.push(new Pipe(i, j, char, 'W','E')); break;
        case 'L': b.push(new Pipe(i, j, char, 'N','E')); break;
        case 'J': b.push(new Pipe(i, j, char, 'N','W')); break;
        case '7': b.push(new Pipe(i, j, char, 'S','W')); break;
        case 'F': b.push(new Pipe(i, j, char, 'S','E')); break;
        case '.': b.push(new Pipe(i, j, char, '.','.'));break;
        case 'S': {
          console.log('found start', i, j);
          let from: Direction | undefined = undefined;
          let to: Direction | undefined = undefined;
          if(i > 0 && connectsTo('S', data[i-1][j]))
            from = 'N';
          if(i < data.length-1 && connectsTo('N', data[i+1][j])) {
            if(from == undefined) from = 'S'; else to = 'S';
          }
          if(j > 0 && connectsTo('E', data[i][j-1]))
            if(from == undefined) from = 'W'; else to = 'W';
          if(j < line.length-1 && connectsTo('W', data[i][j+1]))
            if(from == undefined) from = 'E'; else to = 'E';

          start = new Pipe(i, j, 'S', from!, to!);
          start.distance =0;
          b.push(start); 
        }
        break;
      }
    }
    pipeMatrix.push(b);
  }

  
  // go from start to adjacent
  let wayOne: Pipe = start!.getNext(pipeMatrix);
  start!.switchDirections();
  let wayTwo: Pipe = start!.getNext(pipeMatrix);
  wayOne.distance = 1;
  wayTwo.distance = 1;
  let steps = 1;
  while(wayOne != wayTwo){
    steps++;
    wayOne = wayOne.getNext(pipeMatrix);
    wayOne.distance = steps;
    
    if(wayOne == wayTwo) break;
    wayTwo = wayTwo.getNext(pipeMatrix);
    wayTwo.distance = steps;
  } 
  if(part == 'A') return steps;

  // Startarray verdreifachen
  const largeCopy = createLargeCopy(pipeMatrix);

  // im großen array alle Außen - Punkte durchgehen und auf inside = false setzen
  // dann alle zu ihnen beachbarten Punkte ebenfalls auf inside=false setzen
  for(let i = 0; i < largeCopy.length; ++i ) {
    for(let j = 0; j < largeCopy[i].length; ++j ) {
      if(largeCopy[i][j].checked == false) {
        if(i == 0 || i == largeCopy.length-1 || j == 0 || j == largeCopy[i].length-1) {
          largeCopy[i][j].inside = false;
        }
        if(largeCopy[i][j].symbol == '.' && largeCopy[i][j].inside == false) {
          checkNeighbors(largeCopy, i, j);
        }
      }
    }
  }
  //largeCopy.map(line => console.log(line.map(pipe => pipe.symbol == '.' && pipe.inside ?'I' : pipe.symbol).join('')));

  return count(largeCopy);
}

function createLargeCopy(pipes: Pipe[][]): Pipe[][]{
  const largeCopy: Pipe[][] = [];
  for(let i = 0; i < pipes.length; ++i) {
    const lineC1 = largeCopy[i*3] = [] as Pipe[];
    const lineC2 = largeCopy[i*3+1] = [] as Pipe[];
    const lineC3 = largeCopy[i*3+2] = [] as Pipe[];
    const line = pipes[i];
    // links -> rechts
    for(let j = 0; j < line.length; ++j) {
      if(pipes[i][j].distance == -1) {
        lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '.', '.', '.'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
        lineC2.push(new Pipe(i*3+1, j*3, '.', '.', '.'),new Pipe(i*3+1, j*3+1, '.', '.', '.'),new Pipe(i*3+1, j*3+2, '.', '.', '.'));
        lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '.', '.', '.'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
      } else {
        switch(line[j].symbol) {
          case 'S': 
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, 'S', 'N', 'S'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, 'S', 'N', 'S'),new Pipe(i*3+1, j*3+1, 'S', 'N', 'S'),new Pipe(i*3+1, j*3+2, 'S', 'N', 'S'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, 'S', 'N', 'S'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case '|': 
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '|', 'N', 'S'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '.', '.', '.'),new Pipe(i*3+1, j*3+1, '|', 'N', 'S'),new Pipe(i*3+1, j*3+2, '.', '.', '.'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '|', 'N', 'S'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case '-':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '.', '.', '.'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '-', 'W', 'E'),new Pipe(i*3+1, j*3+1, '-', 'W', 'E'),new Pipe(i*3+1, j*3+2, '-', 'W', 'E'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '.', '.', '.'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case 'F':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '.', '.', '.'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '.', '.', '.'),new Pipe(i*3+1, j*3+1, 'F', 'S', 'E'),new Pipe(i*3+1, j*3+2, '-', 'W', 'E'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '|', 'S', 'N'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case 'L':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '|', 'S', 'N'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '.', '.', '.'),new Pipe(i*3+1, j*3+1, 'L', 'N', 'E'),new Pipe(i*3+1, j*3+2, '-', 'W', 'E'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '.', '.', '.'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case 'J':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '|', 'S', 'N'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '-', 'W', 'E'),new Pipe(i*3+1, j*3+1, 'J', 'N', 'W'),new Pipe(i*3+1, j*3+2, '.', '.', '.'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '.', '.', '.'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case '7':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '.', '.', '.'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '-', 'W', 'E'),new Pipe(i*3+1, j*3+1, '7', 'S', 'W'),new Pipe(i*3+1, j*3+2, '.', '.', '.'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '|', 'S', 'N'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
          case '.':
            lineC1.push(new Pipe(i*3,   j*3, '.', '.', '.'),new Pipe(i*3,   j*3+1, '.', '.', '.'),new Pipe(i*3,   j*3+2, '.', '.', '.'));
            lineC2.push(new Pipe(i*3+1, j*3, '.', '.', '.'),new Pipe(i*3+1, j*3+1, '.', '.', '.'),new Pipe(i*3+1, j*3+2, '.', '.', '.'));
            lineC3.push(new Pipe(i*3-2, j*3, '.', '.', '.'),new Pipe(i*3+2, j*3+1, '.', '.', '.'),new Pipe(i*3+2, j*3+2, '.', '.', '.'));
            break;
        }
      }
    }
  }
  return largeCopy;
}

function count(largeCopy: Pipe[][]){
  let count = 0;
  // because we stretched the array, we only count the center of 3x3 blocks
  for(let i = 0; i < largeCopy.length; i+=3) {
    for(let j = 0; j < largeCopy[i].length; j+=3) { 
      const checkElement = largeCopy[i+1][j+1];
      if(checkElement.symbol == '.' && checkElement.inside){
        count++;
      }
    }
  }
  return count;
}

function checkNeighbors(largeCopy: Pipe[][], y: number, x:number, deepth = 0) {
  // deepth is neccessary, because we get stack overflow otherwise
  if(largeCopy[y][x].checked || deepth == 4000) return;
  deepth++;
  largeCopy[y][x].checked = true;
  // go top
  if(y > 0 && largeCopy[y-1][x].symbol == '.') {
    largeCopy[y-1][x].inside = false;
    checkNeighbors(largeCopy, y-1, x, deepth);
  }
  // go bottom
  if(y < largeCopy.length -1 && largeCopy[y+1][x].symbol == '.') {
    largeCopy[y+1][x].inside = false;
    checkNeighbors(largeCopy, y+1, x, deepth);
  }
  // go left
  if(x > 0 && largeCopy[y][x-1].symbol == '.') {
    largeCopy[y][x-1].inside = false;
    checkNeighbors(largeCopy, y, x-1, deepth);
  }
  // go right
  if(x < largeCopy[y].length -1 && largeCopy[y][x+1].symbol == '.') {
    largeCopy[y][x+1].inside = false;
    checkNeighbors(largeCopy, y, x+1, deepth);
  }
}


function connectsTo(from: Direction, char: string){
  switch(from) {
    case 'N': return ['|','L','J'].includes(char);
    case 'W': return ['-','J','7'].includes(char);
    case 'E': return ['-','L','F'].includes(char);
    case 'S': return ['|','7','F'].includes(char);
  }
  return false;
}


// execute and output
console.log('Test aim: 10');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 6907
// B: 541