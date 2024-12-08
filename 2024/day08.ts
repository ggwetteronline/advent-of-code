import { BaseLocation, BaseLocationMap, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  // prepare data
  const frequencyMap = new Map<string, Location[]>();
  const locationMap = BaseLocationMap.createFromInput(data, (char, x, y) => {
    const loc = new Location();
    if (char !== '.') {
      loc.frequency = char;
      if (!frequencyMap.has(char)) {
        frequencyMap.set(char, []);
      }
      frequencyMap.get(char)?.push(loc);
    }
    return loc;
  });

  // solve
  if (part === 'A') {
    frequencyMap.forEach((locations) => {
      locations.mapPairs((location, otherLocation) => {
        addAntinode(location, otherLocation, locationMap);
      });
    });
    return locationMap.allLocations().filter((loc) => loc.antinode).length;
  } else {
    frequencyMap.forEach((locations) => {
      locations.mapPairs((location, otherLocation) => {
        addAntinodes(location, otherLocation, locationMap);
      });
    });
    return locationMap
      .allLocations()
      .filter((loc) => loc.antinode || loc.frequency).length;
  }
}

class Location extends BaseLocation {
  frequency: string | false = false;
  antinode = false;
}

function addAntinode(
  locationA: Location,
  locationB: Location,
  locationMap: BaseLocationMap<Location>
) {
  const xDist = locationA.x - locationB.x;
  const yDist = locationA.y - locationB.y;
  // calculate position in 2x dist before and after
  const xBefore = locationA.x + xDist;
  const yBefore = locationA.y + yDist;
  const xAfter = locationB.x - xDist;
  const yAfter = locationB.y - yDist;
  // check if the calculated positions are in the map
  if (locationMap.hasPosition({ x: xBefore, y: yBefore })) {
    locationMap.getLocation({ x: xBefore, y: yBefore }).antinode = true;
  }
  if (locationMap.hasPosition({ x: xAfter, y: yAfter })) {
    locationMap.getLocation({ x: xAfter, y: yAfter }).antinode = true;
  }
}

function addAntinodes(
  locationA: Location,
  locationB: Location,
  locationMap: BaseLocationMap<Location>
) {
  const xDist = locationA.x - locationB.x;
  const yDist = locationA.y - locationB.y;
  // calculate position in 2x dist before and after
  let xBefore = locationA.x + xDist;
  let yBefore = locationA.y + yDist;
  while (locationMap.hasPosition({ x: xBefore, y: yBefore })) {
    locationMap.getLocation({ x: xBefore, y: yBefore }).antinode = true;
    xBefore += xDist;
    yBefore += yDist;
  }

  let xAfter = locationB.x - xDist;
  let yAfter = locationB.y - yDist;
  while (locationMap.hasPosition({ x: xAfter, y: yAfter })) {
    locationMap.getLocation({ x: xAfter, y: yAfter }).antinode = true;
    xAfter -= xDist;
    yAfter -= yDist;
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 14 },
  // { name: 'A prod', part: 'A', data: 'prod', expected: 376 },
  // { name: 'B test', part: 'B', data: 'test', expected: 34 },
  // { name: 'B prod', part: 'B', data: 'prod', expected: 1352 },
];
