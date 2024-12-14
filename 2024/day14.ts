import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const robots = data.map((line) => {
    const [x, y, z, r] = extractNumbers(line);
    return new Robot(x, y, z, r);
  });
  if (part === 'A') {
    robots.forEach((robot) => {
      robot.move(100);
    });
    const centerX = (robots[0].mapWidth - 1) / 2;
    const centerY = (robots[0].mapHeight - 1) / 2;

    // get all robots per quadrant
    const topLeft = robots.filter(
      (robot) => robot.x < centerX && robot.y < centerY
    ).length;
    const topRight = robots.filter(
      (robot) => robot.x > centerX && robot.y < centerY
    ).length;
    const bottomLeft = robots.filter(
      (robot) => robot.x < centerX && robot.y > centerY
    ).length;
    const bottomRight = robots.filter(
      (robot) => robot.x > centerX && robot.y > centerY
    ).length;
    console.log(topLeft, topRight, bottomLeft, bottomRight);

    return topLeft * topRight * bottomLeft * bottomRight;
  } else {
    // repeat as long as there will be at least 10 robots horizontallay adjacent to each other
    let steps = 0;
    while (checkIfThereIsALineWIthXadjacentRobots(robots, 10) == false) {
      robots.forEach((robot) => {
        robot.move(1);
      });
      steps++;
    }
    // draw all robots positions into map
    for (let y = 0; y < robots[0].mapHeight; y++) {
      let line = '';
      for (let x = 0; x < robots[0].mapWidth; x++) {
        if (robots.some((robot) => robot.x === x && robot.y === y)) {
          line += 'X';
        } else {
          line += ' ';
        }
      }
      console.log(line);
    }
    return steps;
  }
}

function checkIfThereIsALineWIthXadjacentRobots(
  robots: Robot[],
  count: number
) {
  for (let line = 0; line < robots[0].mapHeight; line++) {
    const robotsInLine = robots
      .filter((robot) => robot.y === line)
      .sort((a, b) => a.x - b.x);
    if (robotsInLine.length > count) {
      // check for each robot, if he has 9 other robots on the positions right of him
      for (let i = 0; i < robotsInLine.length - count; i++) {
        let found = true;
        for (let j = 1; j < count; j++) {
          if (robotsInLine[i].x + j !== robotsInLine[i + j].x) {
            found = false;
            break;
          }
        }
        if (found) {
          return true;
        }
      }
    }
  }
  return false;
}

class Robot {
  readonly mapWidth = 101;
  readonly mapHeight = 103;
  /*
  readonly mapWidth = 11;
  readonly mapHeight = 7;
  //*/
  direction = { x: 0, y: 0 };
  constructor(
    public x: number,
    public y: number,
    speedX: number,
    speedY: number
  ) {
    this.direction.x = speedX;
    this.direction.y = speedY;
  }

  move(steps: number) {
    this.x = (this.x + this.direction.x * steps) % this.mapWidth;
    if (this.x < 0) this.x += this.mapWidth;
    this.y = (this.y + this.direction.y * steps) % this.mapHeight;
    if (this.y < 0) this.y += this.mapHeight;
  }
}

function extractNumbers(input: string): number[] {
  const regex = /-?\d+/g;
  const matches = input.match(regex);
  if (matches) {
    return matches.map(Number);
  }
  return [];
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 12 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 209409792 },
  // { name: 'B test', part: 'B', data: 'test', expected: 31 }, // there is no test result for B
  { name: 'B prod', part: 'B', data: 'prod', expected: 8006 },
];
