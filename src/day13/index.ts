import fs from "node:fs/promises";
const input = await fs.readFile("src/day13/input.txt", "utf-8");

const pairs = input.split("\n\n");

type List = (number | List)[];

type CoolerBool = boolean | "idk";

const inOrder = (left: List, right: List): CoolerBool => {
    if (right.length === 0 && left.length === 0) {
        return "idk";
    }
    if (right.length === 0) {
        return false;
    }
    if (left.length === 0) {
        return true;
    }
    if (typeof left[0] === "number" && typeof right[0] === "number") {
        if (left[0] > right[0]) {
            return false;
        }
        if (left[0] < right[0]) {
            return true;
        }
        return inOrder(left.slice(1), right.slice(1));
    }
    if (typeof left[0] !== "number" && typeof right[0] !== "number") {
        const temp = inOrder(left[0], right[0]);
        if (temp !== "idk") {
            return temp;
        } else {
            return inOrder(left.slice(1), right.slice(1));
        }
    }
    if (typeof left[0] !== "number") {
        const temp = inOrder(left[0], [right[0]]);
        if (temp !== "idk") {
            return temp;
        } else {
            return inOrder(left.slice(1), right.slice(1));
        }
    }
    if (typeof right[0] !== "number") {
        const temp = inOrder([left[0]], right[0]);
        if (temp !== "idk") {
            return temp;
        } else {
            return inOrder(left.slice(1), right.slice(1));
        }
    }
    return "idk";
};

const getArray = (input: string, index = 1): { list: List; index: number } => {
    const result: List = [];
    let i = index;
    while (true) {
        let currentNo = "";
        while (input[i] >= "0" && input[i] <= "9") {
            currentNo += input[i];
            i++;
        }
        if (currentNo !== "") {
            result.push(parseInt(currentNo));
        }
        if (input[i] === ",") {
            currentNo = "";
            i++;
        }
        if (input[i] === "]") {
            return { list: result, index: i + 1 };
        }
        if (input[i] === "[") {
            const { list, index } = getArray(input, i + 1);
            result.push(list);
            i = index;
        }
    }
};

const sortPackets = (input: List[]) => {
    return input.sort((left, right) => {
        const x = inOrder(left, right);
        if (x === true) {
            return -1;
        }
        if (x === false) {
            return 1;
        }
        return 0;
    });
};

let sum = 0;
const packetArray: List[] = [];
for (let i = 0; i < pairs.length; i++) {
    const [leftStr, rightStr] = pairs[i].split("\n");
    const left = getArray(leftStr).list;
    const right = getArray(rightStr).list;
    if (inOrder(left, right) === true) {
        sum += i + 1;
    }
    packetArray.push(left, right);
}
packetArray.push([[2]], [[6]]);
console.log(sum);

sortPackets(packetArray);
const position1 = packetArray.findIndex((a) => inOrder(a, [[2]]) === "idk") + 1;
const position2 = packetArray.findIndex((a) => inOrder(a, [[6]]) === "idk") + 1;

console.log(position1 * position2);
