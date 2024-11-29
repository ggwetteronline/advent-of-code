var parallel = require('run-parallel')
import { lib } from '../lib';

type Spring = '.' | '#' | '?';
/*
. => working
# => damaged
? => dont know
*/
class Row{
  counter = 0;
  regex: RegExp;
  cache: Map<string, number> = new Map();
  constructor(public signs: Spring[], public nums: number[]) {
    this.regex = this.buildRegex(nums);
  }

  buildRegex(nums: number[]){
    const reg = '^[?|.]*' + nums.map(num => "([?|#]{"+num+"})").join('[?|.]+?')+'[.|?]*$';
    return new RegExp(reg, '');
  }

  calculateArrangements(){
    // Baue nur Gruppen, die dem RegExp entsprechen
    this.counter = this.buildWithRegex(this.signs, 0, 0);
  }

  checkDepth(remainingSprings: Spring[], remainingConditions: number[]): number {
    if(this.buildRegex(remainingConditions).test(remainingSprings.join('')) == false) return 0;
    if(remainingConditions.length == 0) return 1;
    if(remainingSprings.length == 0) return 0;
    
    // we do not care about working Springs, so run through them
    while(remainingSprings.length > 0 && remainingSprings[0] == '.') remainingSprings.shift();
    // if we are at the end, we are done (we checked regex before)
    if(remainingSprings.length == 0) return 1; //this should never happen

    const cacheKey = remainingSprings.join('') + remainingConditions.join(',');
    const cachedResult = this.cache.get(cacheKey);
    if(cachedResult != undefined) return cachedResult; //no need to calculate this again

    if(remainingSprings[0] == '#') {
      if(this.canPlaceDamaged2(remainingSprings, remainingConditions[0]) == false) {
        this.cache.set(cacheKey, 0);
        return 0;
      } else {
        // place damaged and call recursion
        const copy = remainingSprings.slice(remainingConditions[0]);
        if(copy.length == 0) {
          // we are at the end, so we are done
          this.cache.set(cacheKey, 1);
          return 1;
        }
        // next sign must be a working spring
        if(copy[0] == '#') {
          this.cache.set(cacheKey, 0); 
          return 0;
        }
        // call recursion and save result in cache
        const result = this.checkDepth(copy.slice(1), remainingConditions.slice(1));
        this.cache.set(cacheKey, result);
        return result;
      }
    } else {
      // current sign is ?
      if(this.canPlaceDamaged2(remainingSprings, remainingConditions[0]) == false) {
        // we can not place damaged, so we place working
        // call recursion
        const result = this.checkDepth(remainingSprings.slice(1), remainingConditions);
        this.cache.set(cacheKey, result);
        return result;
      } else {
        // we can add damaged, but we do not must
        // so we split in both scenarios, do it and dont do it
        const copyWorking = remainingSprings.slice(1);
        const copyDamaged = remainingSprings.slice(remainingConditions[0]);
        if(copyDamaged.length == 0) {
          // we are at the end, so we are done (in copyWorking would be no place to fit the next condition)
          this.cache.set(cacheKey, 1);
          return 1;
        }
        // next sign must be a working spring
        if(copyDamaged[0] == '#') {
          // if not, continue with working
          const result = this.checkDepth(copyWorking, remainingConditions);
          this.cache.set(cacheKey, result);
          return result;
        }
        // call recursion
        const result = this.checkDepth(copyWorking, remainingConditions) +
          this.checkDepth(copyDamaged.slice(1), remainingConditions.slice(1));
          this.cache.set(cacheKey, result); 
        return result;
      }
    }
  }

  canPlaceDamaged2(springs: Spring[], damaged: number): boolean {
    // check if we can place the damaged springs
    for(let i = 0; i < damaged; ++i) {
      if(springs[i] == '.') return false;
    }
    return true;
  }
  placeDamaged2(springs: Spring[], damaged: number): Spring[] {
    //const lineCopy = springs.join('').split('') as Spring[];
    return springs.slice(damaged);
  }

