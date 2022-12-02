#! /usr/bin/env node

import fs from "node:fs/promises";

console.log("cheems");

const input = await fs.readFile("src/day1/input.txt", "utf-8");
const lines = input.split("\n");

const sums: number[] = [];
let cur = 0;

lines.forEach((element) => {
    if (element == "") {
        sums.push(cur);
        cur = 0;
    } else {
        cur += parseInt(element, 10);
    }
});
if (cur !== 0) {
    sums.push(cur);
}

sums.sort((a, b) => b - a);

console.log(sums[0] + sums[1] + sums[2]);
