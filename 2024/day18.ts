import { BaseLocation, BaseLocationMap, Direction, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  // test 6x6 grid, prod 70x70
  const isTest = data.length < 50;
  const GRID_SIZE = isTest ? 7 : 71;
  const map = BaseLocationMap.createWithSize(
    GRID_SIZE,
    GRID_SIZE,
    () => new Location()
  );

  const start = map.map[0][0];
  const end = map.map[GRID_SIZE - 1][GRID_SIZE - 1];

  if (part === 'A') {
    const TIME = isTest ? 12 : 1024;
    data.forEach((line, i) => {
      if (i < TIME) {
        const [x, y] = line.split(',').map(Number);
        map.map[y][x].wall = true;
      }
    });
    start.checkAllNeighbourPos(map);
    return end.cost;
  } else {
    let time = data.length - 1;
    do {
      // optimisation idea: instead of iterating, do some kind of binary search
      // reset map
      map.allLocations().forEach((loc) => {
        loc.wall = false;
        loc.cost = undefined;
      });
      // iterate backwards
      --time;
      data.forEach((line, i) => {
        if (i < time) {
          const [x, y] = line.split(',').map(Number);
          map.map[y][x].wall = true;
        }
      });
      start.checkAllNeighbourPos(map);
    } while (end.cost == undefined);

    return data[time];
  }
}

class Location extends BaseLocation {
  wall = false;
  cost: number | undefined = undefined;

  checkAllNeighbourPos(map: BaseLocationMap<Location>) {
    if (this.cost == undefined) this.cost = 0;
    const directions = [Direction.N, Direction.E, Direction.S, Direction.W];
    directions.forEach((direction) => {
      const nextPoint = direction.go(this);
      if (map.hasPosition(nextPoint)) {
        const nextPos = map.getLocation(direction.go(this));
        if (nextPos && !nextPos.wall) {
          // can we reach this position faster than before?
          if (nextPos.cost == undefined || nextPos.cost > this.cost! + 1) {
            nextPos.cost = this.cost! + 1;
            nextPos.checkAllNeighbourPos(map);
          }
        }
      }
    });
  }
}

export const runs: Run<number | string>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 22 },
  { name: 'prod', part: 'A', data: 'prod', expected: 282 },
  { name: 'test', part: 'B', data: 'test', expected: '6,1' },
  { name: 'prod', part: 'B', data: 'prod', expected: '64,29' },
];
