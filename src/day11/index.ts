import fs from "node:fs/promises";
//const input = await fs.readFile("src/day11/input.txt", "utf-8");

const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

const re = new RegExp(
    `Monkey (?<monkey>[0-9]):
  Starting items: (?<items>[0-9]*(, [0-9]*)*)
  Operation: new = (?<operation>((old \\* [0-9]*)|(old \\+ [0-9]*)|(old \\* old)))
  Test: divisible by (?<testDivisible>[0-9]*)
    If true: throw to monkey (?<ifTrue>[0-9])
    If false: throw to monkey (?<ifFalse>[0-9])`,
    "g"
);

const part2 = true;

class Monkey {
    monkey: number;
    items: number[];
    op: (n: number) => number;
    testDiv: number;
    ifTrue: number;
    ifFalse: number;
    inspections = 0;

    constructor(
        monkey: number,
        items: number[],
        op: (n: number) => number,
        testDiv: number,
        ifTrue: number,
        ifFalse: number
    ) {
        this.monkey = monkey;
        this.items = items;
        this.op = op;
        this.testDiv = testDiv;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
    }

    inspectItem = (item: number): { nextMonkey: number; newItem: number } => {
        this.inspections += 1;
        let newItem = this.op(item);
        newItem = Math.floor(newItem / (part2 ? 1 : 3));
        if (newItem % this.testDiv === 0) {
            return { nextMonkey: this.ifTrue, newItem };
        } else {
            return { nextMonkey: this.ifFalse, newItem };
        }
    };

    turn = (monkeys: Monkey[]) => {
        while (this.items.length !== 0) {
            const { nextMonkey, newItem } = this.inspectItem(this.items[0]);
            this.items.shift();
            monkeys[nextMonkey].items.push(newItem);
        }
    };
}

const round = (monkeys: Monkey[]) => {
    for (const monkey of monkeys) {
        monkey.turn(monkeys);
    }
};

const createOperation = (operationString: string) => {
    if (operationString === "old * old") {
        return (f: number) => f * f;
    } else if (operationString.startsWith("old *")) {
        const [, number] = operationString.split(" * ");
        return (f: number) => f * parseInt(number);
    } else {
        const [, number] = operationString.split(" + ");
        return (f: number) => f + parseInt(number);
    }
};

const monkeys: Monkey[] = [];
for (const match of input.matchAll(re)) {
    const groups = match.groups as {
        [key: string]: string;
    };
    const monkey = parseInt(groups.monkey);
    console.log(groups.items.split(", "));
    const items = groups.items.split(", ").map((s) => parseInt(s));
    const operationString = groups.operation;
    const operation = createOperation(operationString);
    const testDiv = parseInt(groups.testDivisible);
    const ifTrue = parseInt(groups.ifTrue);
    const ifFalse = parseInt(groups.ifFalse);

    monkeys.push(
        new Monkey(monkey, items, operation, testDiv, ifTrue, ifFalse)
    );
}

for (let i = 0; i < (part2 ? 10000 : 20); i++) {
    round(monkeys);
}
console.log(monkeys);
const inspections = monkeys.map((m) => m.inspections);
inspections.sort((a, b) => b - a);
console.log(inspections[0] * inspections[1]);
