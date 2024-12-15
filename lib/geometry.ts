export type Point = { x: number; y: number };
export class Polygon {
  borderLength: number = 0;
  constructor(public points: Point[]) {}

  addPoint(point: Point) {
    this.borderLength += Math.sqrt(
      Math.pow(point.x - this.points[this.points.length - 1].x, 2) +
        Math.pow(point.y - this.points[this.points.length - 1].y, 2)
    );
    this.points.push(point);
  }

  calculateArea(): number {
    let area = 0;
    let j = this.points.length - 1;
    for (let i = 0; i < this.points.length; i++) {
      area +=
        (this.points[j].x + this.points[i].x) *
        (this.points[j].y - this.points[i].y);
      j = i;
    }
    return Math.abs(area / 2);
  }

  calculateAreaIncudingBorders(): number {
    return this.calculateArea() + this.borderLength / 2 + 1;
  }
}

export type DirectionName = 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SW' | 'SE';
export class Direction {
  static N = new Direction(0, -1);
  static S = new Direction(0, 1);
  static W = new Direction(-1, 0);
  static E = new Direction(1, 0);
  static NW = new Direction(-1, -1);
  static NE = new Direction(1, -1);
  static SW = new Direction(-1, 1);
  static SE = new Direction(1, 1);

  /**
   *    -1  0  1 x
   * -1  NW N NE
   *  0  W  .  E
   *  1  SW S SE
   *  y
   *
   * @param x x direction
   * @param y y direction
   */
  constructor(public readonly x: -1 | 0 | 1, public readonly y: -1 | 0 | 1) {}

  static getDirectionsArray(which: '+' | 'x' | 'all' = 'all'): Direction[] {
    switch (which) {
      case '+':
        return [
          new Direction(0, -1),
          new Direction(0, 1),
          new Direction(-1, 0),
          new Direction(1, 0),
        ];
      case 'x':
        return [
          new Direction(-1, -1),
          new Direction(-1, 1),
          new Direction(1, -1),
          new Direction(1, 1),
        ];
      default:
        return [
          new Direction(0, -1),
          new Direction(0, 1),
          new Direction(-1, 0),
          new Direction(1, 0),
          new Direction(-1, -1),
          new Direction(-1, 1),
          new Direction(1, -1),
          new Direction(1, 1),
        ];
    }
  }

  static getDirectionsRecord(
    which: '+' | 'x' | 'all' = 'all'
  ): Record<DirectionName, Direction> {
    const record: Record<string, Direction> = {};
    switch (which) {
      case '+':
        record['N'] = new Direction(0, -1);
        record['S'] = new Direction(0, 1);
        record['W'] = new Direction(-1, 0);
        record['E'] = new Direction(1, 0);
        break;
      case 'x':
        record['NW'] = new Direction(-1, -1);
        record['NE'] = new Direction(1, -1);
        record['SW'] = new Direction(-1, 1);
        record['SE'] = new Direction(1, 1);
        break;
      default:
        record['N'] = new Direction(0, -1);
        record['S'] = new Direction(0, 1);
        record['W'] = new Direction(-1, 0);
        record['E'] = new Direction(1, 0);
        record['NW'] = new Direction(-1, -1);
        record['NE'] = new Direction(1, -1);
        record['SW'] = new Direction(-1, 1);
        record['SE'] = new Direction(1, 1);
    }

    return record;
  }

  static fromInput(input: string): Direction[] {
    return input.split('').map((char) => {
      switch (char) {
        case '^':
          return Direction.N;
        case 'v':
          return Direction.S;
        case '<':
          return Direction.W;
        case '>':
          return Direction.E;
        case '↗':
          return Direction.NE;
        case '↘':
          return Direction.SE;
        case '↙':
          return Direction.SW;
        case '↖':
          return Direction.NW;
        default:
          throw new Error('Invalid direction');
      }
    });
  }

  print(): void {
    if (this.equals(Direction.N)) console.log('^');
    else if (this.equals(Direction.S)) console.log('v');
    else if (this.equals(Direction.W)) console.log('<');
    else if (this.equals(Direction.E)) console.log('>');
    else if (this.equals(Direction.NE)) console.log('↗');
    else if (this.equals(Direction.NW)) console.log('↖');
    else if (this.equals(Direction.SW)) console.log('↙');
    else if (this.equals(Direction.SE)) console.log('↘');
  }

  isVertical(): boolean {
    return this.x === 0;
  }
  isHorizontal(): boolean {
    return this.y === 0;
  }

  copy(): Direction {
    return new Direction(this.x, this.y);
  }

