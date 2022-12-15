import fs from "node:fs/promises";
const input = await fs.readFile("src/day14/input.txt", "utf-8");

type Cell = "#" | "o" | "+";

type Grid = {
    [row: number]: {
        [col: number]: Cell;
    };
};

type Vector = {
    x: number;
    y: number;
};
type Bounds = {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
};
const isSolid = (grid: Grid, vector: Vector, bottom: number) => {
    if (vector.y in grid) {
        if (vector.x in grid[vector.y]) {
            return true;
        }
    }
    if (vector.y >= bottom && part2) {
        return true;
    }
    return false;
};

const lines = input.split("\n");
lines.pop();
const findBounds = (grid: Grid): Bounds => {
    let minRow = Infinity;
    let maxRow = -1;
    let minCol = Infinity;
    let maxCol = -1;
    const rowKey = Object.keys(grid);
    for (const row of rowKey) {
        if (parseInt(row) > maxRow) {
            maxRow = parseInt(row);
        }
        if (parseInt(row) < minRow) {
            minRow = parseInt(row);
        }
        for (const col of Object.keys(grid[parseInt(row)])) {
            if (parseInt(col) > maxCol) {
                maxCol = parseInt(col);
            }
            if (parseInt(col) < minCol) {
                minCol = parseInt(col);
            }
        }
    }
    return {
        minCol,
        maxCol,
        maxRow,
        minRow,
    };
};
const showGrid = (grid: Grid) => {
    const { minRow, maxRow, minCol, maxCol } = findBounds(grid);
    const line = new Array(maxCol - minCol + 1).fill(".");
    for (let i = minRow; i <= maxRow; i++) {
        const copyLine = [...line];
        for (let j = minCol; j <= maxCol; j++) {
            if (isSolid(grid, { y: i, x: j }, bottom)) {
                copyLine[j - minCol] = grid[i][j];
            }
        }
        console.log(copyLine.join(""));
    }
};

const sandFall = (grid: Grid, faucet: Vector): boolean => {
    const sandPos = { y: faucet.y, x: faucet.x };
    while (true) {
        if (sandPos.y > bottom) {
            return true;
        }
        if (!isSolid(grid, { y: sandPos.y + 1, x: sandPos.x }, bottom)) {
            sandPos.y += 1;
            continue;
        }
        if (!isSolid(grid, { y: sandPos.y + 1, x: sandPos.x - 1 }, bottom)) {
            sandPos.x -= 1;
            sandPos.y += 1;
            continue;
        }
        if (!isSolid(grid, { y: sandPos.y + 1, x: sandPos.x + 1 }, bottom)) {
            sandPos.x += 1;
            sandPos.y += 1;
            continue;
        }
        break;
    }
    if (!(sandPos.y in grid)) {
        grid[sandPos.y] = {};
    }
    if (grid[sandPos.y][sandPos.x] == "+" && part2) {
        grid[sandPos.y][sandPos.x] = "o";
        return true;
    }
    grid[sandPos.y][sandPos.x] = "o";

    return false;
};

const grid: Grid = {};
grid[0] = {};
grid[0][500] = "+";

lines.forEach((line) => {
    const coordinates = line.split(" -> ");
    const vector: Vector[] = coordinates.map((coord) => {
        const [left, right] = coord.split(",");
        return { x: parseInt(left), y: parseInt(right) };
    });
    for (let i = 0; i < vector.length - 1; i++) {
        const p0 = vector[i];
        const p1 = vector[i + 1];
        if (p1.x === p0.x) {
            for (
                let row = Math.min(p0.y, p1.y);
                row <= Math.max(p0.y, p1.y);
                row++
            ) {
                if (!(row in grid)) {
                    grid[row] = {};
                }
                grid[row][p1.x] = "#";
            }
        }
        if (p1.y === p0.y) {
            for (
                let col = Math.min(p0.x, p1.x);
                col <= Math.max(p0.x, p1.x);
                col++
            ) {
                if (!(p1.y in grid)) {
                    grid[p1.y] = {};
                }
                grid[p1.y][col] = "#";
            }
        }
    }
});

const bottom = findBounds(grid).maxRow + 2;
const part2 = false;
let count = part2 ? 1 : 0;
while (!sandFall(grid, { y: 0, x: 500 })) {
    count += 1;
}
showGrid(grid);
console.log(count);
