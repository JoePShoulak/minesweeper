import { createBoard, markTile, revealTile, checkWin, checkLose, TILE_STATUSES } from "./minesweeper.js";

const BOARD_SIZE = 13;
const NUMBER_OF_MINES = 13;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector('.subtext');

board.forEach(row => {
    row.forEach(tile => {
        boardElement.appendChild(tile.element);

        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd();
        })

        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        })
    })
})

const listMinesLeft = () => {
    const markedTileCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTileCount;
}

const stopProp = (e) => {
    e.stopImmediatePropagation();
}

const checkGameEnd = () => {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})

        if (win) {
            messageText.textContent = "You won!"

            board.forEach(row => row.forEach(tile => {
                if (tile.mine && tile.status === TILE_STATUSES.HIDDEN) markTile(tile);
            }));
        } else {
            messageText.textContent = "You lost!"

            board.forEach(row => row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if (tile.mine) revealTile(board, tile)
            }));
        }
    }
}

boardElement.style.setProperty('--size', BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;
