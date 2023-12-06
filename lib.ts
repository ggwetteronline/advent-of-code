const fs = require('fs');
const path = require('path');

export class lib {
  static readData(year: string, file: string, liveData:boolean): string[] {
    file = file.replace('.ts', liveData ? '-data.txt' : '-data_test.txt');
    return fs.readFileSync(path.join(year,file), 'utf-8').split(/\r?\n/) as string[];
  }

  static getNums(input: string): number[] {
    return input.split(' ').map(a => Number.parseInt(a)).filter(a => !isNaN(a));
  }

  static execute(dataTest: any, data: any, runTest: boolean, runProd: boolean, runA: boolean, runB: boolean, solveFun: (data: string[],part: 'A' | 'B' )=>any) { 
    if(runA) {
      if(runTest) console.log('Test A: ', solveFun(dataTest, 'A'));
      if(runTest && runProd) console.log('-');
      if(runProd) console.log('Prod A: ', solveFun(data, 'A'));
    }
    if(runA && runB) {
      console.log('-');
      console.log('------------------------');
      console.log('-');
    }
    if(runB) {
      if(runTest) console.log('Test B: ', solveFun(dataTest, 'B'));
      if(runTest && runProd) console.log('-');
      if(runProd) console.log('Prod B: ', solveFun(data, 'B'));
    }
  }
}