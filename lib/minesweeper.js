const random = Math.random;
const floor = Math.floor;


const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}

export const randomNumber = (num) => {
    return floor(random() * num);
}

export const positionMatch = (a, b) => {
    return a.x === b.x && a.y === b.y;
}

export const getMinePositions = (boardSize, numberOfMines) => {
    const positions = [];

    while (positions.length < numberOfMines) {
        const newPos = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }

        if (!positions.some(p => positionMatch(p, newPos))) {
            positions.push(newPos);
        }
    }

    return positions;
}

export const createBoard = (boardSize, numberOfMines) => {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for (let x=0; x<boardSize; x++) {
        const row = [];

        for (let y=0; y<boardSize; y++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(p => positionMatch(p, {x, y})),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            }

            row.push(tile);
        }

        board.push(row);
    }

    return board;
}
