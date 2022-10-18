import { positionMatch, randomNumber } from "./helper.js";
import { Tile } from "./Tile.js";

export class Board {
    constructor(size, mineCount) {
        this.size = size;
        this.mineCount = mineCount;

        this.tiles = [];
        this.minePositions = this.getMinePositions();

        this.element = document.createElement('div');
        this.element.classList.add('board');
        document.body.appendChild(this.element);
    
        for (let x = 0; x < size; x++) {
            const row = [];
    
            for (let y = 0; y < size; y++) {
                const element = document.createElement('div');
                element.dataset.status = Tile.statuses.HIDDEN;
    
                const tile = new Tile(this, x, y);
    
                row.push(tile);
            }
    
            this.tiles.push(row);
        }
    }

    markCount = () => {
        return this.tiles.reduce((count, row) => {
            return count + row.filter(tile => tile.status === Tile.statuses.MARKED).length;
        }, 0)
    }

    getMinePositions = () => {
        const positions = [];
    
        while (positions.length < this.mineCount) {
            const newPos = {
                x: randomNumber(this.size),
                y: randomNumber(this.size),
            }
    
            if (!positions.some(p => positionMatch(p, newPos))) {
                positions.push(newPos);
            }
        }
    
        return positions;
    }

    checkWin = () => {
        return this.tiles.every(row => {
            return row.every(tile => {
                return tile.is(Tile.statuses.NUMBER) || (tile.mine && (
                    tile.is(Tile.statuses.MARKED) ||
                    tile.is(Tile.statuses.HIDDEN)
                ))
            })
        })
    }
    
    checkLose = () => {
        return this.tiles.some(row => {
            return row.some(tile => tile.status === Tile.statuses.MINE)
        });
    }
}