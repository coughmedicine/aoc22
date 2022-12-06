import fs from "node:fs/promises";

const input = await fs.readFile("src/day6/input.txt", "utf-8");
const datastream = input.split("\n")[0];

const findMarker = (datastream: string, amount: number): number => {
    for (let i = 0; i < datastream.length - (amount - 1); i++) {
        const chars = datastream.slice(i, i + amount);
        const set = new Set(chars);
        if (chars.length === set.size) { return i; }
    }
    throw new Error("cringe");
};

console.log(findMarker(datastream, 4) + 4);
console.log(findMarker(datastream, 14) + 14);
