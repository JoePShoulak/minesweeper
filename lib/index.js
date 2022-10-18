
import { createBoard } from "./minesweeper.js";

const board = createBoard(2, 2);
const boardElement = document.querySelector('.board');

board.forEach(row => {
    row.forEach(tile => {
        boardElement.appendChild(tile.element);
    })
})

console.log(board)
