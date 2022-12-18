import fs from "node:fs/promises";
import { json } from "stream/consumers";
//const input = await fs.readFile("src/day15/input.txt", "utf-8");

const input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

const re =
    /Sensor at x=(?<x>-?[0-9]*), y=(?<y>-?[0-9]*): closest beacon is at x=(?<x2>-?[0-9]*), y=(?<y2>-?[0-9]*)/g;

type Cell = "S" | "B";

type Vector = {
    x: number;
    y: number;
};

type SensorBeacon = {
    s: Vector;
    b: Vector;
};

const findManhattan = (p1: Vector, p2: Vector): number =>
    Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

const showGrid = (perimeters: Set<string>) => {
    for (let y = 0; y <= 22; y++) {
        let gridStr = "";
        if (y < 10) {
            gridStr = gridStr + " " + JSON.stringify(y);
        } else {
            gridStr += JSON.stringify(y);
        }
        for (let x = 0; x <= 25; x++) {
            const temp: Vector = { x: x, y: y };
            if (perimeters.has(JSON.stringify(temp))) {
                gridStr += "#";
            } else {
                gridStr += ".";
            }
        }
        console.log(gridStr);
    }
};

const addPerimeter = (perimeters: Set<string>, sB: SensorBeacon) => {
    const md = findManhattan(sB.s, sB.b);
    const up: Vector = { x: sB.s.x, y: sB.s.y - md };
    const down: Vector = { x: sB.s.x, y: sB.s.y - md };
    const left: Vector = { x: sB.s.x - md, y: sB.s.y };
    const right: Vector = { x: sB.s.x + md, y: sB.s.y };

    const upleft: Vector[] = [up];
    const upright: Vector[] = [up];
    const rightdown: Vector[] = [right];
    const leftdown: Vector[] = [left];

    for (let i = 1; i <= md; i++) {
        upleft.push({ x: upleft[i - 1].x - 1, y: upleft[i - 1].y + 1 });
        upright.push({ x: upright[i - 1].x + 1, y: upright[i - 1].y + 1 });
        rightdown.push({
            x: rightdown[i - 1].x - 1,
            y: rightdown[i - 1].y + 1,
        });
        leftdown.push({ x: leftdown[i - 1].x + 1, y: leftdown[i - 1].y + 1 });
    }

    const perimeterVectors: Vector[] = [
        ...upleft,
        ...leftdown,
        ...rightdown,
        ...upright,
    ];

    perimeterVectors.forEach((element) => {
        const curr = JSON.stringify(element);
        perimeters.add(curr);
    });
};

const foundResult = (point: Vector, perimeters: Set<string>): boolean => {
    if (perimeters.has(JSON.stringify(point))) {
        return false;
    }
    const point1: Vector = { x: point.x + 1, y: point.y };
    const point2: Vector = { x: point.x - 1, y: point.y };
    const point3: Vector = { x: point.x, y: point.y + 1 };
    const point4: Vector = { x: point.x, y: point.y - 1 };

    if (
        perimeters.has(JSON.stringify(point1)) &&
        perimeters.has(JSON.stringify(point2)) &&
        perimeters.has(JSON.stringify(point3)) &&
        perimeters.has(JSON.stringify(point4))
    ) {
        console.log(point);
        return true;
    }
    return false;
};

const findLineHashtags = (
    lineIndex: number,
    sensorBeacon: SensorBeacon,
    allBeacons: number[]
): Set<number> => {
    const result: Set<number> = new Set();
    const manhatten = findManhattan(sensorBeacon.s, sensorBeacon.b);
    if (manhatten < Math.abs(sensorBeacon.s.y - lineIndex)) {
        return result;
    }

    const startPoint: Vector = { x: sensorBeacon.s.x, y: lineIndex };

    for (let i = startPoint.x - manhatten; i <= startPoint.x + manhatten; i++) {
        const curr: Vector = { x: i, y: lineIndex };
        if (
            findManhattan(curr, sensorBeacon.s) > manhatten ||
            allBeacons.includes(i)
        ) {
            continue;
        } else {
            result.add(i);
        }
    }
    return result;
};

const lines = input.split("\n");
lines.pop();
const lineToSearch = 2000000;
const sussyBeacon: SensorBeacon[] = [];
const allBeaconInLine: number[] = [];
lines.forEach((line) => {
    for (const match of line.matchAll(re)) {
        const groups = match.groups as {
            [key: string]: string;
        };
        const currentSensor = { x: parseInt(groups.x), y: parseInt(groups.y) };
        const currentBeacon = {
            x: parseInt(groups.x2),
            y: parseInt(groups.y2),
        };

        sussyBeacon.push({ s: currentSensor, b: currentBeacon });
        if (currentBeacon.y == lineToSearch) {
            allBeaconInLine.push(currentBeacon.x);
        }
    }
});

let setOfHashes: Set<number> = new Set();
for (const sB of sussyBeacon) {
    setOfHashes = new Set([
        ...setOfHashes,
        ...findLineHashtags(lineToSearch, sB, allBeaconInLine),
    ]);
}

console.log(setOfHashes.size);

const perimeters: Set<string> = new Set();

for (const sb of sussyBeacon) {
    addPerimeter(perimeters, sb);
}

for (const periString of perimeters) {
    const periPoint = JSON.parse(periString);
    const point1: Vector = { x: periPoint.x + 1, y: periPoint.y };
    const point2: Vector = { x: periPoint.x - 1, y: periPoint.y };
    const point3: Vector = { x: periPoint.x, y: periPoint.y + 1 };
    const point4: Vector = { x: periPoint.x, y: periPoint.y - 1 };

    if (foundResult(point1, perimeters)) {
        break;
    }
    if (foundResult(point2, perimeters)) {
        break;
    }
    if (foundResult(point3, perimeters)) {
        break;
    }
    if (foundResult(point4, perimeters)) {
        break;
    }
}
showGrid(perimeters);
