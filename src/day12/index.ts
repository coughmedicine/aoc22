import fs from "node:fs/promises";
const input = await fs.readFile("src/day12/input.txt", "utf-8");

const lines = input.split("\n");
lines.pop();

type Coords = {
    x: number;
    y: number;
};
const findNeighbours = (map: number[][], point: Coords): Coords[] => {
    const urdl = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
    ];
    const result = [];
    const height = map[point.y][point.x];
    for (let i = 0; i < 4; i++) {
        const offsetPoint = { x: urdl[i].x + point.x, y: urdl[i].y + point.y };
        if (
            offsetPoint.x < 0 ||
            offsetPoint.x >= map[0].length ||
            offsetPoint.y < 0 ||
            offsetPoint.y >= map.length
        ) {
            continue;
        }
        const heightDiff = height - map[offsetPoint.y][offsetPoint.x];
        if (heightDiff > 1) {
            continue;
        }
        result.push(offsetPoint);
    }
    return result;
};
const popMinDistance = (q: Coords[], dist: number[][]): Coords => {
    let min = Infinity;
    let minCoords = { x: -1, y: -1 };
    let minIndex = -1;
    for (const [i, element] of q.entries()) {
        const distU = dist[element.y][element.x];
        if (distU < min) {
            min = distU;
            minCoords = element;
            minIndex = i;
        }
    }
    q.splice(minIndex, 1);
    return minCoords;
};

const findPath = (map: number[][], start: Coords) => {
    const dist: number[][] = [];
    const prev: (Coords | undefined)[][] = [];
    const q: Coords[] = [];
    for (const [y, row] of map.entries()) {
        const toAddDist = Array.from({ length: row.length }, () => Infinity);
        const toAddPrev = Array.from({ length: row.length }, () => undefined);
        dist.push(toAddDist);
        prev.push(toAddPrev);
        for (const [x] of row.entries()) {
            q.push({ x, y });
        }
    }
    dist[start.y][start.x] = 0;
    while (q.length !== 0) {
        const u = popMinDistance(q, dist);
        if (u.x === -1 && u.y === -1) {
            break;
        }
        const neighbors = findNeighbours(map, u);

        for (const v of neighbors) {
            if (q.some((e) => e.x === v.x && e.y === v.y)) {
                const alt = dist[u.y][u.x] + 1;
                if (alt < dist[v.y][v.x]) {
                    dist[v.y][v.x] = alt;
                    prev[v.y][v.x] = { ...u };
                }
            }
        }
    }
    return { dist, prev };
};

const grid: number[][] = [];
let start: Coords = { x: 0, y: 0 };
let end: Coords = { x: 0, y: 0 };

for (const [y, line] of lines.entries()) {
    const toAdd = [];
    for (const [x, char] of [...line].entries()) {
        if (char === "S") {
            start = { x, y };
            toAdd.push(0);
        } else if (char === "E") {
            end = { x, y };
            toAdd.push(25);
        } else {
            const temp = char.charCodeAt(0) - "a".charCodeAt(0);
            toAdd.push(temp);
        }
    }
    grid.push(toAdd);
}

const { dist, prev } = findPath(grid, end);
console.log(dist[start.y][start.x]);

let minDist = Infinity;
for (const [y, row] of grid.entries()) {
    for (const [x, num] of row.entries()) {
        if (num !== 0) {
            continue;
        }
        const d = dist[y][x];
        if (d < minDist) {
            minDist = d;
        }
    }
}
console.log(minDist);
