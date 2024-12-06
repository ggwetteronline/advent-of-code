import { Direction, Point, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const guard = new Guard();
  // string array to location array
  const locations: Location[][] = [];
  data.map((line) => {
    const row: Location[] = [];
    line.split('').map((char) => {
      const loc = new Location();
      if (char === '#') {
        loc.obstacle = true;
      }
      if (char === '^') {
        // we alwys start facing north
        guard.direction = Direction.getDirection('N');
        guard.pos.x = row.length;
        guard.pos.y = locations.length;
        loc.visited = true;
      }
      row.push(loc);
    });
    locations.push(row);
  });

  if (part === 'A') {
    let status = guard.moveTillObstacle(locations);
    while (status !== EndCondition.OutOfBounds) {
      status = guard.moveTillObstacle(locations);
    }
    //get count of visited locations
    return locations.flat().filter((loc) => loc.visited).length;
  } else {
    const guardCopy = new Guard();
    guardCopy.direction = guard.direction.copy();
    guardCopy.pos = { x: guard.pos.x, y: guard.pos.y };
    // place an obstacle on every position
    let count = 0;
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations[i].length; j++) {
        if (
          locations[i][j].obstacle ||
          (guard.pos.x === j && guard.pos.y === i)
        ) {
          // skip if there already is an obstacle or guard is on this location
        } else {
          // add temporary obstacle
          locations[i][j].obstacle = true;
          // check if the guard moves in circles
          let res = guard.moveTillObstacle(locations);
          while (res === EndCondition.ObstacleReached) {
            // obstacle reached
            res = guard.moveTillObstacle(locations);
          }
          if (res == EndCondition.LocationAlreadyVisited) {
            // running in circles
            count++;
          }
          // reset visited locations
          for (let i = 0; i < locations.length; i++) {
            for (let j = 0; j < locations[i].length; j++) {
              locations[i][j].visited = false;
              locations[i][j].movedThroughDirections = [];
            }
          }
          // reset guard position
          guard.pos = { x: guardCopy.pos.x, y: guardCopy.pos.y };
          guard.direction = guardCopy.direction.copy();
          // remove temporary obstacle
          locations[i][j].obstacle = false;
        }
      }
    }

    return count;
  }
}

enum EndCondition {
  OutOfBounds = 0,
  LocationAlreadyVisited = 1,
  ObstacleReached = 2,
}

class Guard {
  pos: Point = { x: 0, y: 0 };
  direction: Direction = Direction.getDirection('N');
  constructor() {}

  moveTillObstacle(locations: Location[][]): EndCondition {
    let newPos = this.direction.go(this.pos, 0);
    do {
      this.pos = newPos;
      newPos = this.direction.go(this.pos, 1);
      if (locations.hasIndex2D(newPos.y, newPos.x) == false) {
        return EndCondition.OutOfBounds; // return 0 if out of bounds
      }

      if (
        locations[newPos.y][newPos.x].visited == false &&
        locations[newPos.y][newPos.x].obstacle == false
      ) {
        locations[newPos.y][newPos.x].visited = true;
      }
      // if we already visited this location in this direction we are running in circles
      if (
        locations[newPos.y][newPos.x].wasMovedThroughInThisDirection(
          this.direction
        )
      ) {
        return EndCondition.LocationAlreadyVisited; // return 1 if location was already visited in this direction
      }
      locations[newPos.y][newPos.x].movedThroughDirections.push(this.direction);
    } while (!locations[newPos.y][newPos.x].obstacle);
    // change direction by 90degeree to right
    this.direction = this.direction.rotateRight();
    return EndCondition.ObstacleReached; // return 2 if obstacle was reached
  }
}

class Location {
  visited: boolean = false;
  obstacle: boolean = false;
  movedThroughDirections: Direction[] = [];
  constructor() {}

  moveThrough(direction: Direction) {
    this.movedThroughDirections.push(new Direction(direction.x, direction.y));
  }
  wasMovedThroughInThisDirection(direction: Direction) {
    return this.movedThroughDirections.some(
      (dir) => dir.x === direction.x && dir.y === direction.y
    );
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 41 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 4580 },
  { name: 'B test', part: 'B', data: 'test', expected: 6 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 1480 },
];
