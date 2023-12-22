import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const bricks: Brick[] = [];
  let c = 0;
  const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  for(let line of data) {
    bricks.push(Brick.fromString(line, names[c++%names.length]));
  }
  // initiate coordinate system
  const highestX = bricks.reduce((prev, curr) => Math.max(prev, curr.x2), 0);
  const highestY = bricks.reduce((prev, curr) => Math.max(prev, curr.y2), 0);
  const highestZ = bricks.reduce((prev, curr) => Math.max(prev, curr.z2), 0);
  const coordinateSystem = new CoordinateSystem(highestX, highestY, highestZ, bricks);
  // print test data
  /*
  coordinateSystem.printFromXZ();
  coordinateSystem.printFromYZ();
  console.log('---------------------');
  coordinateSystem.letFall();
  coordinateSystem.printFromXZ();
  coordinateSystem.printFromYZ();
  */
 coordinateSystem.letFall();
  if(part == 'A') {
    return coordinateSystem.countSavelyDisintegratable();
  } else {
    return coordinateSystem.countFallenIfDisintegrated();
  }
}

class CoordinateSystem {
  coordinates: (Brick | null)[][][] = [];
  constructor(
    public x: number, 
    public y: number, 
    public z: number,
    public bricks: Brick[]
  ) {
    for(let i = 0; i <= x; i++) {
      this.coordinates[i] = [];
      for(let j = 0; j <= y; j++) {
        this.coordinates[i][j] = [];
        for(let k = 0; k <= z; k++) {
          this.coordinates[i][j][k] = null;
        }
      }
    }
    bricks.forEach(b => this.addBrickToCoordinateSystem(b));
  }

  addBrickToCoordinateSystem(brick: Brick) {
    for(let i = brick.x1; i <= brick.x2; i++) {
      for(let j = brick.y1; j <= brick.y2; j++) {
        for(let k = brick.z1; k <= brick.z2; k++) {
          this.coordinates[i][j][k] = brick;
        }
      }
    }
  }

  copy(): CoordinateSystem {
    const ret = new CoordinateSystem(this.x, this.y, this.z,this.bricks.map(b => b.copy()));
    return ret;
  }

  countFallenIfDisintegrated():  number{
    let ret = 0;
    for(let i = 0; i < this.bricks.length; i++) {
      const copy = this.copy();
      copy.removeBrickFromCoordinateSystem(copy.bricks[i]);
      const fallen = copy.letFall();
      //console.log(`Brick ${copy.bricks[i].name} removed, ${fallen} bricks fallen`);
      ret += fallen;
    }
    return ret;
  }



  letFall(): number {
    let fallenBricks = 0;
    // start at z = 1, because z = 0 is ground
    // check empty fields and if there is a brick above
    // if yes, then let it fall
    for(let z = 1; z < this.z; z++) {
      for(let x = 0; x <= this.x; x++) {
        for(let y = 0; y <= this.y; y++) {
          // x/y/z is empty and above is a brick
          if(!this.coordinates[x][y][z] && this.coordinates[x][y][z+1]) {
            const checkBrick = this.coordinates[x][y][z+1];
            let isFalling = false;
            while(this.isBrickSupported(checkBrick!) == false) {
              this.dropBrickByOne(checkBrick!);
              isFalling = true;
            }
            if(isFalling) {
              //console.log(`Brick ${checkBrick!.name} has fallen`);
              fallenBricks++;
            }
          }
        }
      }
    }
    return fallenBricks;
  }

  isBrickSupported(brick: Brick): boolean {
    //always supported on z = 1
    if(brick.z1 <= 1) return true;
    for(let x = brick.x1; x <= brick.x2; x++) {
      for(let y = brick.y1; y <= brick.y2; y++) {
        if(this.coordinates[x][y][brick.z1-1]) {
          return true;
        }
      }
    }
    return false;
  }
  dropBrickByOne(brick: Brick) {
    for(let x = brick.x1; x <= brick.x2; x++) {
      for(let y = brick.y1; y <= brick.y2; y++) {
        for(let z = brick.z1; z <= brick.z2; z++) {
          this.coordinates[x][y][z-1] = this.coordinates[x][y][z];
          this.coordinates[x][y][z] = null;
        }
      }
    }
    brick.z1--;
    brick.z2--;
  }