  equals(direction: Direction): boolean {
    return this.x === direction.x && this.y === direction.y;
  }

  go(point: Point | BaseLocation, steps: number = 1): Point {
    return { x: point.x + this.x * steps, y: point.y + this.y * steps };
  }

  getValuesFromLine<T extends string | unknown[]>(
    grid: T[],
    start: Point,
    steps: number
  ): T {
    const end = this.go(start, steps);
    if (grid[0].hasIndex(start.x) == false || grid.hasIndex(start.y) == false) {
      throw new Error(`Point ${end.x},${end.y} is out of bounds`);
    }
    const isString = typeof grid[0] === 'string';

    let values = (isString ? '' : []) as T;
    for (let i = 0; i < steps; i++) {
      let point = this.go(start, i);
      if (isString) {
        (values as unknown as string) += (grid[point.y] as string)[point.x];
      } else {
        (values as unknown as unknown[]).push(
          (grid[point.y] as unknown[])[point.x]
        );
      }
    }
    return values;
  }

  rotateRight(): Direction {
    if (this.equals(Direction.N)) return Direction.E;
    if (this.equals(Direction.E)) return Direction.S;
    if (this.equals(Direction.S)) return Direction.W;
    if (this.equals(Direction.W)) return Direction.N;
    if (this.equals(Direction.NW)) return Direction.NE;
    if (this.equals(Direction.NE)) return Direction.SE;
    if (this.equals(Direction.SE)) return Direction.SW;
    if (this.equals(Direction.SW)) return Direction.NW;
    throw new Error('Invalid direction');
  }

  rotateLeft(): Direction {
    if (this.equals(Direction.N)) return Direction.W;
    if (this.equals(Direction.W)) return Direction.S;
    if (this.equals(Direction.S)) return Direction.E;
    if (this.equals(Direction.E)) return Direction.N;
    if (this.equals(Direction.NW)) return Direction.SW;
    if (this.equals(Direction.SW)) return Direction.SE;
    if (this.equals(Direction.SE)) return Direction.NE;
    if (this.equals(Direction.NE)) return Direction.NW;
    throw new Error('Invalid direction');
  }

  turnAround(): Direction {
    return new Direction(
      (this.x * -1) as 0 | 1 | -1,
      (this.y * -1) as 0 | 1 | -1
    );
  }
}

export abstract class BaseLocation {
  x = 0;
  y = 0;
  visited: boolean = false;
  movedThroughDirections: Direction[] = [];
  partOfArea = false;

  copy(newLocation = this.constructor()): BaseLocation {
    newLocation.x = this.x;
    newLocation.y = this.y;
    newLocation.visited = this.visited;
    newLocation.movedThroughDirections = this.movedThroughDirections.map(
      (dir) => dir.copy()
    );
    return newLocation;
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

  addRecursiveToArea<T extends BaseLocation>(
    map: BaseLocationMap<T>,
    area: BaseArea<T, BaseLocationMap<T>>,
    isSameArea: (a: T, b: T) => boolean,
    directions: 'all' | '+' | 'x' = '+'
  ) {
    if (this.partOfArea) return; // each location can only be in one area.

    area.addLocation(this as unknown as T);
    this.partOfArea = true;

    const directionList = Direction.getDirectionsArray(directions);
    for (const dir of directionList) {
      const nextPos = dir.go(this);
      if (
        map.hasPosition(nextPos) &&
        isSameArea(this as unknown as T, map.getLocation(nextPos))
      ) {
        map
          .getLocation(nextPos)
          .addRecursiveToArea(map, area, isSameArea, directions);
      }
    }
  }
}

export class BaseLocationMap<T extends BaseLocation> {
  static createFromInput<T extends BaseLocation>(
    input: string[],
    parseInput: (char: string, x: number, y: number) => T
  ): BaseLocationMap<T> {
    const map = new BaseLocationMap<T>();
    input.forEach((line, y) => {
      map.map[y] = [];
      line.split('').forEach((char, x) => {
        map.map[y][x] = parseInput(char, x, y);
        map.map[y][x].x = x;
        map.map[y][x].y = y;
      });
    });

    return map;
  }

