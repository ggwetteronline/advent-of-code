import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const computers = new Map<string, Computer>();
  data.map((line) => {
    const [a, b] = line.split('-');
    if (!computers.has(a)) {
      computers.set(a, new Computer(a));
    }
    if (!computers.has(b)) {
      computers.set(b, new Computer(b));
    }
    computers.get(a)!.connect(computers.get(b)!);
  });

  if (part === 'A') {
    const setsOfThree = new Set<string>(); // use set to avoid duplicates
    computers.forEach((computer) => {
      computer.getSetsOfThreeConnected(setsOfThree);
    });
    // get sets where at least one computer starts with "t"
    const t = [...setsOfThree].filter((connected) =>
      connected.split(',').find((name) => name.startsWith('t'))
    );
    return t.length;
  } else {
    let largestGroup: string[] = [];
    computers.forEach((computer) => {
      const group = computer.findGroup();
      if (group.length > largestGroup.length) {
        largestGroup = group;
      }
    });
    const password = largestGroup.sort().join(',');
    return password;
  }
}

class Computer {
  connections: Map<string, Computer> = new Map();
  constructor(public name) {}

  connect(other: Computer) {
    this.connections.set(other.name, other);
    other.connections.set(this.name, this);
  }

  getSetsOfThreeConnected(sets: Set<string>) {
    Array.from(this.connections.entries()).mapPairs((a, b) => {
      // get connected pairs (both are connected to this, so its a set of 3)
      if (a[1].connections.has(b[0])) {
        // sort the names so we don't get duplicates
        sets.add([this.name, a[0], b[0]].sort().join(','));
      }
    });
  }

  findGroup(): string[] {
    const group: string[] = [this.name];
    const candidates = Array.from(this.connections.values());
    // get everyone who is connected to everyone else in the group
    for (const candidate of candidates) {
      if (group.every((name) => candidate.connections.has(name))) {
        group.push(candidate.name);
      }
    }
    return group;
  }
}

export const runs: Run<number | string>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 7 },
  { name: 'prod', part: 'A', data: 'prod', expected: 1151 },
  { name: 'test', part: 'B', data: 'test', expected: 'co,de,ka,ta' },
  {
    name: 'prod',
    part: 'B',
    data: 'prod',
    expected: 'ar,cd,hl,iw,jm,ku,qo,rz,vo,xe,xm,xv,ys',
  },
];
