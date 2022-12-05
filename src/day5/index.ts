import fs from "node:fs/promises";

const input = await fs.readFile("src/day5/input.txt", "utf-8");

const [stackString, instructions] = input.split("\n\n");

const splitStacks = stackString.split("\n");
const splitInstructions = instructions.split("\n");

splitStacks.pop();


const stacks: { [key: number]: string[] } = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
};

const move = (from: string[], to: string[]) => {
    const elem = from.pop();
    if (elem !== undefined) { to.push(elem); }
};

const moveMany = (from: string[], to: string[], amount: number) => {
    const toMove: string[] = [];
    for (let i = 0; i < amount; i++) {
        move(from, toMove);
    }
    for (let i = 0; i < amount; i++) {
        move(toMove, to);
    }
};

const parseInstruction = (line: string): { count: number, from: number, to: number } => {
    const re = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;
    const match = line.match(re);
    if (match === null) throw new Error("parse instruction epic fail");
    return {
        count: parseInt(match[1]),
        from: parseInt(match[2]),
        to: parseInt(match[3])
    };
};


for (const line of splitStacks) {
    for (let i = 0; 1 + 4 * i < line.length; i++) {
        const char = line[1 + 4 * i];
        if (char === " ") { continue; }
        stacks[i + 1].unshift(char);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const part1 = () => {
    for (const line of splitInstructions) {
        if (line === "") continue;
        const instruction = parseInstruction(line);
        for (let i = 0; i < instruction.count; i++) {
            move(stacks[instruction.from], stacks[instruction.to]);
        }
    }
    printSolution();
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const part2 = () => {
    for (const line of splitInstructions) {
        if (line === "") continue;
        const instruction = parseInstruction(line);
        moveMany(stacks[instruction.from], stacks[instruction.to], instruction.count);
    }
    printSolution();
};


const printSolution = () => {
    let solution = "";

    for (let i = 1; i <= 9; i++) {
        solution += stacks[i][stacks[i].length - 1];
    }

    console.log(solution);
};
part2();