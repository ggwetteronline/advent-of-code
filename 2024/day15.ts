import {
  BaseLocation,
  BaseLocationMap,
  Direction,
  LocationRunner,
  Point,
  Run,
} from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const [raw_map, raw_movements] = data.splitByEmptyLine();
  let robot;

  const movements = Direction.fromInput(raw_movements.join(''));

  if (part === 'A') {
    const map = BaseLocationMap.createFromInput(raw_map, (char, x, y) => {
      const loc = new Location();
      switch (char) {
        case '#':
          loc.wall = true;
          break;
        case '.':
          break;
        case 'O':
          loc.box = true;
          break;
        case '@':
          robot = new Robot(x, y);
          break;
      }
      return loc;
    });
    movements.forEach((dir) => {
      robot.moveInDirection(dir, map);
    });
    // calculate
    return map
      .allLocations()
      .filter((loc) => loc.box)
      .map((loc) => loc.x + loc.y * 100)
      .sum();
  } else {
    const map = BaseLocationMap.createFromInput2(raw_map, (char, x, y) => {
      const loc = new Location();
      const loc2 = new Location();
      switch (char) {
        case '#':
          loc.wall = true;
          loc2.wall = true;
          break;
        case '.':
          break;
        case 'O':
          loc.box = true;
          loc.boxLeft = true;
          loc2.box = true;
          loc2.boxRight = true;
          break;
        case '@':
          robot = new Robot(x * 2, y);
          break;
      }
      return [loc, loc2];
    });
    movements.forEach((dir, i) => {
      // dir.print();
      robot.moveInDirection2(dir, map);
      // printMap(map, robot);
    });

    // calculate
    return map
      .allLocations()
      .filter((loc) => loc.boxLeft)
      .map((loc) => loc.x + loc.y * 100)
      .sum();
  }
}

function printMap(map: BaseLocationMap<Location>, robot: Robot) {
  map.print((loc) => {
    if (loc.wall) return '#';
    if (loc.boxLeft) return '[';
    if (loc.boxRight) return ']';
    if (loc.box) return 'O';
    if (robot.pos.x === loc.x && robot.pos.y === loc.y) return '@';
    return '.';
  });
}

class Location extends BaseLocation {
  wall = false;
  box = false;
  boxLeft = false;
  boxRight = false;
}

class Robot extends LocationRunner {
  constructor(x: number, y: number) {
    super();
    this.pos = { x, y };
  }

  moveInDirection(dir: Direction, map: BaseLocationMap<Location>) {
    if (this.canGoInDirection(dir, map, this.pos) == false) return;
    this.pos = dir.go(this.pos);

    let curPos = map.getLocation(this.pos);
    if (curPos.box == true) {
      // move boxes
      curPos.box = false;
      let nextPos = map.getLocation(dir.go(curPos));
      while (nextPos.box == true) {
        nextPos.box = true;
        curPos = nextPos;
        nextPos = map.getLocation(dir.go(curPos));
      }
      nextPos.box = true;
    }
  }

