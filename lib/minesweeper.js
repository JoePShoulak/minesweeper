const random = Math.random;
const floor = Math.floor;

export const TILE_STATUSES = {
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

export const markTile = (tile) => {
    if (
        tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status !== TILE_STATUSES.MARKED
    ) {
        return
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else {
        tile.status = TILE_STATUSES.MARKED;
    }
}

export const nearbyTiles = (board, { x, y }) => {
    const tiles = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            tiles.push(board[x + i]?.[y + j]);
        }
    }

    return tiles.filter(t => t != undefined).filter(t => !(t.x === x && t.y === y));
}

export const revealTile = (board, tile) => {
    if (tile.status != TILE_STATUSES.HIDDEN) return;

    if (tile.mine) return tile.status = TILE_STATUSES.MINE;

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const number = adjacentTiles.filter(t => t.mine).length;

    if (number === 0) {
        adjacentTiles.forEach(t => revealTile(board, t));
    } else {
        tile.element.textContent = number;
    }
}

export const checkWin = (board) => {
    return board.every(row => {
        return row.every(tile => {
            return tile.status == TILE_STATUSES.NUMBER || (tile.mine && (
                tile.status == TILE_STATUSES.MARKED ||
                tile.status == TILE_STATUSES.HIDDEN
            ))
        })
    })
}

export const checkLose = (board) => {
    return board.some(row => {
        return row.some(tile => tile.status === TILE_STATUSES.MINE)
    });
}

export const createBoard = (boardSize, numberOfMines) => {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for (let x = 0; x < boardSize; x++) {
        const row = [];

        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(p => positionMatch(p, { x, y })),
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
