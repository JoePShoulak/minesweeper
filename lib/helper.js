const random = Math.random;
const floor = Math.floor;

export const randomNumber = (num) => floor(random() * num);

export const positionMatch = (a, b) => a.x === b.x && a.y === b.y;
