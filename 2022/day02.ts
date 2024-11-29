import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  if (part === 'A') {
    const points = data.map((line) => {
      const [opponent, me] = line.split(' ');
      switch (me) {
        case 'X': // rock
          switch (opponent) {
            case 'A': // rock
              return 1 + 3;
            case 'B': // paper
              return 1;
            case 'C': // sciss
            default:
              return 1 + 6;
          }
        case 'Y': // paper
          switch (opponent) {
            case 'A': // rock
              return 2 + 6;
            case 'B': // paper
              return 2 + 3;
            case 'C': // sciss
            default:
              return 2;
          }
        case 'Z': // sciss
          switch (opponent) {
            case 'A': // rock
              return 3;
            case 'B': // paper
              return 3 + 6;
            case 'C': // sciss
            default:
              return 3 + 3;
          }
      }
    });
    return points.sum();
  } else {
    const points = data.map((line) => {
      const [opponent, me] = line.split(' ');
      switch (me) {
        case 'X': // lose
          switch (opponent) {
            case 'A': // rock
              return 3;
            case 'B': // paper
              return 1;
            case 'C': // sciss
            default:
              return 2;
          }
        case 'Y': // draw
          switch (opponent) {
            case 'A': // rock
              return 1 + 3;
            case 'B': // paper
              return 2 + 3;
            case 'C': // sciss
            default:
              return 3 + 3;
          }
        case 'Z': // win
          switch (opponent) {
            case 'A': // rock
              return 2 + 6;
            case 'B': // paper
              return 3 + 6;
            case 'C': // sciss
            default:
              return 1 + 6;
          }
      }
    });
    return points.sum();
  }
}

// execute and output
lib.execute2('2022', 'day02.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 15 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 15337 },
  { name: 'B test', part: 'B', data: 'test', expected: 12 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 207410 },
]);
