import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const [stackData, operations] = data.splitByEmptyLine();
  const stacks: Stack[] = [];
  const stackCount = (stackData[0].length + 1) / 4;
  for (let i = 0; i < stackData.length - 1; i++) {
    for (let j = 0; j < stackCount; j++) {
      if (!stacks[j]) {
        stacks[j] = new Stack(j + 1);
      }
      const a = stackData[i].substring(j * 4 + 1, j * 4 + 2);
      if (a !== ' ') {
        stacks[j].add(a);
      }
    }
  }
  stacks.forEach((stack) => {
    stack.reverse();
  });

  operations.forEach((operation) => {
    const regex = /move (\d+) from (\d+) to (\d+)/;
    const [count, from, to] = operation.match(regex)!.slice(1).map(Number);
    const fromStack = stacks[from - 1];
    const toStack = stacks[to - 1];
    const elements = fromStack.getXElementsFromTop(count);
    if (part === 'A') {
      toStack.addXElementsOnTop(elements);
    } else {
      toStack.addXElementsOnTopAndKeepOrder(elements);
    }
  });
  return stacks.map((stack) => stack.stack.getLast()).join('');
}

class Stack {
  stack: string[] = [];

  constructor(public readonly count) {}

  add(value: string) {
    this.stack.push(value);
  }
  reverse() {
    this.stack.reverse();
  }

  getXElementsFromTop(x: number) {
    const ret = this.stack.slice(-x);
    this.stack = this.stack.slice(0, -x);
    return ret;
  }
  addXElementsOnTop(elements: string[]) {
    this.stack.push(...elements.reverse());
  }
  addXElementsOnTopAndKeepOrder(elements: string[]) {
    this.stack.push(...elements);
  }

  log() {
    console.log(this.count, this.stack);
  }
  logTop() {
    console.log(this.count, this.stack.slice(-1));
  }
}

// execute and output
lib.execute2('2022', 'day05.ts', run, [
  { name: 'A test', part: 'A', data: 'test', expected: 'CMZ' },
  { name: 'A prod', part: 'A', data: 'prod', expected: 'JDTMRWCQJ' },
  { name: 'B test', part: 'B', data: 'test', expected: 'MCD' },
  { name: 'B prod', part: 'B', data: 'prod', expected: 'VHJDDCWRD' },
]);
