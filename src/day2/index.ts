#! /usr/bin/env node

import fs from "node:fs/promises";

console.log("merry scrimby");

type Shape = "rock" | "paper" | "scissors";

type MatchOutcome = "lose" | "draw" | "win";

function decryptABC(input: string): Shape {
    switch (input) {
        case "A": return "rock";
        case "B": return "paper";
        case "C": return "scissors";
        default: throw new Error("Decrypt ABC - Should also not happen");
    }
}

function decryptXYZPart2(input: string): MatchOutcome {
    switch (input) {
        case "X": return "lose";
        case "Y": return "draw";
        case "Z": return "win";
        default: throw new Error("Decrypt XYZ part 2- Should not happen");
    }
}
function decryptXYZPart1(input: string): Shape {
    switch (input) {
        case "X": return "rock";
        case "Y": return "paper";
        case "Z": return "scissors";
        default: throw new Error("Decrypt XYZ - Should not happen");
    }
}

function getBestShape(opp: Shape, me: MatchOutcome): Shape {
    if (me === "draw") { return opp; }
    if (opp === "rock" && me === "lose") { return "scissors"; }
    if (opp === "rock" && me === "win") { return "paper"; }
    if (opp === "scissors" && me === "win") { return "rock"; }
    if (opp === "scissors" && me === "lose") { return "paper"; }
    if (opp === "paper" && me === "lose") { return "rock"; }
    if (opp === "paper" && me === "win") { return "scissors"; }
    throw new Error("doMatch error");
}
function doMatch(opp: Shape, me: Shape): MatchOutcome {
    if (opp === me) { return "draw"; }
    if (opp === "rock" && me === "scissors") { return "lose"; }
    if (opp === "rock" && me === "paper") { return "win"; }
    if (opp === "scissors" && me === "rock") { return "win"; }
    if (opp === "scissors" && me === "paper") { return "lose"; }
    if (opp === "paper" && me === "rock") { return "lose"; }
    if (opp === "paper" && me === "scissors") { return "win"; }
    throw new Error("doMatch error");
}

function score(opp: Shape, me: Shape): number {
    const shapeScoreMap = {
        rock: 1, paper: 2, scissors: 3
    };
    const shapeScore = shapeScoreMap[me];

    const outcomeScoreMap = {
        win: 6, lose: 0, draw: 3
    };
    const outcomeScore = outcomeScoreMap[doMatch(opp, me)];

    return outcomeScore + shapeScore;
}

const input = await fs.readFile("src/day2/input.txt", "utf-8");

function part1() {
    const lines = input.split("\n");
    let total = 0;
    lines.forEach(line => {
        if (line !== "") {
            const match = line.split(" ");
            const opponent = decryptABC(match[0]);
            const me = decryptXYZPart1(match[1]);
            total += score(opponent, me);
        }
    });
    console.log(total);
}

function part2() {
    const lines = input.split("\n");
    let total = 0;
    lines.forEach(line => {
        if (line !== "") {
            const match = line.split(" ");
            const opponent = decryptABC(match[0]);
            const wantedOutcome = decryptXYZPart2(match[1]);
            const me = getBestShape(opponent, wantedOutcome);
            total += score(opponent, me);
        }
    });
    console.log(total);
}
part1();
part2();