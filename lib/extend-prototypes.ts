export {};

declare global {
  interface String {
    replaceAt(index: number, replacement: string): string;
    countChar(needle: string): number;
  }

  interface Array<T> {
    transpose(): Array<T>;
    toFieldString(): string;
    count(needle: string): number;
    sum(add?: (a: T) => number): number;
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
