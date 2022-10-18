import { positionMatch } from "./helper.js";

export class Tile {
    static statuses = {
        HIDDEN: 'hidden',
        MINE: 'mine',
        NUMBER: 'number',
        MARKED: 'marked'
    }

    constructor(board, x, y) {
        this.element = document.createElement('div');
        this.element.dataset.status = Tile.statuses.HIDDEN;
        this.x = x,
        this.y = y,
        this.board = board;
        this.mine = this.board.minePositions.some(p => positionMatch(p, { x, y }))
    }

    mark = () => {
        if (
            this.status !== Tile.statuses.HIDDEN &&
            this.status !== Tile.statuses.MARKED
        ) {
            return
        }
    
        if (this.status === Tile.statuses.MARKED) {
            this.status = Tile.statuses.HIDDEN;
        } else {
            this.status = Tile.statuses.MARKED;
        }    
    }

    is = (status) => {
        return this.status == status;
    }

    get status() {
        return this.element.dataset.status;
    }

    set status(value) {
        this.element.dataset.status = value;
    }

    nearby = () => {
        const tiles = [];
    
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                tiles.push(this.board.tiles[this.x + i]?.[this.y + j]);
            }
        }
    
        return tiles.filter(t => t != undefined).filter(t => !(t.x === this.x && t.y === this.y));
    }

    reveal = () => {
        if (!this.is(Tile.statuses.HIDDEN)) return;

        if (this.mine) return this.status = Tile.statuses.MINE;

        this.status = Tile.statuses.NUMBER;
        const adjacentTiles = this.nearby();
        const number = adjacentTiles.filter(t => t.mine).length;

        if (number === 0) {
            adjacentTiles.forEach(t => t.reveal());
        } else {
            this.element.textContent = number;
        }
    } 
}