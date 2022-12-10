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
    headPos: Vector = { x: 0, y: 0 };
    tailPos: Vector = { x: 0, y: 0 };
    visited: Set<string> = new Set();

    getDifference(): Vector {
        return {
            x: this.headPos.x - this.tailPos.x,
            y: this.headPos.y - this.tailPos.y,
        };
    }

    getDistance(): number {
        const diff = this.getDifference();
        return Math.max(Math.abs(diff.x), Math.abs(diff.y));
    }

    moveHeadOnce(dir: Direction) {
        if (dir === "U") {
            this.headPos.y++;
        }
        if (dir === "D") {
            this.headPos.y--;
        }
        if (dir === "R") {
            this.headPos.x++;
        }
        if (dir === "L") {
            this.headPos.x--;
        }
        if (this.getDistance() > 1) {
            const diff = this.getDifference();
            if (Math.abs(diff.y) === 2) {
                if (dir === "D") {
                    this.tailPos.y = this.headPos.y + 1;
                }
                if (dir === "U") {
                    this.tailPos.y = this.headPos.y - 1;
                }
                this.tailPos.x = this.headPos.x;
            } else if (Math.abs(diff.x) === 2) {
                if (dir === "L") {
                    this.tailPos.x = this.headPos.x + 1;
                }
                if (dir === "R") {
                    this.tailPos.x = this.headPos.x - 1;
                }
                this.tailPos.y = this.headPos.y;
            }
        }
        this.visited.add(JSON.stringify(this.tailPos));
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

const state = new State();
state.doInstructions(instructions);
console.log(state.visited.size);
