import {
  BaseLocation,
  BaseLocationMap,
  Direction,
  LocationRunner,
  Run,
} from '../lib';

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
      guard.direction = Direction.N;
      guard.pos = { x, y };
      loc.visited = true;
    }
    return loc;
  });
  const guardCopy = guard.copy();

  let status = guard.moveTillObstacleAndTurnRight(locationMap);
  while (status !== EndCondition.OutOfBounds) {
    status = guard.moveTillObstacleAndTurnRight(locationMap);
  }
  if (part === 'A') {
    //get count of visited locations
    return locationMap.allLocations().filter((loc) => loc.visited).length;
  } else {
    // Optimization idea for part 2:
    // Let the guard move backwards from the end location to the start location
    // So we do not have to calculate the way he needed to get there

    // reset guard and locationMap
    guard.reset(guardCopy);
    const locationCopy = locationMap.copy();
    locationMap.for((loc) => {
      loc.visited = false;
      loc.movedThroughDirections = [];
    });

    // place an obstacle on every position of the way which the guard walked in part 1
    let count = 0;
    locationMap.for((loc, x, y) => {
      if (loc.obstacle || (guard.pos.x === x && guard.pos.y === y)) {
        // skip if there already is an obstacle or guard is on this location
        return;
      }
      if (locationCopy.getLocation({ x, y }).visited == false) {
        // if a location was not visited for part 1, it won't be visited in part 2
        // so no need to check what happens if we place a obstacle here
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
      if (status == EndCondition.RunInCircle) {
        // running in circles
        count++;
      }
      // reset visited locations
      locationMap.for((loc) => {
        loc.visited = false;
        loc.movedThroughDirections = [];
      });
      // reset guard position
      guard.reset(guardCopy);
      // remove temporary obstacle
      loc.obstacle = false;
    });
    return count;
  }
}

enum EndCondition {
  OutOfBounds,
  ObstacleReached,
  RunInCircle,
}

class Guard extends LocationRunner {
  constructor() {
    super();
  }

  copy(): Guard {
    const guard = new Guard();
    guard.pos = { x: this.pos.x, y: this.pos.y };
    guard.direction = this.direction.copy();
    return guard;
  }

  reset(guard: Guard) {
    this.pos = { x: guard.pos.x, y: guard.pos.y };
    this.direction = guard.direction.copy();
  }

  moveTillObstacleAndTurnRight(
    locations: BaseLocationMap<Location>
  ): EndCondition {
    const endReason = this.moveForwardWhile(
      locations,
      (checkLocation: Location) => {
        if (checkLocation.obstacle) {
          this.direction = this.direction.rotateRight();
          return EndCondition.ObstacleReached;
        }
        if (checkLocation.wasMovedThroughInThisDirection(this.direction)) {
          return EndCondition.RunInCircle;
        }
        return 'continue';
      }
    );
    if (endReason === 'OutOfBounds') {
      return EndCondition.OutOfBounds;
    } else {
      return endReason;
    }
  }
}

class Location extends BaseLocation {
  obstacle: boolean = false;

  constructor() {
    super();
  }

  copy(newLocation = new Location()): Location {
    const loc = super.copy(newLocation) as Location;
    loc.obstacle = this.obstacle;
    return loc;
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 41 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 4580 },
  { name: 'B test', part: 'B', data: 'test', expected: 6 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 1480 },
];
