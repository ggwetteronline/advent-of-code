import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const [rules, partData] = data.join('\n').split('\n\n').map((a) => a.split('\n'));
  const workflows = new Map<string, Workflow>();;
  const parts: Part[] = [];
  // parse input
  for(let line of rules) {
    let [name, conditions, end] = (new RegExp(/([a-z]*)\{(.*),([a-zRA]+)\}/)).exec(line)!.slice(1);
    const ruleSet = conditions.split(',').map((c) => {  
      const [cat, check, count, target] = (new RegExp(/([a-z]*)([<>])(\d*):([a-zRA]*)/)).exec(c)!.slice(1);
      return new Rule(cat as PartCategory, check, Number.parseInt(count), target);
    });
    workflows.set(name, new Workflow(name, ruleSet, end));
  }
  for(let part of partData) {
    let [x,m,a,s] = (new RegExp(/(\d+).+?(\d+).+?(\d+).+?(\d+)/)).exec(part)!.slice(1);
    parts.push({x: Number.parseInt(x), m: Number.parseInt(m), a: Number.parseInt(a), s: Number.parseInt(s)});
  }

  // execute
  if(part === 'A') {
    let sum = 0;
    for(let part of parts) { 
      let next =  workflows.get('in')!.execute(part);
      while(next !== 'R' && next !== 'A') {
        next = workflows.get(next)!.execute(part);
      }
      if(next === 'A') {
        sum += part.x + part.m + part.a + part.s;
      }
    }
    return sum
  }
  if(part === 'B') {
    let acceptRanges: AcceptRanges[] = [new AcceptRanges()];
    acceptRanges = workflows.get('in')!.reduceAcceptRanges(acceptRanges, workflows);
    //console.log('\n\n', 'acceptRanges', acceptRanges.map((a) => a.toString()).join('\n\n'));
    return acceptRanges.reduce((a,b) => a + b.getCombinationCount(), 0);
  }
  return 1;
}

type PartCategory = 'x' | 'm' | 'a' | 's';
class Rule{
  constructor(public category: PartCategory, public condition: string, public count: number,public  target: string) {}
  check(part: Part): boolean {
    switch(this.category) {
      case 'x': return this.checkValue(part.x);
      case 'm': return this.checkValue(part.m);
      case 'a': return this.checkValue(part.a);
      case 's': return this.checkValue(part.s);
    }
  }
  checkValue(value: number): boolean {
    switch(this.condition) {
      case '<': return value < this.count;
      case '>': return value > this.count;
    }
    return false;
  }
  reduceAcceptRange(acceptRange: AcceptRange[]): AcceptRange[] {
    if(this.target == 'R') return this.removeAcceptRange(acceptRange);
    const newAR: AcceptRange[] = [];
    for(let ar of acceptRange) {
      if(this.checkValue(ar.min)) {
        if(this.checkValue(ar.max)) {
          newAR.push(new AcceptRange(ar.min, ar.max));
        } else {
          newAR.push(new AcceptRange(ar.min, this.count - 1));
        }
      } else {
        if(this.checkValue(ar.max)) {
          newAR.push(new AcceptRange(this.count + 1, ar.max));
        } else {
          newAR.push(new AcceptRange(this.count + 1, ar.max));
        }
      }
    }
    return newAR;
  }

  removeAcceptRange(acceptRange: AcceptRange[]): AcceptRange[] {
    // create new ARs outside our match
    const newAR: AcceptRange[] = [];
    for(let ar of acceptRange) {
      if(this.checkValue(ar.min)) {
        if(this.checkValue(ar.max)) {
          // both end are inside, remove 
        } else {
          // min is inside, max is outside
          // target to max is outside
          newAR.push(new AcceptRange(this.count, ar.max));
        }
      } else {
        if(this.checkValue(ar.max)) {
          //min out max in
          newAR.push(new AcceptRange(ar.min, this.count));
        } else {
          // both outside
          newAR.push(new AcceptRange(ar.min, ar.max));
        }
      }
    }
    return newAR;
  }

  toString(): string {
    return `{${this.category} ${this.condition} ${this.count}:${this.target}}`;
  }
}
class Workflow{
  constructor(public name: string, public rules: Rule[], public  end: string) {}

  execute(part: Part) {
    for(let rule of this.rules) {
      if(rule.check(part)) {
        return rule.target;
      }
    }
    return this.end;
  }

