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

export class Direction {
  constructor(public x: -1 | 0 | 1, public y: -1 | 0 | 1) {}
  static getDirections(
    up: string = 'up',
    down: string = 'down',
    left: string = 'left',
    right: string = 'right'
  ): Record<string, Direction> {
    const record: Record<string, Direction> = {};
    record[up] = new Direction(0, -1);
    record[down] = new Direction(0, 1);
    record[left] = new Direction(-1, 0);
    record[right] = new Direction(1, 0);
    return record;
  }
  go(point: Point, steps: number = 1): Point {
    return { x: point.x + this.x * steps, y: point.y + this.y * steps };
  }
}
