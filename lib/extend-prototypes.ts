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
    splitByEmptyLine(): Array<T[]>;

    // checks
    isDescending(): boolean;
    isAscending(): boolean;
    includesAll(needles: T[]): boolean;

    // calculations
    sum(add?: (a: T) => number): number;
    count(needle: string): number;
    toFieldString(): string;
  }

  interface Number {
    diffTo(other: number): number;
    between(min: number, max: number): boolean;
  }
}

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

String.prototype.splitAt = function (index: number): [string, string] {
  return [this.substring(0, index), this.substring(index)];
};

String.prototype.hasIndex = function (index: number): boolean {
  return index >= 0 && index < this.length;
};

String.prototype.centerIndex = function (): number {
  return Math.floor(this.length / 2);
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
Array.prototype.toFieldString = function (): string {
  if (typeof this[0] === 'string') {
    return this.join('\n');
  } else {
    return this.map((a) => a.join('')).join('\n');
  }
};
Array.prototype.count = function (needle: String): number {
  return this.filter((char) => char == needle).length;
};
Array.prototype.sum = function <T>(add: (a: T) => number = (a) => +a): number {
  return this.reduce((a, b) => a + add(b), 0);
};

Array.prototype.toGroupsOf = function <T>(size: number): Array<T>[] {
  const ret: Array<T>[] = [];
  for (let i = 0; i < this.length; i += size) {
    ret.push(this.slice(i, i + size));
  }
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

Array.prototype.getLast = function () {
  return this[this.length - 1];
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

Number.prototype.diffTo = function (other: number): number {
  return Math.abs(Number(this) - other);
};
Number.prototype.between = function (min: number, max: number): boolean {
  return Number(this) >= min && Number(this) <= max;
};
Array.prototype.centerIndex = function (): number {
  return Math.floor(this.length / 2);
};
Array.prototype.centerItem = function () {
  return this[this.centerIndex()];
};
Array.prototype.includesAll = function <T>(needles: T[]): boolean {
  return needles.every((needle) => this.includes(needle));
};
