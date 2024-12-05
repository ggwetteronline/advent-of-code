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
  constructor(public x: -1 | 0 | 1, public y: -1 | 0 | 1) {}

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
  go(point: Point, steps: number = 1): Point {
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
}