  buildWithRegex(line: Spring[], lineIndex: number, numsIndex: number): number{
    if(this.regex.test(line.join('')) == false) return 0;
    //console.log(line.join(''));
    if(lineIndex == line.length) return 1;
    if(numsIndex == this.nums.length) return 1;
    // we do not care about working Springs, so run through them
    while(line[lineIndex] == '.' && lineIndex < line.length) lineIndex++;
    // if we are at the end, we are done (we checked regex before)
    if(lineIndex == line.length) return 1;
    // current sign is # or ? 
    if(line[lineIndex] == '#') {
      // if spring is broken, we have to apply the current condition
      if(this.canPlaceDamaged(line, lineIndex, this.nums[numsIndex]) == false) {
        return 0;
      } else {
        // place damaged and call recursion
        const copy = this.placeDamaged(line, lineIndex, this.nums[numsIndex]);
        lineIndex += this.nums[numsIndex];
        if(lineIndex == line.length) {
          // we are at the end, so we are done
          return 1;
        }
        // next sign must be a working spring
        if(line[lineIndex] == '#') return 0;
        line[lineIndex] == '.';
        lineIndex++;
        // call recursion
        return this.buildWithRegex(copy, lineIndex, numsIndex+1);
      }
    } else {
      // current sign is ?
      if(this.canPlaceDamaged(line, lineIndex, this.nums[numsIndex]) == false) {
        // we can not place damaged, so we place working
        const copy = line.join('').split('') as Spring[];
        copy[lineIndex] = '.';
        lineIndex++;
        // call recursion
        return this.buildWithRegex(copy, lineIndex, numsIndex);
      } else {
        // we can add damaged, but we do not must
        // so we split in both scenarios, do it and dont do it
        const copyWorking = line.join('').split('') as Spring[];
        copyWorking[lineIndex] = '.';
        const copyDamaged = this.placeDamaged(line, lineIndex, this.nums[numsIndex]);
        let damagedLineIndex = lineIndex + this.nums[numsIndex];
        if(damagedLineIndex == line.length) {
          // we are at the end, so we are done
          return 1;
        }
        // next sign must be a working spring
        if(copyDamaged[damagedLineIndex] == '#') {
          // if not, continue with working
          return this.buildWithRegex(copyWorking, lineIndex+1, numsIndex);
        }
        copyDamaged[damagedLineIndex] = '.';
        damagedLineIndex++;
        // call recursion
        return this.buildWithRegex(copyWorking, lineIndex+1, numsIndex) +
          this.buildWithRegex(copyDamaged, damagedLineIndex, numsIndex+1)
        ;
      }
    }
  }

  canPlaceDamaged(line: Spring[], lineIndex: number, damaged: number): boolean {
    // check if we can place the damaged springs
    for(let i = lineIndex; i < lineIndex + damaged; ++i) {
      if(line[i] == '.') return false;
    }
    return true;
  }
  placeDamaged(line: Spring[], lineIndex: number, damaged: number): Spring[] {
    const lineCopy = line.join('').split('') as Spring[];
    for(let i = lineIndex; i < lineIndex + damaged; ++i) {
      lineCopy[i] = '#';
    }
    return lineCopy;
  }
}


// function logic
function run(data: string[], part: 'A' | 'B') {
  const rows: Row[] = [];
  for(let line of data) {
    let [signs, conditions] = line.split(' ');
    if(part == 'B') {
      signs = [signs,signs,signs,signs,signs].join('?');
      conditions = [conditions,conditions,conditions,conditions,conditions].join(',');
    }
    rows.push(new Row(signs.split('') as Spring[], conditions.split(',').map(d => +d)));
  }

  let sum = 0;
  let counter = 0;
  
  for(let i = 0; i < rows.length; ++i) {
    const startTime = new Date();
    let row = rows[i];
    console.log(i, row.signs.count('?'), row.nums.length, startTime.toLocaleTimeString());
    //row.calculateArrangements();

    const [currentCriteria, ...remainingCriteria] = row.nums;
    if (!currentCriteria) {
      throw new Error('no criteria for line');
    }
    row.counter = calculateVariations({
      currentCriteria,
      currentOriginalCriteria: currentCriteria,
      rebuiltLog: '',
      remainingCriteria,
      remainingDamagedLog: row.signs.join(''),
    });



    sum += row.counter;
    console.log(sum, row.counter, (new Date().getTime() - startTime.getTime()) / 1000);
  }

  return sum;
}
interface State {
	rebuiltLog: string;
	currentCriteria: number;
	currentOriginalCriteria: number;
	remainingDamagedLog: string;
	remainingCriteria: number[];
}

