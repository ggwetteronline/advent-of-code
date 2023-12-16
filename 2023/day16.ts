import { lib } from '../lib';

class Space{
  N = false;
  W = false;
  S = false;
  E = false;
  constructor(public sign: string){}

  passBeam(direction: Direction, points: Space[][], x: number, y: number) {   
    switch(direction){
      case 'N': 
        // if we already went north to this, don't start recursion again
        if(this.N == true) return;
        this.N = true; 
        // pass 
        if(['.', '|'].includes(this.sign) && y > 0) 
          points[y-1][x].passBeam(direction, points, x, y-1);
        else if(this.sign == '-') {
          // split to west and east
          if(x > 0) points[y][x-1].passBeam('W', points, x-1, y);
          if(x < points[y].length - 1) points[y][x+1].passBeam('E', points, x+1, y); 
        } else if(this.sign == '/') {
          // go to east
          if(x < points[y].length - 1) 
            points[y][x+1].passBeam('E', points, x+1, y);
        } else if(this.sign == '\\') {
          // go to west
          if(x > 0) 
            points[y][x-1].passBeam('W', points, x-1, y);
        }
        break;
      case 'E': 
        if(this.E == true) return;
        this.E = true; 
        if(['.', '-'].includes(this.sign) && x < points[y].length - 1) points[y][x+1].passBeam(direction, points, x+1, y);
        else if(this.sign == '|') {
          if(y > 0) points[y-1][x].passBeam('N', points, x, y-1);
          if(y < points.length - 1) points[y+1][x].passBeam('S', points, x, y+1); 
        } else if(this.sign == '/') {
          if(y > 0) 
            points[y-1][x].passBeam('N', points, x, y-1);
        } else if(this.sign == '\\') {  
          if(y < points.length - 1) 
            points[y+1][x].passBeam('S', points, x, y+1);
        }
        break;
      case 'S': 
        if(this.S == true) return;
        this.S = true; 
        if(['.', '|'].includes(this.sign) && y < points.length - 1) 
          points[y+1][x].passBeam(direction, points, x, y+1);
        else if(this.sign == '-') {
          if(x > 0) points[y][x-1].passBeam('W', points, x-1, y);
          if(x < points[y].length - 1) points[y][x+1].passBeam('E', points, x+1, y); 
        } else if(this.sign == '/') {
          if(x > 0) 
            points[y][x-1].passBeam('W', points, x-1, y);
        } else if(this.sign == '\\') {
          if(x < points[y].length - 1) 
            points[y][x+1].passBeam('E', points, x+1, y);
        }
        break;
      case 'W': 
        if(this.W == true) return;
        this.W = true;
        if(['.', '-'].includes(this.sign) && x > 0) 
          points[y][x-1].passBeam(direction, points, x-1, y);
        else if(this.sign == '|') {
          if(y > 0) points[y-1][x].passBeam('N', points, x, y-1);
          if(y < points.length - 1) points[y+1][x].passBeam('S', points, x, y+1); 
        } else if(this.sign == '/') { 
          if(y < points.length - 1) 
            points[y+1][x].passBeam('S', points, x, y+1);
        } else if(this.sign == '\\') {
          if(y > 0) 
            points[y-1][x].passBeam('N', points, x, y-1);
        }
        break;
    }
  }

  toString() {
    return this.sign;
  }

  isEnergized() {
    return this.N || this.E || this.S || this.W; 
  }
  reset() {
    this.N = false;
    this.E = false;
    this.S = false;
    this.W = false;
  }
}
type Direction = 'N' | 'E' | 'S' | 'W';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const points: Space[][] = [];
  for(let i = 0; i < data.length; ++i) {
    const b = data[i].split('');
    points[i] = [];
    for(let j = 0; j < b.length; j++) {
      points[i][j] = new Space(b[j]);
    }
  }
  // calculate
  let d: Direction = 'E';
  points[0][0].passBeam(d, points, 0, 0);

  if(part == 'A') {
    return points.reduce((a, b) => a + b.filter(c => c.isEnergized()).length, 0);
  } else {
    // reset all
    points.map(a => a.map(b => b.reset()));
    // 
    let max = 0;
    for(let i = 0; i < points.length; ++i) {
      // from north to south
      if(i == 0) {
        for(let j = 0; j < points[i].length; ++j) {
          points[i][j].passBeam('S', points, j, i);
          const sum = points.reduce((a, b) => a + b.filter(c => c.isEnergized()).length, 0);
          max = Math.max(max, sum);
          points.map(a => a.map(b => b.reset()));
        }
      }
      // from west to east 
      points[i][0].passBeam('E', points, 0, i);
      const sum = points.reduce((a, b) => a + b.filter(c => c.isEnergized()).length, 0);
      max = Math.max(max, sum);
      points.map(a => a.map(b => b.reset()));
      // south
      if(i == points.length - 1) {
        for(let j = 0; j < points[i].length; ++j) {
          points[i][j].passBeam('N', points, j, i);
          const sum = points.reduce((a, b) => a + b.filter(c => c.isEnergized()).length, 0);
          max = Math.max(max, sum);
          points.map(a => a.map(b => b.reset()));
        }
      }
      // from east to west
      points[i][points[i].length - 1].passBeam('W', points, points[i].length - 1, i);
      const sum2 = points.reduce((a, b) => a + b.filter(c => c.isEnergized()).length, 0);
      max = Math.max(max, sum2);
      points.map(a => a.map(b => b.reset()));
    }
    return max;
  }
}

// execute and output
console.log('Test aim: 46');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 
// B: 