import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  // parse input
  const [modules, beforeRX] = loadModules(data);

  if(part == 'A') {
    let lowPulseCount = 0, highPulseCount = 0;
    for(let i = 1; i <= 1000; i++) {
      // initial impulse button low-> broadcaster
      let pulses: Pulse[] = [{source: 'button', type: 'low', destination: 'broadcaster'}];
      // run through pulses
      while(pulses.length > 0) {
        const newPulses: Pulse[] = [];
        for(let pulse of pulses) {
          if(pulse.type == 'low') ++lowPulseCount;
          else ++highPulseCount;
          const module = modules.get(pulse.destination);
          if(module)
            newPulses.push(...module.handlePulse(pulse));
        }
        // set input for next round
        pulses = newPulses;
      }
    }
    return lowPulseCount * highPulseCount;
  }
  
  if(part == 'B') {
    // preperation Part B
    // we check how long we need to match each precondition and multiply partial solutions
    if(beforeRX === undefined) throw new Error('No beforeRX');
    const beforeRXfirstHighs: number[] = [...beforeRX.lastInputs.entries()].map(() => -1);
    for(let buttonPressedCount = 1; buttonPressedCount <= 5000; buttonPressedCount++) {
      // initial impulse button low-> broadcaster
      let pulses: Pulse[] = [{source: 'button', type: 'low', destination: 'broadcaster'}];
      // run through pulses
      while(pulses.length > 0) {
        const newPulses: Pulse[] = [];
        for(let pulse of pulses) {
          const module = modules.get(pulse.destination);
          if(module)
            newPulses.push(...module.handlePulse(pulse));
          // check if we have a solution
          if(pulse.destination == beforeRX.name && (module as ConjunctionModule).highCount() > 0) {
            [...beforeRX.lastInputs.entries()].map(([k, v], index) => {
              if(v == 'high' && beforeRXfirstHighs[index] == -1) 
                beforeRXfirstHighs[index] = buttonPressedCount;
            });
            // do we have all partial solutions?
            if(beforeRXfirstHighs.every(v => v != -1)) {
              return beforeRXfirstHighs.reduce((a, b) => a * b);
            }
          }
        }
        // set input for next round
        pulses = newPulses;
      }
    }
  }
}

function loadModules(data: string[]) {
  const modules = new Map<string, Module>();
  for(let line of data) {
    const [mod, dest] = line.split(' -> ');
    if(mod == 'broadcaster') {
      modules.set('broadcaster', new BroadcastModule('broadcaster', dest.split(', ')));
    } else if(mod[0] == '%') {
      modules.set(mod.substring(1), new FlipFlopModule(mod.substring(1), dest.split(', ')));
    } else if(mod[0] == '&') {
      modules.set(mod.substring(1),new ConjunctionModule(mod.substring(1), dest.split(', ')));
    }      
  }

  // set conjunction inputs 
  let beforeRX: ConjunctionModule | undefined = undefined;
  for(let [k, v] of modules.entries() ){
    for(const dest of v.destinations) {
      if(modules.has(dest) && modules.get(dest) instanceof ConjunctionModule) {
        (modules.get(dest) as ConjunctionModule).addInput(k);
      }
      if(v.destinations.includes('rx')) beforeRX = v as ConjunctionModule;
    }
  }
  return [modules, beforeRX] as const;
}

type Signal = 'low' | 'high';
type Pulse = {type: Signal, source: string, destination: string};

abstract class Module {
  constructor(public name: string, public destinations: string[]) {}
  abstract handlePulse(pulse: Pulse): Pulse[];
  toString(){
    return this.name + ' -> ' + this.destinations.join(', ');
  }
}

class FlipFlopModule extends Module {
  isOn = false;
  constructor(public name: string, public destinations: string[]) {
    super(name, destinations);
  }
  handlePulse(pulse: Pulse): Pulse[] {
    if(pulse.type == 'high') return [];
    this.isOn = !this.isOn;
    return this.destinations.map(d => ({
      type: this.isOn ? 'high' : 'low', 
      source: this.name, 
      destination: d,
    }));
  }
}

class ConjunctionModule extends Module {
  lastInputs = new Map<string, Signal>();
  constructor(public name: string, public destinations: string[]) {
    super(name, destinations);
  }
  addInput(input: string) {
    this.lastInputs.set(input, 'low');
  }

  handlePulse(pulse: Pulse): Pulse[] {
    this.lastInputs.set(pulse.source, pulse.type);
    for(let [k, v] of this.lastInputs) {
      if(v == 'low') {
        return this.destinations.map(d => ({type: 'high',source: this.name,  destination: d}));
      }
    }
    return this.destinations.map(d => ({type: 'low', source: this.name, destination: d}));
  }

  toString(): string {
    return this.name + ' -> ' + this.destinations.join(', ') + ' ' + [...this.lastInputs.entries()].map(([k, v]) => k + ': ' + v).join(', ');
  }

  highCount(){
    let count = 0;
    for(let [k, v] of this.lastInputs) {
      if(v == 'high') ++count;
    }
    return count;
  }
}

class BroadcastModule extends Module {
  constructor(public name: string, public destinations: string[]) {
    super(name, destinations);
  }
  handlePulse(pulse: Pulse): Pulse[] {
    return this.destinations.map(d => ({type: pulse.type, source: this.name, destination: d}));
  }
}

// execute and output
console.log('Test aim: 32000000');
// test for B does not work, because we have no rx in test data
const runTest = false, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 856482136
// B: 224046542165867
