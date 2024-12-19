import { BaseLocationMap, lib, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  // test 7x7 grid, prod 71x71
  const isTest = data.length < 50;
  const GRID_SIZE = isTest ? 7 : 71;
  const map = BaseLocationMap.createWithSize(GRID_SIZE);

  const start = map.map[0][0];
  const end = map.map[GRID_SIZE - 1][GRID_SIZE - 1];
  const TIME = isTest ? 12 : 1024;

  if (part === 'A') {
    data.forEach((line, i) => {
      if (i < TIME) {
        const [x, y] = line.split(',').map(Number);
        map.getLocation({ x, y }).wall = true;
      }
    });
    return map.calcuateFastesPath(start, end);
  } else {
    const time = lib.checkBinaryWithInput(TIME, data.length - 1, (n) => {
      // reset map
      map.allLocations().forEach((loc) => {
        loc.wall = false;
        loc.cost = undefined;
      });
      // add walls to map
      data.forEach((line, i) => {
        if (i < n) {
          const [x, y] = line.split(',').map(Number);
          map.getLocation({ x, y }).wall = true;
        }
      });
      // return 1 if we should check smaller number, -1 if we should check higher number
      return map.calcuateFastesPath(start, end) == undefined ? 1 : -1;
    });
    return data[time];
  }
}

export const runs: Run<number | string>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 22 },
  { name: 'prod', part: 'A', data: 'prod', expected: 282 },
  { name: 'test', part: 'B', data: 'test', expected: '6,1' },
  { name: 'prod', part: 'B', data: 'prod', expected: '64,29' },
];