  reduceAcceptRanges(acceptRanges: AcceptRanges[], workflows: Map<string, Workflow>): AcceptRanges[] {
    const newAR: AcceptRanges[] = [];
    for(let ar of acceptRanges) {
      const tmpARallRules = ar.clone();
      for(let rule of this.rules) {
        const tmpARsingleRule = tmpARallRules.clone();
        switch(rule.category) {
          case 'x': 
            tmpARsingleRule.x = rule.reduceAcceptRange(tmpARsingleRule.x);
            if(rule.target === 'R') {
              ar.x = tmpARsingleRule.x;
              if(ar.x.length === 0) break;// no valid combination possible
            } 
            if(tmpARsingleRule.x.length > 0) {
              switch(rule.target) {
                case 'A': newAR.push(tmpARsingleRule); break;
                case 'R': // ignore, checked above                
                break;
                default: 
                  // recursion
                  const res = workflows.get(rule.target)!.reduceAcceptRanges([tmpARsingleRule], workflows);
                  if(res.length > 0) {
                    newAR.push(...res);
                  }
              }
            }
            tmpARallRules.x = rule.removeAcceptRange(tmpARallRules.x);
            break;
          case 'm': 
            tmpARsingleRule.m = rule.reduceAcceptRange(tmpARsingleRule.m);
            if(rule.target === 'R') {
              ar.m = tmpARsingleRule.m;
              if(ar.m.length === 0) break;// no valid combination possible
            } 
            if(tmpARsingleRule.m.length > 0) {
              switch(rule.target) {
                case 'A': newAR.push(tmpARsingleRule); break;
                case 'R': // ignore, checked above                
                break;
                default: 
                  // recursion
                  const res = workflows.get(rule.target)!.reduceAcceptRanges([tmpARsingleRule], workflows);
                  if(res.length > 0) {
                    newAR.push(...res);
                  }
              }
            }
            tmpARallRules.m = rule.removeAcceptRange(tmpARallRules.m);
            break;
          case 'a':
            tmpARsingleRule.a = rule.reduceAcceptRange(tmpARsingleRule.a);
            if(rule.target === 'R') {
              ar.a = tmpARsingleRule.a;
              if(ar.a.length === 0) break;// no valid combination possible
            } 
            if(tmpARsingleRule.a.length > 0) {
              switch(rule.target) {
                case 'A': newAR.push(tmpARsingleRule); break;
                case 'R': // ignore, checked above                
                break;
                default: 
                  // recursion
                  const res = workflows.get(rule.target)!.reduceAcceptRanges([tmpARsingleRule], workflows);
                  if(res.length > 0) {
                    newAR.push(...res);
                  }
              }
            }
            tmpARallRules.a = rule.removeAcceptRange(tmpARallRules.a);
            break;
          case 's':
            tmpARsingleRule.s = rule.reduceAcceptRange(tmpARsingleRule.s);
            if(rule.target === 'R') {
              ar.s = tmpARsingleRule.s;
              if(ar.s.length === 0) break;// no valid combination possible
            } 
            if(tmpARsingleRule.s.length > 0) {
              switch(rule.target) {
                case 'A': newAR.push(tmpARsingleRule); break;
                case 'R': // ignore, checked above                
                break;
                default: 
                  // recursion
                  const res = workflows.get(rule.target)!.reduceAcceptRanges([tmpARsingleRule], workflows);
                  if(res.length > 0) {
                    newAR.push(...res);
                  }
              }
            }
            tmpARallRules.s = rule.removeAcceptRange(tmpARallRules.s);
            break;
        }
      }
      // rest to target
      switch(this.end) {
        case 'A': newAR.push(tmpARallRules); break;
        case 'R': // this is the end, no add           
        break;
        default: 
          // recursion
          const res = workflows.get(this.end)!.reduceAcceptRanges([tmpARallRules], workflows);
          if(res.length > 0) {
            newAR.push(...res);
          }
      }
    }
    return newAR;
  }

  toString(): string {
    return `${this.name}: ${this.rules.join(', ')} => ${this.end}`;
  }
}
type Part = {
  x:number, m:number, a:number, s:number
}

class AcceptRanges {
  x: AcceptRange[] = [];
  m: AcceptRange[] = [];
  a: AcceptRange[] = [];
  s: AcceptRange[] = [];
  constructor(){
    this.x.push(new AcceptRange(1,4000));
    this.m.push(new AcceptRange(1,4000));
    this.a.push(new AcceptRange(1,4000));
    this.s.push(new AcceptRange(1,4000));
  }

  getCombinationCount(): number {
    const sumX = this.x.reduce((a,b) => a + b.getCombinationCount(), 0);
    const sumM = this.m.reduce((a,b) => a + b.getCombinationCount(), 0);
    const sumA = this.a.reduce((a,b) => a + b.getCombinationCount(), 0);
    const sumS = this.s.reduce((a,b) => a + b.getCombinationCount(), 0);
    return sumX * sumM * sumA * sumS;
  }

  clone():AcceptRanges {
    const ret = new AcceptRanges();
    ret.x = this.x.map((a) => a.clone());
    ret.m = this.m.map((a) => a.clone());
    ret.a = this.a.map((a) => a.clone());
    ret.s = this.s.map((a) => a.clone());
    return ret;
  }

  toString(): string {
    return `x: ${this.x.join(', ')}\nm: ${this.m.join(', ')}\na: ${this.a.join(', ')}\ns: ${this.s.join(', ')}`;
  }
}
class AcceptRange {
  constructor(public min: number, public max: number) {}

  getCombinationCount(): number {
    return this.max - this.min + 1;
  }
  clone():AcceptRange {
    return new AcceptRange(this.min, this.max);
  }
  toString(): string {
    return `${this.min}-${this.max}`;
  }
}

// execute and output
console.log('Test aim: 19114 | 167409079868000');
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 425811
// B: 131796824371749