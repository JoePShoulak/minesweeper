import { Board } from "./lib/Board.js";
import { Tile } from "./lib/Tile.js";

const onMobile = () => Math.min(window.screen.width, window.screen.height) < 768;
// FIXME if on mobile 
const DIFFICULTY  = .15 // 15% of tiles are mines. .2 seems pretty tough
const BOARD_SIZE = onMobile() ? 6 : 13;
// TODO: Scale tile-text with tile-size
const TILE_SIZE = 60; // default was 60px
const NUMBER_OF_MINES = Math.floor(BOARD_SIZE**2*DIFFICULTY);

const board = new Board(BOARD_SIZE, NUMBER_OF_MINES);
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector('.subtext');

board.tiles.forEach(row => {
    row.forEach(tile => {
        board.element.appendChild(tile.element);

        tile.element.addEventListener('click', () => {
            tile.reveal();
            checkGameEnd(board);
        })

        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            tile.mark();
            listMinesLeft(board);
        })
    })
})

const listMinesLeft = (board) => {
    minesLeftText.textContent = NUMBER_OF_MINES - board.markCount();
}

const stopProp = (e) => {
    e.stopImmediatePropagation();
}

const checkGameEnd = (board) => {
    const win = board.checkWin();
    const lose = board.checkLose();

    if (win || lose) {
        board.element.addEventListener('click', stopProp, {capture: true})
        board.element.addEventListener('contextmenu', stopProp, {capture: true})

        if (win) {
            messageText.textContent = "You won!"

            board.tiles.forEach(row => row.forEach(tile => {
                if (tile.mine && tile.is(Tile.statuses.HIDDEN)) tile.mark();
            }));
        } else {
            messageText.textContent = "You lost!"

            board.tiles.forEach(row => row.forEach(tile => {
                if (tile.is(Tile.statuses.MARKED)) tile.mark();
                if (tile.mine) tile.reveal();
            }));
        }
    }
}

board.element.style.setProperty('--size', BOARD_SIZE);
board.element.style.setProperty('--tile-size', `${TILE_SIZE}px`);
minesLeftText.textContent = NUMBER_OF_MINES;
