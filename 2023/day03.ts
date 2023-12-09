import { lib } from '../lib';

// function logic
function run(data: string[], part: 'A' | 'B') {
  const REGEX_NUM = new RegExp(/(\d+)/, "g");
  const REGEX_SIGN = new RegExp(/[^.]/, "");
  const REGEX_GEAR = new RegExp(/(\*)/, "g");

  let sum = 0;
  // iterate over lines
  for (let lineNo = 0; lineNo < data.length; ++lineNo) {
    let reg;
    const REGEX = part == 'A' ? REGEX_NUM : REGEX_GEAR;
    do {
      reg = REGEX.exec(data[lineNo]);
      if (reg != null) {
        if(part == 'A') {
          const partNumber = Number.parseInt(reg[1]);
          const start = reg.index;
          const end = start + reg[1].length;
          // check adjacent
          let linesToCheck = '';
          // previous line
          if (lineNo > 0) {
            linesToCheck += data[lineNo - 1].substring(start > 0 ? start - 1 : start, end < data[lineNo - 1].length ? end + 1 : end);
          }
          // current line
          if (start > 0) linesToCheck += data[lineNo][start - 1];
          if (end < data[lineNo].length) linesToCheck += data[lineNo][end];
          // next line 
          if (lineNo + 1 < data.length) {
            linesToCheck += data[lineNo + 1].substring(start > 0 ? start - 1 : start, end < data[lineNo + 1].length ? end + 1 : end);
          }
          // do we have a sign in linesToCheck? 
          if (REGEX_SIGN.test(linesToCheck)) {
            sum += partNumber;
          }
        } else {
          // B 
          const gearPos = reg.index;
          let adjacentNumbers: number[] = [];
          // previous line
          let regNum;
          if (lineNo > 0) {
            do {
              regNum = REGEX_NUM.exec(data[lineNo - 1]);
              if (regNum != null) {
                const partNumber = Number.parseInt(regNum[1]);
                const start = regNum.index;
                const end = start + regNum[1].length - 1;
                if (gearPos >= start - 1 && gearPos <= end + 1) {
                  adjacentNumbers.push(partNumber);
                }
              }
            } while (regNum != null)
          }
          // current line
          do {
            regNum = REGEX_NUM.exec(data[lineNo]);
            if (regNum != null) {
              const partNumber = Number.parseInt(regNum[1]);
              const start = regNum.index;
              const end = start + regNum[1].length - 1;
              if (gearPos == end + 1 || gearPos == start - 1) {
                adjacentNumbers.push(partNumber);
              }
            }
          } while (regNum != null)

          // next line 
          if (lineNo + 1 < data.length) {
            do {
              regNum = REGEX_NUM.exec(data[lineNo + 1]);
              if (regNum != null) {
                const partNumber = Number.parseInt(regNum[1]);
                const start = regNum.index;
                const end = start + regNum[1].length - 1;
                if (gearPos >= start - 1 && gearPos <= end + 1) {
                  adjacentNumbers.push(partNumber);
                }
              }
            } while (regNum != null)
          }
          if (adjacentNumbers.length == 2) {
            sum += (adjacentNumbers[0] * adjacentNumbers[1]);
          }
        }
      }
    } while (reg != null)
  }
  return sum;
}

// execute and output
const runTest = true, runProd = true, runA = true, runB = true ;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 531932
// B: 73646890