  moveInDirection2(dir: Direction, map: BaseLocationMap<Location>) {
    if (this.canGoInDirection2(dir, map, this.pos, undefined) == false) return;
    this.pos = dir.go(this.pos);

    let curPos = map.getLocation(this.pos);
    if (curPos.box == true) {
      if (dir.equals(Direction.N) || dir.equals(Direction.S)) {
        // move boxes in up or down direction
        let isLeft = [curPos.boxLeft];
        curPos.box = false;
        curPos.boxLeft = false;
        curPos.boxRight = false;
        const curPos2 = isLeft[0]
          ? map.getLocation({ x: curPos.x + 1, y: curPos.y })
          : map.getLocation({ x: curPos.x - 1, y: curPos.y });
        curPos2.box = false;
        curPos2.boxLeft = false;
        curPos2.boxRight = false;
        let nextPos = isLeft[0]
          ? [map.getLocation(dir.go(curPos)), map.getLocation(dir.go(curPos2))]
          : [map.getLocation(dir.go(curPos2)), map.getLocation(dir.go(curPos))];
        isLeft = [true, false]; // get nextPos in order, that left is first

        // while any pos has a box, move them
        while (nextPos.find((pos) => pos.box == true) != undefined) {
          // get boxes of nextPos
          const nextPosSet = new Set<Location>();
          nextPos.forEach((pos) => {
            if (pos.box == true) {
              if (pos.boxLeft) {
                nextPosSet.add(map.getLocation(dir.go(pos)));
                nextPosSet.add(
                  map.getLocation(dir.go({ x: pos.x + 1, y: pos.y }))
                );
              } else {
                nextPosSet.add(
                  map.getLocation(dir.go({ x: pos.x - 1, y: pos.y }))
                );
                nextPosSet.add(map.getLocation(dir.go(pos)));
              }
            }
          });
          const nextPos2 = Array.from(nextPosSet);
          const isLeft2 = nextPos2.map((pos) => {
            const lastPos = map.getLocation(dir.go(pos, -1));
            const isLeft = lastPos.boxLeft;
            // clear all old positions
            lastPos.box = false;
            lastPos.boxLeft = false;
            lastPos.boxRight = false;
            return isLeft;
          });

          // replace locations with values of last run
          nextPos.forEach((pos, i) => {
            pos.box = true;
            pos.boxLeft = isLeft[i];
            pos.boxRight = !isLeft[i];
          });

          isLeft = isLeft2;
          nextPos = nextPos2;
        }

        nextPos.forEach((pos, i) => {
          pos.box = true;
          pos.boxLeft = isLeft[i];
          pos.boxRight = !isLeft[i];
        });
      } else {
        // move boxes in left or right direction
        let isLeft = curPos.boxLeft;
        curPos.box = false;
        curPos.boxLeft = false;
        curPos.boxRight = false;

        let nextPos = map.getLocation(dir.go(curPos));
        while (nextPos.box == true) {
          const isLeft2 = nextPos.boxLeft;
          nextPos.boxLeft = isLeft;
          nextPos.boxRight = !isLeft;
          isLeft = isLeft2;
          curPos = nextPos;
          nextPos = map.getLocation(dir.go(curPos));
        }
        nextPos.box = true;
        nextPos.boxLeft = isLeft;
        nextPos.boxRight = !isLeft;
      }
    }
  }

  canGoInDirection(dir: Direction, map: BaseLocationMap<Location>, pos: Point) {
    let nextPos = map.getLocation(dir.go(pos));
    if (nextPos.wall == true) return false;
    if (nextPos.box == false) return true;
    if (nextPos.box == true) {
      return this.canGoInDirection(dir, map, nextPos);
    }
  }

  canGoInDirection2(
    dir: Direction,
    map: BaseLocationMap<Location>,
    pos: Point,
    pos2: Point | undefined
  ) {
    if (dir.equals(Direction.N) || dir.equals(Direction.S)) {
      const nextPos = map.getLocation(dir.go(pos));
      const nextPos2 = pos2 ? map.getLocation(dir.go(pos2)) : undefined;

      // has wall -> end
      if (
        nextPos.wall == true ||
        (nextPos2 != undefined && nextPos2.wall == true)
      )
        return false;
      // has neither wall nor box -> go
      if (
        nextPos.box == false &&
        (nextPos2 == undefined || nextPos2.box == false)
      )
        return true;

      // one pos has box -> check if box can be moved
      const positionsWithBoxes = [nextPos, nextPos2].filter(
        (pos) => pos != undefined && pos.box == true
      ) as Location[];
      if (positionsWithBoxes.length == 1) {
        // if we have one box, check if this box (with its left and right position) can be moved
        const pwb = positionsWithBoxes[0];
        if (pwb.boxLeft) {
          return this.canGoInDirection2(dir, map, pwb, {
            x: pwb.x + 1,
            y: pwb.y,
          });
        } else {
          return this.canGoInDirection2(
            dir,
            map,
            {
              x: pwb.x - 1,
              y: pwb.y,
            },
            pwb
          );
        }
      } else {
        // check if both positions can be moved
        if (nextPos.boxLeft) {
          // next pos is left and nextPos2 is right
          return this.canGoInDirection2(dir, map, nextPos, {
            x: nextPos.x + 1,
            y: nextPos.y,
          });
        } else {
          return (
            this.canGoInDirection2(
              dir,
              map,
              {
                x: nextPos.x - 1,
                y: nextPos.y,
              },
              nextPos
            ) &&
            this.canGoInDirection2(dir, map, nextPos2!, {
              x: nextPos2!.x + 1,
              y: nextPos2!.y,
            })
          );
        }
      }
    } else {
      // if we go left or right, check for the next free space
      const nextPos = map.getLocation(dir.go(pos));
      if (nextPos.wall == true) return false;
      if (nextPos.box == false) return true;
      return this.canGoInDirection2(dir, map, nextPos, undefined);
    }
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 10092 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 1430439 },
  { name: 'B test', part: 'B', data: 'test', expected: 9021 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 1458740 },
];
