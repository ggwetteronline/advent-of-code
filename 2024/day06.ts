import { BaseLocation, BaseLocationMap, Direction, Point, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  // input parsing
  const guard = new Guard();
  const locationMap = BaseLocationMap.createFromInput(data, (char, x, y) => {
    const loc = new Location();
    if (char === '#') {
      loc.obstacle = true;
    }
    if (char === '^') {
      // we always start facing north
      guard.direction = Direction.getDirection('N');
      guard.pos = { x, y };
      loc.visited = true;
    }
    return loc;
  });

  if (part === 'A') {
    let status = guard.moveTillObstacleAndTurnRight(locationMap);
    while (status !== EndCondition.OutOfBounds) {
      status = guard.moveTillObstacleAndTurnRight(locationMap);
    }
    //get count of visited locations
    return locationMap.allLocations().filter((loc) => loc.visited).length;
  } else {
    const guardCopy = new Guard();
    guardCopy.direction = guard.direction.copy();
    guardCopy.pos = { x: guard.pos.x, y: guard.pos.y };
    // place an obstacle on every position
    let count = 0;
    locationMap.for((loc, x, y) => {
      if (loc.obstacle || (guard.pos.x === x && guard.pos.y === y)) {
        // skip if there already is an obstacle or guard is on this location
        return;
      }
      // add temporary obstacle
      loc.obstacle = true;
      // check if the guard moves in circles
      let status = guard.moveTillObstacleAndTurnRight(locationMap);
      while (status === EndCondition.ObstacleReached) {
        // obstacle reached
        status = guard.moveTillObstacleAndTurnRight(locationMap);
      }
      if (status == EndCondition.LocationAlreadyVisited) {
        // running in circles
        count++;
      }
      // reset visited locations
      locationMap.for((loc) => {
        loc.visited = false;
        loc.movedThroughDirections = [];
      });
      // reset guard position
      guard.pos = { x: guardCopy.pos.x, y: guardCopy.pos.y };
      guard.direction = guardCopy.direction.copy();
      // remove temporary obstacle
      loc.obstacle = false;
    });
    return count;
  }
}

enum EndCondition {
  OutOfBounds,
  ObstacleReached,
  LocationAlreadyVisited,
}

class Guard {
  pos: Point = { x: 0, y: 0 };
  direction: Direction = Direction.getDirection('N');
  constructor() {}

  moveTillObstacleAndTurnRight(
    locations: BaseLocationMap<Location>
  ): EndCondition {
    while (true) {
      const nextPos = this.direction.go(this.pos);
      if (!locations.hasPosition(nextPos)) {
        return EndCondition.OutOfBounds;
      }
      const loc = locations.getLocation(nextPos);
      if (loc.obstacle) {
        this.direction = this.direction.rotateRight();
        return EndCondition.ObstacleReached;
      }
      if (loc.wasMovedThroughInThisDirection(this.direction)) {
        return EndCondition.LocationAlreadyVisited;
      }
      loc.moveThrough(this.direction);
      this.pos = nextPos;
    }
  }
}

class Location extends BaseLocation {
  visited: boolean = false;
  obstacle: boolean = false;
  movedThroughDirections: Direction[] = [];

  constructor() {
    super();
  }

  moveThrough(direction: Direction) {
    this.visited = true;
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
