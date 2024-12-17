import { BaseLocation, BaseLocationMap, Direction, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  let startPos, endPos;
  const map = BaseLocationMap.createFromInput(data, (char, x, y) => {
    const loc = new Location();
    loc.wall = char === '#';
    if (char === 'S') startPos = loc;
    if (char === 'E') endPos = loc;
    return loc;
  });
  startPos.checkAllNeighbourPos(Direction.E, map);
  if (part === 'A') {
    return endPos.cost;
  } else {
    endPos.visited = true;
    endPos.getPath(map, Direction.S); // if we reached the end from south
    //endPos.getPath(map, Direction.W); // if we reached the end from west

    // printCost(map);
    // printVisited(map);

    return map.allLocations().filter((loc) => loc.visited).length;
  }
}

class Location extends BaseLocation {
  wall = false;
  cost: number | undefined = undefined;

  checkAllNeighbourPos(direction: Direction, map: BaseLocationMap<Location>) {
    if (this.cost == undefined) this.cost = 0;
    const forwardPos = map.getLocation(direction.go(this));
    if (forwardPos && !forwardPos.wall) {
      // can we reach this position faster than before?
      if (forwardPos.cost == undefined || forwardPos.cost > this.cost + 1) {
        forwardPos.cost = this.cost + 1;
        forwardPos.checkAllNeighbourPos(direction, map);
      }
    }
    const leftPos = map.getLocation(direction.rotateLeft().go(this));
    if (leftPos && !leftPos.wall) {
      if (leftPos.cost == undefined || leftPos.cost > this.cost + 1001) {
        leftPos.cost = this.cost + 1001;
        leftPos.checkAllNeighbourPos(direction.rotateLeft(), map);
      }
    }
    const rightPos = map.getLocation(direction.rotateRight().go(this));
    if (rightPos && !rightPos.wall) {
      if (rightPos.cost == undefined || rightPos.cost > this.cost + 1001) {
        rightPos.cost = this.cost + 1001;
        rightPos.checkAllNeighbourPos(direction.rotateRight(), map);
      }
    }
  }

  getPath(map: BaseLocationMap<Location>, fromDirection: Direction): void {
    if (this.cost === undefined) return;

    // check continuing of last direction
    const forwardPos = map.getLocation(fromDirection.go(this));
    if (forwardPos) {
      if (forwardPos.cost === this.cost - 1) {
        forwardPos.visited = true;
        forwardPos.getPath(map, fromDirection);
      } else if (forwardPos.cost === this.cost - 1001) {
        forwardPos.visited = true;
        forwardPos.getPath(map, fromDirection);
        const forwardPos_2steps = map.getLocation(fromDirection.go(forwardPos));
        if (forwardPos_2steps && forwardPos_2steps.cost === this.cost - 2) {
          // this is an important special case!!!
          forwardPos_2steps.visited = true;
          forwardPos_2steps.getPath(map, fromDirection);
        }
      }
    }
    // check left
    const leftPos = map.getLocation(fromDirection.rotateLeft().go(this));
    if (leftPos) {
      if (leftPos.cost === this.cost - 1001 || leftPos.cost === this.cost - 1) {
        leftPos.visited = true;
        leftPos.getPath(map, fromDirection.rotateLeft());
      }
    }
    // check right
    const rightPos = map.getLocation(fromDirection.rotateRight().go(this));
    if (rightPos) {
      if (
        rightPos.cost === this.cost - 1001 ||
        rightPos.cost === this.cost - 1
      ) {
        rightPos.visited = true;
        rightPos.getPath(map, fromDirection.rotateRight());
      }
    }
  }
}

// for debugging

function printCost(map: BaseLocationMap<Location>) {
  map.printPadded(8, (loc) => {
    if (loc.cost !== undefined) {
      return loc.cost.toString();
    }
    return loc.wall ? '#' : '.';
  });
}

function printVisited(map: BaseLocationMap<Location>) {
  map.print((loc) => {
    if (loc.visited) {
      return 'O';
    }
    return loc.wall ? '#' : '.';
  });
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 7036 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 72400 },
  { name: 'B test', part: 'B', data: 'test', expected: 45 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 435 },
];