  // used for 2024 day 15 part B, where each character is 2 locations wide
  static createFromInput2<T extends BaseLocation>(
    input: string[],
    parseInput: (char: string, x: number, y: number) => [T, T]
  ): BaseLocationMap<T> {
    const map = new BaseLocationMap<T>();
    input.forEach((line, y) => {
      map.map[y] = [];
      line.split('').forEach((char, x) => {
        const [locA, locB] = parseInput(char, x, y);
        map.map[y][x * 2] = locA;
        map.map[y][x * 2].x = x * 2;
        map.map[y][x * 2].y = y;
        map.map[y][x * 2 + 1] = locB;
        map.map[y][x * 2 + 1].x = x * 2 + 1;
        map.map[y][x * 2 + 1].y = y;
      });
    });

    return map;
  }

  map: T[][] = [];

  constructor() {}

  copy(): BaseLocationMap<T> {
    const newMap = new BaseLocationMap<T>();
    newMap.map = this.map.map((row) => row.map((loc) => loc.copy() as T));
    return newMap;
  }

  allLocations(): T[] {
    return this.map.flat();
  }

  hasPosition(point: Point): boolean {
    return (
      this.map[point.y] !== undefined &&
      this.map[point.y][point.x] !== undefined
    );
  }

  getLocation(point: Point): T {
    return this.map[point.y][point.x];
  }

  for(callback: (location: T, x: number, y: number) => void) {
    this.map.forEach((row, y) => {
      row.forEach((location, x) => {
        callback(location, x, y);
      });
    });
  }

  print(callback: (location: T) => string): void {
    console.log(
      this.map.map((row) => row.map((loc) => callback(loc)).join('')).join('\n')
    );
  }

  createAreas<U extends BaseArea<T, BaseLocationMap<T>>>(
    createArea: (loc: T, map: BaseLocationMap<T>) => U,
    isSameArea: (a: T, b: T) => boolean,
    directions: '+' | 'x' | 'all' = 'all'
  ): U[] {
    const areas: U[] = [];
    this.for((loc) => {
      if (loc.partOfArea) return;
      const area = createArea(loc, this);
      loc.addRecursiveToArea(this, area, isSameArea, directions);
      areas.push(area);
    });

    return areas;
  }
}

/**
 * Base class for areas
 *
 * An area is a connected subset of locations inside a BaseLocationMap
 */
export class BaseArea<T extends BaseLocation, M extends BaseLocationMap<T>> {
  locations: T[] = [];

  constructor(public areaName: string, public map: M) {}

  print(
    inMap: boolean,
    callback: (location: T) => string = (loc) => this.areaName,
    notInArea: string = '.'
  ): void {
    if (inMap) {
      this.map.print((loc) => {
        return this.locations.some((l) => l.x === loc.x && l.y === loc.y)
          ? callback(loc)
          : notInArea;
      });
    } else {
      // print only the area
      const minX = Math.min(...this.locations.map((loc) => loc.x));
      const maxX = Math.max(...this.locations.map((loc) => loc.x));
      const minY = Math.min(...this.locations.map((loc) => loc.y));
      const maxY = Math.max(...this.locations.map((loc) => loc.y));
      for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
          line += this.locations.some((loc) => loc.x === x && loc.y === y)
            ? callback(this.map.getLocation({ x, y }) as T)
            : notInArea;
        }
        console.log(line);
      }
    }
  }

  getAreaSize(): number {
    return this.locations.length;
  }

  calculatePerimeter(): number {
    let perimeter = 0;
    const directions = Direction.getDirectionsArray('+');
    for (const loc of this.locations) {
      for (const dir of directions) {
        const nextPos = dir.go(loc);
        if (this.hasLocation(nextPos) == false) {
          perimeter++;
        }
      }
    }
    return perimeter;
  }

  addLocation(location: T): void {
    this.locations.push(location);
  }

  hasLocation(location: Point): boolean {
    return this.locations.some(
      (loc) => loc.x === location.x && loc.y === location.y
    );
  }

  getLocation(location: Point): T | undefined {
    return this.locations.find(
      (loc) => loc.x === location.x && loc.y === location.y
    );
  }
}

export class LocationRunner {
  pos: Point = { x: 0, y: 0 };
  direction: Direction = Direction.N;

  moveForwardWhile<
    T extends BaseLocationMap<L>,
    L extends BaseLocation,
    EndCondition
  >(
    locationMap: T,
    callback: (checkLocation: L) => EndCondition | 'continue'
  ): EndCondition | 'OutOfBounds' {
    while (true) {
      const nextPos = this.direction.go(this.pos);
      if (!locationMap.hasPosition(nextPos)) {
        return 'OutOfBounds';
      }
      const loc = locationMap.getLocation(nextPos);
      const endCondition = callback(loc);
      if (endCondition !== 'continue') {
        return endCondition;
      }
      loc.moveThrough(this.direction);
      this.pos = nextPos;
    }
  }
}
