import { lib } from '../lib';

type Hand = {hand: string, bid: number, cardValue: number, combinationValue: number};

// function logic
function run(data: string[], part: 'A' | 'B') {
  const hands: Hand[] = [];
  for (let line of data) {
    const [hand, bid] = line.split(' ') as [string, number];
    const [cardValue, combinationValue] = getValues(hand, part);
    hands.push({hand, bid, cardValue, combinationValue});
  }
  // sort with weakest hand at i = 0
  hands.sort(compare);
  let sum = 0;
  for (let i = 0; i < hands.length; ++i) {
    sum += hands[i].bid * (i + 1);
  }
  return sum;
}

const powerOrderA = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const powerOrderB = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

function getValues(hand: string, part: 'A' | 'B'): [number, number] {
  // cards power 
  let cardCount: { card: string, count: number }[] = [];
  let cardsValue = 0;
  let jokerCount = 0;
  // iterate over every card (char) of hand (string)
  for (let i = 0; i < hand.length; ++i) {
    if (hand[i] == 'J' && part == 'B') {
      jokerCount++; // count J seperately in part B, they are not added to cardCount
    } else {
      const foundCard = cardCount.find(b => b.card == hand[i]);
      foundCard == undefined ? cardCount.push({ card: hand[i], count: 1 }) : foundCard.count++;
    }
    cardsValue += Math.pow(16, (6 - i)) * (15 - (part == 'A' ? powerOrderA : powerOrderB).indexOf(hand[i]));
  }

  // calculate combination value
  let combinationValue = 0;
  if (cardCount.length == 1 || jokerCount == 5) {
    combinationValue = 10; // five of kind
  } else if (cardCount.length == 2) {
    if (cardCount[0].count + jokerCount == 4 || cardCount[1].count + jokerCount == 4) {
      combinationValue = 9; // four of a kind
    } else {
      combinationValue = 8; // full house
    }
  } else if (cardCount.length == 3) {
    if (cardCount[0].count + jokerCount == 3 ||
      cardCount[1].count + jokerCount == 3 ||
      cardCount[2].count + jokerCount == 3) {
      combinationValue = 7; // three of a kind
    } else {
      combinationValue = 6; // two pair
    }
  } else if (cardCount.length == 4) {
    combinationValue = 5; // one pair
  } else {
    combinationValue = 4; // highest card
  }
  return [cardsValue, combinationValue];
}

function compare(a: Hand, b: Hand) {
  if (a.combinationValue == b.combinationValue) {
    if (a.cardValue < b.cardValue) {
      return -1;
    }
    if (a.cardValue > b.cardValue) {
      return 1;
    }
    return 0;
  }
  if (a.combinationValue < b.combinationValue) {
    return -1;
  }
  if (a.combinationValue > b.combinationValue) {
    return 1;
  }
  return 0;
}

// execute and output
console.log('Test aim: 6440');
const runTest = false, runProd = true, runA = true, runB = true;
lib.execute(__filename, runTest, runProd, runA, runB, run);

// A: 249726565
// B: 251135960