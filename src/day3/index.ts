
import fs from "node:fs/promises";


const input = await fs.readFile("src/day3/input.txt", "utf-8");

function part1() {
    const rucksacks = input.split("\n");
    let sum = 0;
    for (const element of rucksacks) {
        if (element === "") { continue; }
        const firstComp = element.slice(0, element.length / 2);
        const secondComp = element.slice(element.length / 2, element.length);
        const char = findShared(firstComp, secondComp);
        sum += findPriority(char);
    }
    console.log(sum);
}

function part2() {
    const rucksacks = input.split("\n");
    rucksacks.pop();
    let sum = 0;
    const elfgroups = [];
    for (let i = 0; i < rucksacks.length; i += 3) {
        elfgroups.push(rucksacks.slice(i, i + 3));
    }
    for (const group of elfgroups) {
        const char = findShared3(group[0], group[1], group[2]);
        sum += findPriority(char);
    }
    console.log(sum);
}
function findShared3(firstBag: string, secondBag: string, thirdBag: string): string {
    for (const firstChar of firstBag) {
        for (const secondChar of secondBag) {
            for (const thirdChar of thirdBag) {
                if (firstChar === secondChar && firstChar === thirdChar) {
                    return firstChar;
                }
            }
        }
    }
    throw new Error("cringe in findShared 3");
}

function findShared(firstComp: string, secondComp: string): string {
    for (const firstChar of firstComp) {
        for (const secondChar of secondComp) {
            if (firstChar === secondChar) {
                return firstChar;
            }
        }
    }
    throw new Error("find shared cringe");
}

function findPriority(char: string): number {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const priority = alphabet.indexOf(char);
    if (priority === -1) { throw new Error("not in alphabet"); }
    return priority + 1;
}

part1();
part2();