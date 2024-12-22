import { BaseLocation, BaseLocationMap, Run } from '../lib';

// main function
export function run(data: string[], part: 'A' | 'B') {
  // parse input
  let start, end;
  const map = LocationMap.createFromInput(
    data,
    (c) => {
      const l = new BaseLocation();
      if (c === '#') l.wall = true;
      if (c === 'E') end = l;
      if (c === 'S') start = l;
      return l;
    },
    new LocationMap()
  ) as LocationMap;

  // end conditions
  const isTest = data.length < 20;
  const cheatTime = part === 'A' ? 2 : 20;
  const filterWithCheatTimeAbove = isTest ? (part === 'A' ? 0 : 50) : 100;

  // calculate
  map.calcuateFastesPath(start, end);

  const bestCheats = map
    .calculateSavings(cheatTime)
    .filter((a) => a >= filterWithCheatTimeAbove);
  /*
  console.log(
    bestCheats
      .sort((a, b) => a - b)
      .groupBy((a) => a)
      .map((a) => `${a.length} -> ${a[0]}`)
  );*/
  return bestCheats.length;
}

class LocationMap extends BaseLocationMap<BaseLocation> {
  /**
   * ATTENTION!
   * call map.calcuateFastesPath() first
   *
   */
  calculateSavings(maxCheatTime: number): number[] {
    // we can only start from locations, that have a cost, which means they
    // were visited by searching the fastest path to end
    const allStartCheatLocations = this.allLocations().filter(
      (l) => l.cost != undefined
    );

    return allStartCheatLocations.flatMap((startL) => {
      return this.getAllLocationsWithDistanceTo(startL, maxCheatTime)
        .map(([otherLocation, distance]) => {
          if (otherLocation.wall == false) {
            return otherLocation.cost! - (startL.cost! + distance); // how much we save
          }
          return undefined;
        })
        .filter((a) => a != undefined && a > 0) as number[];
    });
  }
}

export const runs: Run<number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 44 },
  { name: 'prod', part: 'A', data: 'prod', expected: 1372 },
  { name: 'test', part: 'B', data: 'test', expected: 285 },
  { name: 'prod', part: 'B', data: 'prod', expected: 979014 },
];
