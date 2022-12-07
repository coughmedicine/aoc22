import fs from "node:fs/promises";

const input = await fs.readFile("src/day7/input.txt", "utf-8");
const lines = input.split("\n");

type File = { name: string; size: number; parent: Folder };
type Folder = { name: string; nodes: Node[]; parent: Folder | null };

type Node = { type: "folder"; data: Folder } | { type: "file"; data: File };

const cd = (from: Folder, name: string): Folder => {
    if (name === "..") {
        if (from.parent === null) {
            throw new Error("Cant return parent of root directory");
        }
        return from.parent;
    }
    for (const inside of from.nodes) {
        if (inside.data.name === name) {
            if (inside.type === "folder") {
                return inside.data;
            }
            throw new Error("This is a file not a folder!!!");
        }
    }
    throw new Error("Name not found");
};

const populateFromLs = (ls: string, folder: Folder) => {
    const [left, right] = ls.split(" ");
    if (left === "dir") {
        const child: Folder = { name: right, nodes: [], parent: folder };
        const node: Node = { type: "folder", data: child };
        folder.nodes.push(node);
    } else {
        const child: File = {
            name: right,
            size: parseInt(left),
            parent: folder,
        };
        const node: Node = { type: "file", data: child };
        folder.nodes.push(node);
    }
};

const parseTerminal = (lines: string[]): Folder => {
    const root: Folder = { name: "/", parent: null, nodes: [] };
    let currentFolder: Folder = root;
    for (let i = 1; i < lines.length - 1; i++) {
        const line = lines[i];
        if (line.startsWith("$ cd ")) {
            const where = line.slice(5);
            currentFolder = cd(currentFolder, where);
        }
        if (line === "$ ls") {
            const start = i + 1;
            for (let i = start; i < lines.length - 1; i++) {
                if (lines[i].startsWith("$")) break;
                populateFromLs(lines[i], currentFolder);
            }
        }
    }
    return root;
};

const folderSize = (folder: Folder): number => {
    let sum = 0;
    for (const node of folder.nodes) {
        if (node.type === "file") {
            sum += node.data.size;
        } else {
            sum += folderSize(node.data);
        }
    }
    return sum;
};

const traverseFolders = (folder: Folder, f: (input: Folder) => void) => {
    f(folder);
    for (const node of folder.nodes) {
        if (node.type === "folder") {
            traverseFolders(node.data, f);
        }
    }
};

const sumSmall = (folder: Folder): number => {
    let sum = 0;
    const f = (folder: Folder) => {
        const size = folderSize(folder);
        if (size < 100000) {
            sum += size;
        }
    };
    traverseFolders(folder, f);
    return sum;
};

const findToDelete = (folder: Folder): number => {
    let smallest = Infinity;
    const threshold = folderSize(folder) - (70000000 - 30000000);
    const f = (folder: Folder) => {
        const size = folderSize(folder);
        if (size < smallest && size >= threshold) {
            smallest = size;
        }
    };
    traverseFolders(folder, f);
    return smallest;
};

const tree = parseTerminal(lines);
console.log(sumSmall(tree));
console.log(findToDelete(tree));
console.log(folderSize(tree));
