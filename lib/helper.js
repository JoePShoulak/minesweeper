
const random = Math.random;
const floor = Math.floor;

export const randomNumber = (num) => {
    return floor(random() * num);
}

export const positionMatch = (a, b) => {
    return a.x === b.x && a.y === b.y;
}


