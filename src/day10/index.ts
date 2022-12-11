import fs from "node:fs/promises";

const input = await fs.readFile("src/day10/input.txt", "utf-8");

const instructions = input.split("\n");
instructions.pop();

const grid = [
    [..."........................................"],
    [..."........................................"],
    [..."........................................"],
    [..."........................................"],
    [..."........................................"],
    [..."........................................"],
];

let clock = 1;
let register = 1;
let result = 0;

const addToResult = () => {
    if (clock % 40 === 20) {
        result += clock * register;
    }
};

const readGrid = () => {
    for (const line of grid) {
        console.log(line.join(""));
    }
};

const changeGrid = () => {
    const position = (clock - 1) % 40;
    const row = Math.floor((clock - 1) / 40);
    if (Math.abs(position - register) <= 1) {
        grid[row][position] = "#";
    }
};

instructions.forEach((element) => {
    if (element === "noop") {
        changeGrid();
        clock += 1;

        addToResult();
    } else {
        const [, number] = element.split(" ");
        changeGrid();
        clock += 1;

        addToResult();
        changeGrid();
        clock += 1;

        register += parseInt(number);
        addToResult();
    }
});
console.log("PART 1:");
console.log(result);
console.log("PART 2:");
readGrid();
