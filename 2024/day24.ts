import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const [w, g] = data.splitByEmptyLine();
  const circuit = new Circuit(w, g);
  if (part === 'A') {
    circuit.calcZWire();
    return parseInt(circuit.getZValuesAsBinary2(), 2);
  } else {
    return circuit.getWrongGates();
  }
}

type Operation = 'AND' | 'OR' | 'XOR';

class Gate {
  constructor(
    public a: string,
    public op: Operation,
    public b: string,
    public out: string
  ) {}

  /**
   * Calculates the output of the gate
   * @param wires Map of all wires
   * @returns true, if the output was calculated, false if one of the inputs was missing
   */
  calc(wires: Map<string, number>) {
    const a = wires.get(this.a);
    const b = wires.get(this.b);
    if (a === undefined || b === undefined) {
      return false;
    }
    switch (this.op) {
      case 'AND':
        wires.set(this.out, a & b);
        break;
      case 'OR':
        wires.set(this.out, a | b);
        break;
      case 'XOR':
        wires.set(this.out, a ^ b);
        break;
    }
    return true;
  }

  isFromX() {
    return this.a.startsWith('x') || this.b.startsWith('x');
  }
  isOutZ() {
    return this.out.startsWith('z');
  }
}

class GraphWire {
  goesTo: GraphGate[] = []; // wire could be input to many gates
  calcFrom: GraphGate | undefined = undefined; // wire is calculated from one gate
  constructor(public name: string, public value: number | undefined) {}

  calc() {
    if (this.value !== undefined) return this.value;
    if (this.calcFrom === undefined) throw new Error('No input gate for wire');
    this.value = this.calcFrom.calc();
    return this.value;
  }
}

class GraphGate {
  constructor(
    public a: GraphWire,
    public op: Operation,
    public b: GraphWire,
    public out: GraphWire
  ) {}

  calc() {
    const a = this.a.calc();
    const b = this.b.calc();
    if (a === undefined || b === undefined)
      throw new Error('Cannot calculate, input not connected to start value');
    switch (this.op) {
      case 'AND':
        return a & b;
      case 'OR':
        return a | b;
      case 'XOR':
        return a ^ b;
    }
  }
}

class Circuit {
  wires: Map<string, number> = new Map();
  gates: Gate[] = [];

  startGraphWires: Map<string, GraphWire> = new Map();
  graphWires: Map<string, GraphWire> = new Map();
  graphGates: GraphGate[] = [];

  get xCount() {
    return Array.from(this.wires.entries()).filter(([name, value]) =>
      name.startsWith('x')
    ).length;
  }

  get xWires() {
    return Array.from(this.graphWires.entries())
      .filter(([name, value]) => name.startsWith('x'))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, value]) => value);
  }

  get yWires() {
    return Array.from(this.graphWires.entries())
      .filter(([name, value]) => name.startsWith('y'))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, value]) => value);
  }

  get zWires(): GraphWire[] {
    return Array.from(this.graphWires.entries())
      .filter(([name, value]) => name.startsWith('z'))
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([_, value]) => value);
  }

  constructor(wires: string[], gates: string[]) {
    wires.forEach((line) => {
      const [name, value] = line.split(': ');
      this.wires.set(name, parseInt(value));
    });
    this.gates = gates.map((line) => {
      const [a, op, b, _, out] = line.split(' ');
      return new Gate(a, op as Operation, b, out);
    });
    this.buildGraph();
  }

  buildGraph() {
    // create graph wires from input
    Array.from(this.wires.entries()).forEach(([name, value]) => {
      const newGraphWire = new GraphWire(name, value);
      this.startGraphWires.set(name, newGraphWire);
      this.graphWires.set(name, newGraphWire);
    });
    // create graph wires from gate outputs
    this.gates.forEach((gate) => {
      this.graphWires.set(gate.out, new GraphWire(gate.out, undefined));
    });
    // create graph gates
    this.graphGates = this.gates.map((gate) => {
      const newGraphGate = new GraphGate(
        this.graphWires.get(gate.a)!,
        gate.op,
        this.graphWires.get(gate.b)!,
        this.graphWires.get(gate.out)!
      );
      this.graphWires.get(gate.a)!.goesTo.push(newGraphGate);
      this.graphWires.get(gate.b)!.goesTo.push(newGraphGate);
      this.graphWires.get(gate.out)!.calcFrom = newGraphGate;
      return newGraphGate;
    });
  }

  calcZWire() {
    this.zWires.forEach((zWire) => {
      zWire.calc();
    });
  }

  getZValuesAsBinary2() {
    return this.zWires.map((wire) => wire.value).join('');
  }

  getWrongGates() {
    const sus = new Set<string>();
    const startXORgates = this.gates.filter(
      (gate) => gate.isFromX() && gate.op == 'XOR'
    );
    for (const gate of startXORgates) {
      const isFirst = gate.a === 'x00';
      if (isFirst) {
        if (gate.out !== 'z00') sus.add(gate.out);
        continue;
      } else if (gate.out == 'z00') sus.add(gate.out);
      if (gate.isOutZ()) sus.add(gate.out);
    }

    const otherXORgates = this.gates.filter(
      (gate) => gate.isFromX() == false && gate.op == 'XOR'
    );
    for (const gate of otherXORgates) {
      if (gate.isOutZ() == false) sus.add(gate.out);
    }

    const outputGates = this.gates.filter((gate) => gate.isOutZ());
    for (const gate of outputGates) {
      const isLast = gate.out === `z${this.xCount.toString().padStart(2, '0')}`;
      if (isLast) {
        if (gate.op !== 'OR') sus.add(gate.out);
      } else if (gate.op !== 'XOR') sus.add(gate.out);
    }

    let checkNext: Gate[] = [];
    for (const gate of startXORgates) {
      if (sus.has(gate.out)) continue;
      if (gate.out === 'z00') continue;
      const matches = otherXORgates.filter(
        (otherGate) => otherGate.a === gate.out || otherGate.b === gate.out
      );
      if (matches.length === 0) {
        checkNext.push(gate);
        sus.add(gate.out);
      }
    }

    for (const gate of checkNext) {
      const intendedResult = `z${gate.a.slice(1)}`;
      const matches = otherXORgates.filter(
        (otherGate) => otherGate.out === intendedResult
      );
      const match = matches[0];
      const toCheck = [match.a, match.b];
      const orMatches = this.gates.filter(
        (gate) => gate.op === 'OR' && toCheck.includes(gate.out)
      );
      const orMatchOutput = orMatches[0].out;
      const correctOutput = toCheck.find((output) => output !== orMatchOutput);
      sus.add(correctOutput!);
    }
    return [...sus].sort((a, b) => a.localeCompare(b)).join(',');
  }
}

export const runs: Run<number | string>[] = [
  { name: 'test', part: 'A', data: 'test', expected: 2024 },
  { name: 'prod', part: 'A', data: 'prod', expected: 59619940979346 },
  //  { name: 'test', part: 'B', data: 'test', expected: 'z00,z01,z02,z05' },
  {
    name: 'prod',
    part: 'B',
    data: 'prod',
    expected: 'bpt,fkp,krj,mfm,ngr,z06,z11,z31',
  },
];
