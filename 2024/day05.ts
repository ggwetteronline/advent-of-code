import { Run } from '../lib';

// function logic
export function run(data: string[], part: 'A' | 'B') {
  const [allRules, allUpdates] = data.splitByEmptyLine();
  const rules = allRules.map(
    (r) => r.split('|').map(Number) as [number, number]
  );
  const updates = allUpdates.map((u) => u.split(',').map(Number) as number[]);
  if (part === 'A') {
    return updates
      .map((update) => {
        // a rule is violated if the numbers are in the array
        // but not in the correct order
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          // has update both numbers of rule?
          if (update.includesAll(rule)) {
            // are they NOT in correct order?
            if (update.indexOf(rule[0]) < update.indexOf(rule[1]) == false) {
              return 0;
            }
          }
        }
        // if no rule was violated return center number of update
        return update.centerItem();
      })
      .sum();
  } else {
    return (
      updates
        // lines with incorrect order
        .filter((update) => {
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            // has update both numbers of rule?
            if (update.includesAll(rule)) {
              // are they NOT in correct order?
              if (update.indexOf(rule[0]) < update.indexOf(rule[1]) == false) {
                return true;
              }
            }
          }
          // order is correct, so no update
          return false;
        })
        // change order, so the rules apply
        .map((update) => applyAllRule(update, rules))
        // return center number of each update
        .map((update) => update.centerItem())
        .sum()
    );
  }
}

/**
 * Changes the order of the numbers in update so that the rules apply
 * @param update initial order of numbers
 * @param rules rules to apply
 * @returns array with numbers in correct order
 */
function applyAllRule(update: number[], rules: [number, number][]): number[] {
  const result = [...update];
  result.sort((a, b) => {
    for (const [first, second] of rules) {
      if (a === first && b === second) {
        return -1;
      }
      if (a === second && b === first) {
        return 1;
      }
    }
    return 0;
  });
  return result;
}

export const runs: Run<number>[] = [
  { name: 'A test', part: 'A', data: 'test', expected: 143 },
  { name: 'A prod', part: 'A', data: 'prod', expected: 4924 },
  { name: 'B test', part: 'B', data: 'test', expected: 123 },
  { name: 'B prod', part: 'B', data: 'prod', expected: 6085 },
];
