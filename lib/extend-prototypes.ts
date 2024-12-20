export {};

declare global {
  interface String {
    // items
    hasIndex(index: number): boolean;
    centerIndex(): number;
    splitAt(index: number): [string, string];

    // editing
    replaceAt(index: number, replacement: string): string;

    // calculations
    countChar(needle: string): number;
    charToNumber(): number;
    getCommonLetter(others: string | string[]): string;
  }

  interface Array<T> {
    // items
    getLast(): T;
    hasIndex(index: number): boolean;
    hasIndex2D(row: number, col: number): boolean;
    centerIndex(): number;
    centerItem(): T;

    // reordering
    transpose(): Array<T>;
    toGroupsOf(size: number): Array<T>[];
    groupBy<S>(a: (element: T) => S): Array<T>[];
    splitByEmptyLine(): Array<T[]>;

    // checks
    isDescending(): boolean;
    isAscending(): boolean;
    includesAll(needles: T[]): boolean;
    equals(other: T[]): boolean;

    // calculations
    sum(add?: (a: T) => number): number;
    count(needle: string): number;
    toFieldString(): string;
    mapPairs<U>(callback: (a: T, b: T) => U): U[];
    mapRecursiveWithMemory<U>(
      callback: (recursion: (...args2: any[]) => U, ...args: any[]) => U,
      keyfun?: (...args: any[]) => string,
      ...args: any[]
    ): U[];
  }

  interface Number {
    diffTo(other: number): number;
    between(min: number, max: number): boolean;
    numberOfDigits(): number;
  }
}

String.prototype.hasIndex = function (index: number): boolean {
  return index >= 0 && index < this.length;
};
String.prototype.centerIndex = function (): number {
  return Math.floor(this.length / 2);
};
String.prototype.splitAt = function (index: number): [string, string] {
  return [this.substring(0, index), this.substring(index)];
};
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};
String.prototype.countChar = function (needle: String): number {
  return this.split('').filter((char) => char == needle).length;
};
String.prototype.charToNumber = function (): number {
  const charCode = this.charCodeAt(0);
  if (charCode >= 97 && charCode <= 122) {
    // Kleinbuchstaben a-z
    return charCode - 96;
  } else if (charCode >= 65 && charCode <= 90) {
    // Großbuchstaben A-Z
    return charCode - 64 + 26;
  }
  throw new Error('Ungültiger Buchstabe');
};
String.prototype.getCommonLetter = function (
  others: string | string[]
): string {
  const set1 = new Set(this);
  const sets = [set1];
  if (typeof others === 'string') {
    sets.push(new Set(others));
  } else {
    others.forEach((other) => sets.push(new Set(other)));
  }

  for (const char of set1) {
    if (sets.every((set) => set.has(char))) {
      return char;
    }
  }
  throw new Error('Kein gemeinsamer Buchstabe gefunden');
};

Array.prototype.getLast = function () {
  return this[this.length - 1];
};
Array.prototype.hasIndex = function (index: number) {
  return index >= 0 && index < this.length;
};
Array.prototype.hasIndex2D = function (y_row: number, x_col: number): boolean {
  return (
    y_row >= 0 &&
    y_row < this.length &&
    x_col >= 0 &&
    x_col < this[y_row].length
  );
};
Array.prototype.centerIndex = function (): number {
  return Math.floor(this.length / 2);
};
Array.prototype.centerItem = function () {
  return this[this.centerIndex()];
};

Array.prototype.transpose = function () {
  if (typeof this[0] === 'string') {
    return this[0]
      .split('')
      .map((_: any, colIndex: number) =>
        this.map((row) => row[colIndex]).join('')
      );
  } else {
    return this[0].map((_: any, colIndex: number) =>
      this.map((row) => row[colIndex])
    );
  }
};
Array.prototype.toGroupsOf = function <T>(size: number): Array<T>[] {
  const ret: Array<T>[] = [];
  for (let i = 0; i < this.length; i += size) {
    ret.push(this.slice(i, i + size));
  }
  return ret;
};
Array.prototype.groupBy = function <T, S>(
  getKey: (element: T) => S
): Array<T>[] {
  const ret: Array<T>[] = [];
  const map = new Map<S, T[]>();
  for (const element of this) {
    const key = getKey(element);
    if (map.has(key)) map.get(key)!.push(element);
    else map.set(key, [element]);
  }
  map.forEach((value) => ret.push(value));
  return ret;
};
Array.prototype.splitByEmptyLine = function (): Array<string[]> {
  const ret: string[][] = [];
  let curr: string[] = [];
  for (const line of this) {
    if (line === '') {
      ret.push(curr);
      curr = [];
    } else {
      curr.push(line);
    }
  }
  ret.push(curr);
  return ret;
};

Array.prototype.isDescending = function () {
  for (let i = 1; i < this.length; i++) {
    if (this[i] > this[i - 1]) {
      return false;
    }
  }
  return true;
};
Array.prototype.isAscending = function () {
  for (let i = 1; i < this.length; i++) {
    if (this[i] < this[i - 1]) {
      return false;
    }
  }
  return true;
};
Array.prototype.includesAll = function <T>(needles: T[]): boolean {
  return needles.every((needle) => this.includes(needle));
};
/**
 * Compares two arrays. If the array contains objects, it will use the equals function of the objects.
 * @other the array to compare to
 * @returns true if the arrays are equal, false otherwise
 */
Array.prototype.equals = function (other: any[]): boolean {
  if (this.length !== other.length) return false;
  const hasEquals = this[0].equals;
  // use equals function if available
  if (hasEquals) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].equals(other[i]) == false) return false;
    }
  } else {
    // otherwise use normal comparison (for numbers, strings, ...)
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== other[i]) return false;
    }
  }
  return true;
};

Array.prototype.sum = function <T>(add: (a: T) => number = (a) => +a): number {
  return this.reduce((a, b) => a + add(b), 0);
};
Array.prototype.count = function (needle: String): number {
  return this.filter((char) => char == needle).length;
};
Array.prototype.toFieldString = function (): string {
  if (typeof this[0] === 'string') {
    return this.join('\n');
  } else {
    return this.map((a) => a.join('')).join('\n');
  }
};
Array.prototype.mapPairs = function <T, U>(callback: (a: T, b: T) => U): U[] {
  const ret: U[] = [];
  for (let i = 0; i < this.length; i++) {
    for (let j = i + 1; j < this.length; j++) {
      ret.push(callback(this[i], this[j]));
    }
  }
  return ret;
};
Array.prototype.mapRecursiveWithMemory = function <U>(
  callback: (recursion: (...args2: any[]) => U, ...args: any[]) => U,
  keyfun: undefined | ((...args: any[]) => string) = undefined,
  ...args: any[]
): U[] {
  const memo: Map<string, U> = new Map<string, U>();
  const recursiveRun = (...args: any[]) => {
    const key = keyfun ? keyfun(args) : args.join('-');
    if (memo.has(key)) return memo.get(key)!;
    const result = callback(recursiveRun, ...args);
    memo.set(key, result);
    return result;
  };
  return this.map((e) => recursiveRun(e, ...args));
};

Number.prototype.diffTo = function (other: number): number {
  return Math.abs(Number(this) - other);
};
Number.prototype.between = function (min: number, max: number): boolean {
  return Number(this) >= min && Number(this) <= max;
};

Number.prototype.numberOfDigits = function (): number {
  if (Number(this) === 0) return 1;
  return Math.floor(Math.log10(Math.abs(Number(this)))) + 1;
};
