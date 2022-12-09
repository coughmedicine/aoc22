import fs from "node:fs/promises";

const input = await fs.readFile("src/day8/input.txt", "utf-8");

const forestArray = input.split("\n");
forestArray.pop();

type Tree = {
    size: number;
    visible: boolean;
};
type Forest = {
    [index: number]: {
        [index: number]: Tree;
    };
    rowLength: number;
    colLength: number;
};

const linesToForest = (lines: string[]): Forest => {
    const forest: Forest = {
        rowLength: lines.length,
        colLength: lines[0].length,
    };
    for (let row = 0; row < lines.length; row++) {
        forest[row] = {};
        const line = lines[row];
        for (let col = 0; col < line.length; col++) {
            forest[row][col] = { size: parseInt(line[col]), visible: false };
        }
    }
    return forest;
};

const markVisibleLeft = (forest: Forest) => {
    for (let r = 0; r < forest.rowLength; r++) {
        let tempMax = -1;
        for (let c = 0; c < forest.colLength; c++) {
            const tree = forest[r][c];
            if (tree.size > tempMax) {
                tree.visible = true;
                tempMax = tree.size;
            }
        }
    }
};

const markVisibleTop = (forest: Forest) => {
    for (let c = 0; c < forest.colLength; c++) {
        let tempMax = -1;
        for (let r = 0; r < forest.rowLength; r++) {
            const tree = forest[r][c];
            if (tree.size > tempMax) {
                tree.visible = true;
                tempMax = tree.size;
            }
        }
    }
};

const markVisibleRight = (forest: Forest) => {
    for (let r = 0; r < forest.rowLength; r++) {
        let tempMax = -1;
        for (let c = forest.colLength - 1; c >= 0; c--) {
            const tree = forest[r][c];
            if (tree.size > tempMax) {
                tree.visible = true;
                tempMax = tree.size;
            }
        }
    }
};

const markVisibleBottom = (forest: Forest) => {
    for (let c = 0; c < forest.colLength; c++) {
        let tempMax = -1;
        for (let r = forest.rowLength - 1; r >= 0; r--) {
            const tree = forest[r][c];
            if (tree.size > tempMax) {
                tree.visible = true;
                tempMax = tree.size;
            }
        }
    }
};

const countVisible = (forest: Forest): number => {
    let count = 0;
    for (let r = 0; r < forest.rowLength; r++) {
        for (let c = 0; c < forest.colLength; c++) {
            if (forest[r][c].visible) {
                count++;
            }
        }
    }
    return count;
};

const findScenicScore = (forest: Forest, row: number, col: number): number => {
    let countUp = 0;
    let countDown = 0;
    let countRight = 0;
    let countLeft = 0;
    const treeSize = forest[row][col].size;
    for (let i = col + 1; i < forest.colLength; i++) {
        countRight += 1;
        if (forest[row][i].size >= treeSize) {
            break;
        }
    }
    for (let i = col - 1; i >= 0; i--) {
        countLeft += 1;
        if (forest[row][i].size >= treeSize) {
            break;
        }
    }
    for (let i = row + 1; i < forest.rowLength; i++) {
        countDown += 1;
        if (forest[i][col].size >= treeSize) {
            break;
        }
    }
    for (let i = row - 1; i >= 0; i--) {
        countUp += 1;
        if (forest[i][col].size >= treeSize) {
            break;
        }
    }
    return countUp * countDown * countRight * countLeft;
};

const maxScenicScore = (forest: Forest): number => {
    let maxScore = 0;
    for (let c = 0; c < forest.colLength; c++) {
        for (let r = 0; r < forest.rowLength; r++) {
            const currentScore = findScenicScore(forest, r, c);
            if (currentScore > maxScore) {
                maxScore = currentScore;
            }
        }
    }
    return maxScore;
};

const forest = linesToForest(forestArray);
markVisibleBottom(forest);
markVisibleTop(forest);
markVisibleRight(forest);
markVisibleLeft(forest);

console.log(countVisible(forest));
console.log(maxScenicScore(forest));
