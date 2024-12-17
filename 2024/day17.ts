import { lib, Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const [registerA, registerB, registerC, ...instructions] =
    lib.getAllBigInts(data);

  const comp = new Computer(registerA, registerB, registerC, instructions);
  if (part === 'A') {
    comp.runInstructionAtIndex(0);
    return comp.output.join(',');
  } else {
    return Number(comp.calcAforReproduction(instructions));
  }
}

class Computer {
  output: bigint[] = [];
  expectedOutput: bigint[] = [];

  constructor(
    public registerA: bigint,
    public registerB: bigint,
    public registerC: bigint,
    public instructions: bigint[]
  ) {}

  reset() {
    this.output = [];
    this.registerA = 0n;
    this.registerB = 0n;
    this.registerC = 0n;
  }

  runInstructionAtIndex(instIndex: number) {
    if (instIndex >= this.instructions.length) return;
    const opcode = this.instructions[instIndex];
    const operand = this.instructions[instIndex + 1];
    const combo = this.getComboOperand(operand);

    // do something
    switch (opcode) {
      case 0n:
        this.adv(combo);
        break;
      case 1n:
        this.bxl(operand);
        break;
      case 2n:
        this.bst(combo);
        break;
      case 3n:
        this.jnz(operand, instIndex);
        return; // return to avoid incrementing the instruction pointer
      case 4n:
        this.bxc();
        break;
      case 5n:
        this.out(combo);
        break;
      case 6n:
        this.bdv(combo);
        break;
      case 7n:
        this.cdv(combo);
        break;
    }

    // next instruction
    this.runInstructionAtIndex(instIndex + 2);
  }

  adv(combo: bigint) {
    const numerator = this.registerA;
    const denominator = 2n ** combo;
    const result = numerator / denominator; // bigints have no decimals, so this is a floor division
    this.registerA = result;
  }

  bxl(literal: bigint) {
    this.registerB ^= literal; // bitwise XOR
  }

  bst(combo: bigint) {
    this.registerB = combo % 8n;
  }

  jnz(literal: bigint, instIndex: number) {
    if (this.registerA !== 0n) {
      this.runInstructionAtIndex(Number(literal));
    } else {
      // default: normal jump by 2
      this.runInstructionAtIndex(instIndex + 2);
    }
  }

  bxc() {
    this.registerB ^= this.registerC;
  }

  out(combo: bigint) {
    const output = combo % 8n;
    this.output.push(output);
    if (this.expectedOutput.length > 0) {
      // throw error if output is not as expected, so we can abort the run early
      // if output is longer than expected
      if (this.output.length > this.expectedOutput.length) {
        throw new Error('Output is longer than expected');
      }

      // check if output is as expected
      for (let i = 0; i < this.output.length; i++) {
        if (this.expectedOutput[i] !== this.output[i]) {
          throw new Error('Output is not as expected');
        }
      }
    }
  }

  bdv(combo: bigint) {
    const numerator = this.registerA;
    const denominator = 2n ** combo;
    const result = numerator / denominator;
    this.registerB = result;
  }

  cdv(combo: bigint) {
    const numerator = this.registerA;
    const denominator = 2n ** combo;
    const result = numerator / denominator;
    this.registerC = result;
  }

  getComboOperand(combo: bigint) {
    switch (combo) {
      case 4n:
        return this.registerA;
      case 5n:
        return this.registerB;
      case 6n:
        return this.registerC;
      default:
        return combo;
    }
  }

  calcAforReproduction(target: bigint[]): bigint {
    // go recursivly from end to start
    // at the last element we start with registerA = 0
    // otherwise we start with 8 * n, where n is the result of the following elements
    // we multiply by 8 to reverse the division by 8 in the out-instruction (modulo 8)
    let i =
      target.length === 1
        ? 0n
        : 8n * this.calcAforReproduction(target.slice(1));

    this.expectedOutput = target;

    while (this.output.equals(target) == false) {
      this.reset();
      this.registerA = i;
      try {
        this.runInstructionAtIndex(0);
      } catch (e) {
        // we throw errors if the output is not as expected
      }
      ++i;
    }

    return --i; // reverse last increment
  }
}

export const runs: Run<string | number>[] = [
  { name: 'test', part: 'A', data: 'test', expected: '4,6,3,5,6,3,5,2,1,0' },
  { name: 'prod', part: 'A', data: 'prod', expected: '3,4,3,1,7,6,5,6,0' },
  {
    name: 'test',
    part: 'B',
    data: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`.split('\n'),
    expected: 117440,
  },
  { name: 'prod', part: 'B', data: 'prod', expected: 109019930331546 },
];
