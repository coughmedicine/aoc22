import fs from "node:fs/promises";

const input = await fs.readFile("src/day9/input.txt", "utf-8");
const instructions = input.split("\n");
instructions.pop();

type Vector = {
    x: number;
    y: number;
};

type Direction = "U" | "D" | "R" | "L";

class State {
    positions: Vector[];
    visited: Set<string> = new Set();

    constructor(length: number) {
        this.positions = Array.from({ length }, () => {
            return { x: 0, y: 0 };
        });
    }

    getDifference(index: number): Vector {
        return {
            x: this.positions[index].x - this.positions[index + 1].x,
            y: this.positions[index].y - this.positions[index + 1].y,
        };
    }

    getDistance(index: number): number {
        const diff = this.getDifference(index);
        return Math.max(Math.abs(diff.x), Math.abs(diff.y));
    }

    moveHeadOnce(dir: Direction) {
        const headPos = this.positions[0];
        if (dir === "U") {
            headPos.y++;
        }
        if (dir === "D") {
            headPos.y--;
        }
        if (dir === "R") {
            headPos.x++;
        }
        if (dir === "L") {
            headPos.x--;
        }

        for (let i = 0; i < this.positions.length - 1; i++) {
            this.followTail(i);
        }

        this.visited.add(
            JSON.stringify(this.positions[this.positions.length - 1])
        );
    }

    followTail(index: number) {
        if (this.getDistance(index) > 1) {
            const diff = this.getDifference(index);
            const tailPos = this.positions[index + 1];
            tailPos.x += Math.sign(diff.x);
            tailPos.y += Math.sign(diff.y);
        }
    }

    moveHead(direction: Direction, size: number) {
        for (let i = 0; i < size; i++) {
            this.moveHeadOnce(direction);
        }
    }

    doInstructions(instructions: string[]) {
        instructions.forEach((line) => {
            const [dir, size] = line.split(" ");
            this.moveHead(dir as Direction, parseInt(size));
        });
    }
}

const state = new State(10);
state.doInstructions(instructions);
console.log(state.visited.size);
