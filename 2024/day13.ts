import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const machines = data.toGroupsOf(4).map((group) => {
    const butA = new Button(
      Number.parseInt(new RegExp(/X\+(\d+)/g).exec(group[0])![1]),
      Number.parseInt(new RegExp(/Y\+(\d+)/g).exec(group[0])![1]),
      3
    );
    const butB = new Button(
      Number.parseInt(new RegExp(/X\+(\d+)/g).exec(group[1])![1]),
      Number.parseInt(new RegExp(/Y\+(\d+)/g).exec(group[1])![1]),
      1
    );
    const add = part === 'A' ? 0 : 10000000000000;
    return new Machine(
      butA,
      butB,
      Number.parseInt(new RegExp(/X=(\d+)/g).exec(group[2])![1]) + add,
      Number.parseInt(new RegExp(/Y=(\d+)/g).exec(group[2])![1]) + add
    );
  });

  let sols = 0;
  let ret = machines
    .map((machine, i) => {
      const r = machine.calcToWin();
      if (r > 0) {
        sols++;
      }
      return r;
    })
    .sum();
  // record: 180 von 320
  console.log('Solutions:', sols, ' of', machines.length);
  return ret;
}

class Button {
  constructor(public x: number, public y: number, public cost: number) {}
}

class Machine {
  constructor(
    public buttonA: Button,
    public buttonB: Button,
    public prizeX: number,
    public prizeY: number
  ) {}

  pressA = 0;
  pressB = 0;

  calcToWin(): number {
    this.pressA =
      (this.prizeX * this.buttonB.y - this.prizeY * this.buttonB.x) /
      (this.buttonA.x * this.buttonB.y - this.buttonA.y * this.buttonB.x);
    this.pressB =
      (this.prizeY * this.buttonA.x - this.prizeX * this.buttonA.y) /
      (this.buttonA.x * this.buttonB.y - this.buttonA.y * this.buttonB.x);

    if (this.pressA < 0 || this.pressB < 0) {
      // console.log('No solution');
      return 0;
    }
    if (
      Number.isSafeInteger(this.pressA) == false ||
      Number.isSafeInteger(this.pressB) == false
    ) {
      // console.log('No solution, no int');
      return 0;
    }

    return this.pressA * this.buttonA.cost + this.pressB * this.buttonB.cost;
  }
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 480 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 36758 },
  { name: 'B test', part: 'B', data: 'test', expected: 875318608908 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 76358113886726 },
];
