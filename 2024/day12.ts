import {
  BaseArea,
  BaseLocation,
  BaseLocationMap,
  Direction,
  Run,
} from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const locaMap = BaseLocationMap.createFromInput(data, (char, x, y) => {
    return new PlantLocation(char);
  });
  const plantAreas = locaMap.createAreas<PlantArea>(
    (loc, map) => new PlantArea(loc.char, map),
    (a, b) => a.char === b.char,
    '+'
  );

  return plantAreas
    .map((area) => {
      return (
        (part === 'A' ? area.calculatePerimeter() : area.calcSides()) *
        area.getAreaSize()
      );
    })
    .sum();
}

class PlantArea extends BaseArea<
  PlantLocation,
  BaseLocationMap<PlantLocation>
> {
  calcSides() {
    const directions = Direction.getDirectionsRecord('+');
    return (
      this.getSides(directions.N) +
      this.getSides(directions.S) +
      this.getSides(directions.W) +
      this.getSides(directions.E)
    );
  }

  getSides(direction: Direction): number {
    let sides = 0;
    this.locations
      // filter locations that have no neighbor in direction, therefore they have a fence there
      .filter((loc) => this.hasLocation(direction.go(loc)) == false)
      // order and group the locations by the x and y coordinate
      .sort((a, b) => (direction.isVertical() ? a.x - b.x : a.y - b.y))
      .groupBy((loc) => (direction.isVertical() ? loc.y : loc.x))
      .forEach((fences) => {
        sides++;
        for (let i = 1; i < fences.length; i++) {
          // if two fences are in the same row or column but not next to each other
          // they are two different sides
          if (
            direction.isVertical()
              ? fences[i].x !== fences[i - 1].x + 1
              : fences[i].y !== fences[i - 1].y + 1
          ) {
            sides++;
          }
        }
      });

    return sides;
  }
}

class PlantLocation extends BaseLocation {
  constructor(public char: string) {
    super();
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 1930 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 1477762 },
  { name: 'B test', part: 'B', data: 'test', expected: 1206 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 923480 },
];
