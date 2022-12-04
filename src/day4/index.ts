import fs from "node:fs/promises";

const input = await fs.readFile("src/day4/input.txt", "utf-8");

class Range {
    min: number;
    max: number;
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
    contains = (other: Range): boolean =>
        (other.min >= this.min && other.max <= this.max);
    overlaps = (other: Range): boolean =>
        !(other.max < this.min || other.min > this.max);
}

const assignmentToRange = (assignment: string) => {
    const [minString, maxString] = assignment.split("-");
    return new Range(parseInt(minString), parseInt(maxString));
};

const common = (check: (r0: Range, r1: Range) => boolean) => {
    let sum = 0;
    const lines = input.split("\n");
    for (const line of lines) {
        if (line === "") { continue; }
        const [left, right] = line.split(",");
        const leftRange = assignmentToRange(left);
        const rightRange = assignmentToRange(right);
        if (check(leftRange, rightRange)) {
            sum += 1;
        }
    }
    console.log(sum);
};

const part1 = () => {
    common(
        (leftRange, rightRange) =>
            leftRange.contains(rightRange) || rightRange.contains(leftRange)
    );
};

const part2 = () => {
    common((leftRange, rightRange) => leftRange.overlaps(rightRange));
};

part1();
part2();