  countSavelyDisintegratable(){
    let disintegrateable = 0;
    for(let brick of this.bricks) {
      if(this.isSafeToDisintegrate(brick)) {
        //console.log(`Brick ${brick.name} is savely disintegratable`);
        ++disintegrateable;
      }
    }
    return disintegrateable;
  }

  isSafeToDisintegrate(brick: Brick): boolean{
    // check if one of the above bricks would fall, if this brick would be removed
    this.removeBrickFromCoordinateSystem(brick);
    for(let otherBrick of this.bricks) {
      // if one brick is not supported anymore, then this brick is not savely disintegratable
      if(otherBrick != brick && this.isBrickSupported(otherBrick) == false) {
        //console.log(`Brick ${otherBrick.name} is not supported anymore`);
        this.addBrickToCoordinateSystem(brick);
        return false;
      }
    }
    this.addBrickToCoordinateSystem(brick);
    return true;
  }

  removeBrickFromCoordinateSystem(brick: Brick) {
    for(let x = brick.x1; x <= brick.x2; x++) {
      for(let y = brick.y1; y <= brick.y2; y++) {
        for(let z = brick.z1; z <= brick.z2; z++) {
          this.coordinates[x][y][z] = null;
        }
      }
    }
    // do not remove from brick array
  }

  printZLayers() {
    for(let k = this.z; k > 0; k--) {
      process.stdout.write(k + '\n');
      for(let i = 0; i <= this.x; i++) {
        for(let j = 0; j <= this.y; j++) {
          process.stdout.write(this.coordinates[i][j][k] ? this.coordinates[i][j][k]!.name.toString() : '.');
        }
        process.stdout.write('\n');
      }
      process.stdout.write('\n');
    }
    process.stdout.write('\n');
  }

  printFromXZ(){
    process.stdout.write('     X\n');
    process.stdout.write('   0123456789\n');
    for(let k = this.z; k >= 0; k--) {
      process.stdout.write(k + '  ');
      for(let i = 0; i <= this.x; i++) {
        if(k == 0)
          process.stdout.write('-');
        else {
          for(let j = 0; j <= this.y+1; j++) {
            if(j == this.y+1) 
              process.stdout.write('.');
            else if(this.coordinates[i][j][k]) {
              process.stdout.write(this.coordinates[i][j][k]!.name.toString());
              break;
            }
          }
        }
      }
      process.stdout.write('\n');
    }
    process.stdout.write('\n');
  }

  printFromYZ(){
    process.stdout.write('   ' + ' '.repeat(this.y/2) + 'Y\n');
    process.stdout.write('   ');
    for(let i = 0; i <= this.y; ++i) {
      process.stdout.write(i.toString());
    }
    process.stdout.write('\n');
    for(let k = this.z; k >= 0; k--) {
      process.stdout.write(k + '  ');
      for(let i = 0; i <= this.y; i++) {
        if(k == 0)
          process.stdout.write('-');
        else {
          for(let j = 0; j <= this.x+1; j++) {
            if(j == this.x+1) 
              process.stdout.write('.');
            else if(this.coordinates[j][i][k]) {
              process.stdout.write(this.coordinates[j][i][k]!.name.toString());
              break;
            }
          }
        }
      }
      process.stdout.write('\n');
    }
    process.stdout.write('\n');
  }

}

class Brick{
  static fromString(str: string, name: string): Brick {
    const nums = str.split('~').flatMap(a => a.split(',')).map(a => Number.parseInt(a));
    return new Brick(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5], name);
  }
  constructor(public x1: number, public y1: number, public z1: number, 
    public x2: number, public y2: number, public z2: number, public name: string) {}
  copy(): Brick {
    return new Brick(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.name);
  }
  toString(): string {
    return `${this.x1},${this.y1},${this.z1}~${this.x2},${this.y2},${this.z2}`;
  }

}

// execute and output
console.log('Test aim: 12345');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 386
// B: 39933