import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export interface Run {
  name: string;
  data: 'prod' | 'test' | string[];
  part: 'A' | 'B';
  expected?: number;
}

export class lib {
  static readData(year: string, filepath: string, liveData: boolean): string[] {
    const file = path
      .basename(filepath)
      .replace('.ts', liveData ? '-data.txt' : '-data_test.txt');
    return fs
      .readFileSync(path.join(year, 'data', file), 'utf-8')
      .split(/\r?\n/);
  }

  static getNums(input: string): number[] {
    return input
      .split(' ')
      .map((a) => Number.parseInt(a))
      .filter((a) => !isNaN(a));
  }

  static getAll<T>(input: string, regexp: RegExp, single: boolean = true): T[] {
    const ret: T[] = [];
    let reg: RegExpExecArray | null;
    while ((reg = regexp.exec(input)) != null) {
      ret.push((single ? reg[1] : reg.slice(1)) as T);
    }
    return ret;
  }

  static execute(
    filepath: string,
    runTest: boolean,
    runProd: boolean,
    runA: boolean,
    runB: boolean,
    solveFun: (data: string[], part: 'A' | 'B') => any
  ) {
    console.warn('Deprecated! Use execute2 instead');
    const dataTest = lib.readData('2023', filepath, false);
    const data = lib.readData('2023', filepath, true);
    if (runA) {
      if (runTest) console.log('Test A: ', solveFun(dataTest, 'A'));
      if (runTest && runProd) console.log('-');
      if (runProd) console.log('Prod A: ', solveFun(data, 'A'));
    }
    if (runA && runB) {
      console.log('-');
      console.log('------------------------');
      console.log('-');
    }
    if (runB) {
      if (runTest) console.log('Test B: ', solveFun(dataTest, 'B'));
      if (runTest && runProd) console.log('-');
      if (runProd) console.log('Prod B: ', solveFun(data, 'B'));
    }
  }

  static async execute2(
    year: string,
    filename: string,
    solveFun: (data: string[], part: 'A' | 'B') => number | Promise<number>,
    runs: Run[]
  ): Promise<void> {
    const dataTest = lib.readData(year, filename, false);
    const dataProd = lib.readData(year, filename, true);
    for (const run of runs) {
      const data =
        run.data === 'prod'
          ? dataProd
          : run.data === 'test'
          ? dataTest
          : run.data;
      const result = await solveFun(data, run.part);
      console.log(
        `${run.name} ${run.part}: `,
        run.expected === result
          ? chalk.green(`${result} ✅`)
          : chalk.red(`${result} ❌`)
      );
    }
  }

  static time(): string {
    return new Date().toLocaleDateString();
  }
}
