

import { lib, Polygon } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  let lastPoint = {x: 0, y: 0};
  const polygon = new Polygon([ lastPoint ]);
  for(let line of data) {
    let [direction, stepsA, stepsBHex, directionB] = (new RegExp(/([RDLU])\ (\d+)\ \(#([0-9a-f]{5})([0-9])\)/)).exec(line)!.slice(1);
    if(part == 'A') {
      const steps = parseInt(stepsA);
      const newPoint = {
        x: lastPoint.x + (direction == 'R' ? steps : direction == 'L' ? -steps : 0), 
        y: lastPoint.y + (direction == 'D' ? steps : direction == 'U' ? -steps : 0)}
      polygon.addPoint(newPoint);
      lastPoint = newPoint;
    } else {
      direction = directionB == '0' ? 'R' : directionB == '1' ? 'D' : directionB == '2' ? 'L' : 'U';
      const steps = parseInt(stepsBHex,16);
      const newPoint = {
        x: lastPoint.x + (direction == 'R' ? steps : direction == 'L' ? -steps : 0), 
        y: lastPoint.y + (direction == 'D' ? steps : direction == 'U' ? -steps : 0)};
      polygon.addPoint(newPoint);
      lastPoint = newPoint;
    }
  }
  return polygon.calculateAreaIncudingBorders();
}

// execute and output
console.log('Test aim: 62 | 952408144115');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 26857
// B: 129373230496292
