import { lib } from '../lib';

const path = require('path');


class GraphNode {
  L?: GraphNode;
  R?: GraphNode;
  constructor(public from: string, public Ltext: string, public Rtext: string) {}
}
type Direction = 'L'|'R';

// function logic
function run(data: string[], part: 'A' | 'B') {
  // parse data
  const [rawRoute, , ...rawFromTo] = data;
  const route = rawRoute.split('') as Direction[];
  const fromTo = rawFromTo.reduce((map, line) => {
    const [start, L, R] = lib.getAll(line, new RegExp(/([A-Z|1-9]{3})/, 'g')) as [string, string, string];
    map.set(start, new GraphNode(start, L, R));
    return map;
  },new Map<string, GraphNode>);
  // Link nodes with each other
  fromTo.forEach(node => {
    node.L = fromTo.get(node.Ltext);
    node.R = fromTo.get(node.Rtext);
  })
  // start and end
  const startingNodes = part === 'A' ? [fromTo.get('AAA')!] : [...fromTo].filter(([name, node]) => name.endsWith('A')).map(([name, node]) => node);
  const endCondition = part === 'A' ? (node: GraphNode) => node.from === 'ZZZ': (node: GraphNode) => node.from.endsWith('Z');

  // every endNode is reached in route.length * x steps, where route.length and x are prime numbers.
  // after an end node, the next node is the same like the first after the start, so you run in circles
  // you need y * route.length * x steps to reach the y-nth end node for this start node. 
  // to determine how often you have to run in circles, use the smallest common multiplier
  return kgv(
    startingNodes.map((startingNode) =>
      stepsToGo(startingNode, route, endCondition)
    ),
  );
}

function stepsToGo (
  fromNode: GraphNode,
  route: Direction[],
  until: (n: GraphNode) => boolean,
): number {
  let step = 0;
  let currentNode = fromNode;
  while (until(currentNode) == false) {
    const direction = route[step % route.length];
    currentNode = direction === 'L' ? currentNode.L! : currentNode.R!;
    step++;
  }
  return step;
};

/**
 * Kleinstes gemeinsames Vielfaches
 */
function kgv(numbers: number[]) {
  function gcd(a:number, b:number):number {
    return !b ? a : gcd(b, a % b);
  }
  function lcm(a:number, b:number):number {
    return (a * b) / gcd(a, b);
  }
  var result = numbers[0];
  for (var i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }
  return result;
}

// execute and output
console.log('Test aim: 6');
const runTest = false, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 24253
// B: 12357789728873
/* steps to go: 
24253
21797
14429
16271
20569
13201
*/