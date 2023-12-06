import { lib } from '../lib';

const path = require('path');

// define types
type MRange = { start: number, range: number };
type Source2Dest = { source: number, destination: number, range: number };

// function logic
function solve(data: string[], part: 'A' | 'B') {
  // data
  let seeds: number[] | undefined = undefined;
  let seedsRange: MRange[] = [];
  
  const seedToSoil: Source2Dest[] = [];
  const soil2ferti: Source2Dest[] = [];
  const ferti2water: Source2Dest[] = [];
  const water2light: Source2Dest[] = [];
  const light2temperature: Source2Dest[] = [];
  const temperature2humidity: Source2Dest[] = [];
  const humidity2location: Source2Dest[] = [];
  // this is a pointer on one of the above arrays
  let curMap: Source2Dest[] | undefined = undefined;

  // parse data
  for (let line of data) {
    // seeds are undefined, when we are in first line
    if (seeds == undefined) {
      seeds = lib.getNums(line.split(': ')[1])
      if(part == 'B') {
        for (let i = 0; i < seeds.length - 1;  i+=2) {
          seedsRange.push({ start: seeds[i], range: seeds[i + 1] });
        }
      }
    } else if (line.length == 0) {
      // empty line: end of map
      curMap = undefined;
    } else if (line == 'seed-to-soil map:') {
      curMap = seedToSoil;
    } else if (line == 'soil-to-fertilizer map:') {
      curMap = soil2ferti;
    } else if (line == 'fertilizer-to-water map:') {
      curMap = ferti2water;
    } else if (line == 'water-to-light map:') {
      curMap = water2light;
    } else if (line == 'light-to-temperature map:') {
      curMap = light2temperature;
    } else if (line == 'temperature-to-humidity map:') {
      curMap = temperature2humidity;
    } else if (line == 'humidity-to-location map:') {
      curMap = humidity2location;
    } else if (curMap != undefined) {
      const [destination, source, range] = line.split(' ').map(e => Number.parseInt(e));
      curMap.push({ source: source, destination: destination, range: range });
    }
  }

  // calculation
  const locations: number[] = []
  if (seeds != undefined) {
    if(part == 'A') {
      for (let seed of seeds) {
        const soil = getDestination(seed, seedToSoil);    
        const ferti = getDestination(soil, soil2ferti);
        const water = getDestination(ferti, ferti2water);
        const light = getDestination(water, water2light);
        const temperature = getDestination(light, light2temperature);
        const humidi = getDestination(temperature, temperature2humidity);
        const location = getDestination(humidi, humidity2location);
        locations.push(location);
      }
    } else {
      for (let seed of seedsRange) {
        const soil = getDestinations(seed, seedToSoil);    
        const ferti = getDestinations2(soil, soil2ferti);
        const water = getDestinations2(ferti, ferti2water);
        const light = getDestinations2(water, water2light);
        const temperature = getDestinations2(light, light2temperature);
        const humidi = getDestinations2(temperature, temperature2humidity);
        const location = getDestinations2(humidi, humidity2location);
        // we only need lowest destination, which is lowest start of destination ranges
        locations.push(Math.min(...location.map(l => l.start)));
      }
    }
  }
  return Math.min(...locations);
}

// help functions 
function getDestination(source: number, map: Source2Dest[]): number {
  for (let entry of map) {
    if (source >= entry.source && source < entry.source + entry.range) {
      return entry.destination + ((source - entry.source));
    }
  }
  return source;
}

function getDestinations(source: MRange, map: Source2Dest[]): MRange[] {
  const temp: MRange[] = [];
  for (let i = source.start; i < source.start + source.range; ++i) {
    const temp2 = getSubDestinations(i, source, map);
    i = temp2.next;
    temp.push(temp2.n);
    source.start = i + 1;
    source.range = source.range - temp2.n.range;
  }
  return temp;
}
function getDestinations2(sourceList: MRange[], map: Source2Dest[]): MRange[] {
  const temp: MRange[] = [];
  for (let source of sourceList) {
    temp.push(...getDestinations(source, map));
  }
  return temp;
}


function getSubDestinations(i: number, source: MRange, map: Source2Dest[]): { n: MRange, next: number } {
  for (let entry of map) {
    if (i >= entry.source && i < entry.source + entry.range) {
      let newStart = entry.destination + ((i - entry.source));
      let range = 0
      if (source.range <= (entry.destination + entry.range - newStart)) {
        // wenn alle rein pasen
        range = (source.range - (i - source.start));
      } else {
        //wenn nicht alle rein passen
        range = (entry.destination + entry.range - newStart) - (i - source.start);
      }

      //const range = (i - source.start) < entry.range ? 
      const temp2 = { start: newStart, range: range };
      i += temp2.range - 1;
      return { n: temp2, next: i };
    }
  }
  // Problem: Wenn sehr oft die range 1 ist, stattdessen eine range für die nächste lücke suchen. 
  // dh. alle mit source größer i, davon das kleinste und bis dahin die range
  const tempMap = map.filter(m => m.source > i);
  if(tempMap.length > 0) {
    const minStart = Math.min(...tempMap.map(t => t.source));
    return { n: { start: i, range: minStart-i }, next: minStart-1 };
  } else {
    // Sonderfall 2: über i gibt es keine Range mehr die beginnt
    return { n: { start: i, range: source.range }, next: i+source.range-1 };
  }
}


// read data
const scriptName = path.basename(__filename);
const dataTest = lib.readData('2023', scriptName, false);
const data = lib.readData('2023', scriptName, true);
// execute and output
const runTest = true, runProd = true, runA = true, runB = true;
lib.execute(dataTest, data, runTest, runProd, runA, runB, solve);

// A: 1181555926
// B: 37806486







