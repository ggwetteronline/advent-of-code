import { BaseLocation, BaseLocationMap, Direction, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const locationMap = BaseLocationMap.createFromInput(data, (char, x, y) => {
    return new Location(Number.parseInt(char));
  });
  const trailheads = locationMap
    .allLocations()
    .filter((loc) => loc.height === 0);

  if (part === 'A') {
    return trailheads
      .map((trailhead) => {
        return trailhead.calcTrails(locationMap, new Set<Location>());
      })
      .sum();
  } else {
    return trailheads
      .map((trailhead) => {
        return trailhead.calcTrailsB(locationMap);
      })
      .sum();
  }
}

class Location extends BaseLocation {
  constructor(public height: number) {
    super();
  }

  calcTrails(
    map: BaseLocationMap<Location>,
    // we use a Set to ensure we only count each target once
    uniqueTargets: Set<Location>
  ): number {
    if (this.height == 9) {
      uniqueTargets.add(this);
      return 0;
    }
    const directions = Direction.getDirectionsArray('+');

    for (const dir of directions) {
      const nextPos = dir.go(this);
      if (
        map.hasPosition(nextPos) &&
        map.getLocation(nextPos).height == this.height + 1
      ) {
        map.getLocation(nextPos).calcTrails(map, uniqueTargets);
      }
    }
    if (this.height == 0) {
      return uniqueTargets.size;
    }
    return 0;
  }

  calcTrailsB(map: BaseLocationMap<Location>): number {
    if (this.height == 9) {
      return 1;
    }
    let trails = 0;
    const directions = Direction.getDirectionsArray('+');

    for (const dir of directions) {
      const nextPos = dir.go(this);
      if (
        map.hasPosition(nextPos) &&
        map.getLocation(nextPos).height == this.height + 1
      ) {
        trails += map.getLocation(nextPos).calcTrailsB(map);
      }
    }
    return trails;
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 36 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 461 },
  { name: 'B test', part: 'B', data: 'test', expected: 81 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 875 },
];