function calculateVariations (
	state: State,
	cache: Map<string, number> = new Map(),
): number {
	const key =
		state.remainingCriteria.join(',') +
		';' +
		state.remainingDamagedLog +
		';' +
		state.currentOriginalCriteria +
		';' +
		state.currentCriteria;

	const cachedResult = cache.get(key);
	if (cachedResult !== undefined) {
		return cachedResult;
	}

	let result = cachedResult ?? 0;

	while (state.currentCriteria > 0 && state.remainingDamagedLog.startsWith('#')) {
		state.currentCriteria = state.currentCriteria - 1;
		state.remainingDamagedLog = state.remainingDamagedLog.slice(1);
		state.rebuiltLog = state.rebuiltLog + '#';
	}

	if (
		state.currentCriteria === 0 &&
		state.remainingCriteria.length === 0 &&
		!state.remainingDamagedLog.includes('#')
	) {
		state.rebuiltLog += state.remainingDamagedLog.replaceAll('?', '.');
		return 1;
	}

	while (
		state.currentCriteria === state.currentOriginalCriteria &&
		state.remainingDamagedLog.startsWith('.')
	) {
		state.remainingDamagedLog = state.remainingDamagedLog.slice(1);
		state.rebuiltLog = state.rebuiltLog + '.';
	}

	if (state.currentCriteria > 0 && state.remainingDamagedLog.startsWith('.')) {
		return 0;
	}

	if (state.currentCriteria === 0 && state.remainingDamagedLog.startsWith('#')) {
		return 0;
	}

	if (
		state.currentCriteria === 0 &&
		(state.remainingDamagedLog.startsWith('.') || state.remainingDamagedLog.startsWith('?'))
	) {
		const nextCriteria = state.remainingCriteria.shift();

		if (nextCriteria === undefined) {
			state.currentOriginalCriteria = 0;
		} else {
			state.currentCriteria = nextCriteria;
			state.currentOriginalCriteria = nextCriteria;
		}

		state.rebuiltLog = state.rebuiltLog + '.';
		state.remainingDamagedLog = state.remainingDamagedLog.slice(1);
	}

	while (
		state.currentCriteria === state.currentOriginalCriteria &&
		state.remainingDamagedLog.startsWith('.')
	) {
		state.remainingDamagedLog = state.remainingDamagedLog.slice(1);
		state.rebuiltLog = state.rebuiltLog + '.';
	}

	if (
		state.currentCriteria === 0 &&
		state.remainingDamagedLog.length === 0 &&
		state.remainingCriteria.length === 0
	) {
		return 1;
	}

	if (state.remainingDamagedLog.startsWith('?')) {
		result += calculateVariations(
			{
				...state,
				remainingCriteria: [...state.remainingCriteria],
				remainingDamagedLog: '#' + state.remainingDamagedLog.slice(1),
			},
			cache,
		);

		result += calculateVariations(
			{
				...state,
				remainingCriteria: [...state.remainingCriteria],
				remainingDamagedLog: '.' + state.remainingDamagedLog.slice(1),
			},
			cache,
		);
	} else if (state.currentCriteria > 0 && state.remainingDamagedLog.length > 0) {
		result += calculateVariations(state, cache);
	}
	cache.set(key, result);
	return result;
};


// execute and output
console.log('Test aim: 12345');
const runTest = true, runProd = true, runA = false, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 8022
// B: 4968620679637