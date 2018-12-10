import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");

class Marker extends Sprite {
    constructor(board, image, name) {
        super();
        this.board = board;
        this.name = name;
        this.setImage(image);
        this.x = 150;
        this.y = 275;
        this.x = this.startX = 150;
        this.y = this.startY = 275;
        this.squareSymbol = this.name.substring(0, 1);
        this.inBoard = false;

    }

    playInSquare(row, col) {
        this.x = this.board.x + col * 150 + 50;
        this.y = this.board.y + row * 150 + 50;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
        this.inBoard = true;


    }
}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", "Princess Ann");
        this.dragging = false;

    }

    handleMouseLeftButtonDown() {
        if (this.inBoard) {
            return;
        }
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        if (this.inBoard) {
            return;
        }
        this.dragging = false;
        let row = Math.floor((this.y - this.board.y) / 150);
        let col = Math.floor((this.x - this.board.x) / 150);
        // window.alert(col);
        if (col < 0 || col > 2 || row < 0 || row > 2 ||
            this.board.getSquareSymbol(row, col) !== this.board.emptySquareSymbol) {
            this.x = this.startX;
            this.y = this.startY;
            return;
        }
        // window.alert(row)
        this.playInSquare(row, col);
        this.board.takeTurns();
    }

    handleGameLoop() {
        if (this.dragging) {
            this.x = game.getMouseX() - this.width / 2;
        }
        if (this.dragging) {
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}
class StrangerMarker extends Marker {
    constructor(board) {
        super(board, 'strangerFace.png', 'Stranger');

    }
    handleGameLoop() {
        if (this.inBoard) {
            return;
        }
        let foundMove = this.findWinningMove();

        if (!foundMove) {
            foundMove = this.findWinningMove(true);
        }

        if (!foundMove) {
            foundMove = this.findForkingMove();
        }

        if (!foundMove) {
            foundMove = this.findForkingMove(true);
        }

        if (!foundMove) {
            foundMove = this.findCenterMove();
        }

        if (!foundMove) {
            foundMove = this.findOppositeCornerMove();
        }

        if (!foundMove) {
            foundMove = this.findAnyCornerMove();
        }

        if (!foundMove) {
            foundMove = this.findAnySideMove();
        }

        if (!foundMove) {
            // Mark a random empty square.
            let row, col;
            do {
                row = Math.round(Math.random() * (this.board.size - 1));
                col = Math.round(Math.random() * (this.board.size - 1));
            }
            while (this.board.dataModel[row][col] !== this.board.emptySquareSymbol);
            this.board.dataModel[row][col] = this.squareSymbol;
            this.playInSquare(row, col);
            foundMove = true;
        }

        if (!foundMove) throw new Error('Failed to find a move.');
        this.board.takeTurns();
        // Mark a random empty square.
    }
    findWinningMove(forOpponent) {
        for (let row = 0; row < this.board.size; row++) {
            for (let col = 0; col < this.board.size; col++) {
                if (this.board.markSquare(row, col, forOpponent)) {
                    if (this.board.gameIsWon()) {
                        this.playInSquare(row, col);
                        return true;
                    }
                    else this.board.unmarkSquare(row, col);
                }
            }
        }

        return false;
    }

    findForkingMove(forOpponent) {
        return false;
    }

    findCenterMove() {
        let center = Math.floor(this.board.size / 2);
        if (this.board.markSquare(center, center)) {
            this.playInSquare(center, center);
            return true;
        }
        return false;
    }
    findOppositeCornerMove() {
        let last = this.board.size - 1;
        let topRight = this.board.getSquareSymbol(0, last);
        let topLeft = this.board.getSquareSymbol(0, 0);
        let bottomRight = this.board.getSquareSymbol(last, last);
        let bottomLeft = this.board.getSquareSymbol(last, 0);

        if (topLeft !== this.squareSymbol &&
            topLeft !== this.board.emptySquareSymbol &&
            this.board.markSquare(last, last)) {
            this.playInSquare(last, last);
            return true;
        }

        if (topRight !== this.squareSymbol &&
            topRight !== this.board.emptySquareSymbol &&
            this.board.markSquare(last, 0)) {
            this.playInSquare(last, 0);
            return true;
        }

        if (bottomLeft !== this.squareSymbol &&
            bottomLeft !== this.board.emptySquareSymbol &&
            this.board.markSquare(0, last)) {
            this.playInSquare(0, last);
            return true;
        }
        if (bottomRight !== this.squareSymbol &&
            bottomRight !== this.board.emptySquareSymbol &&
            this.playInSquare(0, 0)) {
            this.playInSquare(0, 0);
            return true;
        }
        return false;
    }
    findAnyCornerMove() {
        let last = this.board.size - 1;
        if (this.board.markSquare(0, last)) {
            this.playInSquare(0, last);
            return true;
        }
        if (this.board.markSquare(last, 0)) {
            this.playInSquare(last, 0);
            return true;
        }
        if (this.board.markSquare(0, 0)) {
            this.playInSquare(0, 0);
            return true;
        }
        if (this.board.markSquare(last, last)) {
            this.playInSquare(last, last);
            return true;
        }
        return false;
    }

    findAnySideMove() {
        let last = this.board.size - 1;
        // check all interior columns of first row.
        for (let col = 1; col < last; col = col + 1) {
            if (this.board.markSquare(0, col)) {
                this.playInSquare(0, col);
                return true;
            }

        }
        for (let col = 1; col < last; col = col + 1) {
            if (this.board.markSquare(last, col)) {
                this.playInSquare(last, col);
                return true;
            }

            for (let row = 1; row < last; row = row + 1) {
                if (this.board.markSquare(row, 0)) {
                    this.playInSquare(row, 0);
                    return true;
                }

                for (let row = 1; row < last; row = row + 1) {
                    if (this.board.markSquare(row, last)) {
                        this.playInSquare(row, last);
                        return true;
                    }

                }
            }
        }
        return false;
    }
}

class TicTacToe extends Sprite {
    constructor() {
        super();

        this.name = "TicTacToe";
        this.setImage("board.png");
        this.x = 300;
        this.y = 85;
        this.SquareSize = 150;
        this.size = 3;
        this.activeMarker; // variable exists, but value is undefined
        this.emptySquareSymbol = '-';

        this.dataModel = [];
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.size; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }
    }

    getSquareSymbol(row, col) {
        return this.dataModel[row][col];
    }

    markSquare(row, col, forOpponent) {
        let squareSymbol = this.activeMarker.squareSymbol;
        if (forOpponent) {
            squareSymbol = this.squareSymbolForHumanPlayer;
            if (this.getSquareSymbol(row, col) === this.emptySquareSymbol) {
                this.dataModel[row][col] = squareSymbol;
                return true;
            }
            return false;
        }
    }
    unmarkSquare(row, col) {
        this.dataModel[row][col] = this.emptySquareSymbol;
    }
    
    countWinningMoves(forOpponent) {
    let squareSymbol = this.activeMarker.squareSymbol;
    if (forOpponent) {
        squareSymbol = this.squareSymbolForHumanPlayer;
    }

    let winningMoves = 0;

    // check rows
    for (let row = 0; row < this.size; row = row + 1) {
        let emptyCount = 0;
        let markerCount = 0;

        for (let col = 0; col < this.size; col = col + 1) {
            // ADD CODE HERE THAT COUNTS EMPTY SQUARES AND MARKER SQUARES IN THE ROW
        }

        if (emptyCount === 1 && markerCount === 2) {
            winningMoves = winningMoves + 1;
        }
    }

    // check columns
    
    for (let col = 0; col < this.size; col++) {
        let emptyCount = 0;
        let markerCount = 0;
        
        for (let row = 0; row < this.size; row++) {
            if (this.dataModel[row, col] === this.emptySquareSymbol) {
                emptyCount++;
            }
            if(this.dataModel[row, col] === squareSymbol) {
                markerCount++;
            }
        }
        
        if(emptyCount === 1 && markerCount === 2) {
            winningMoves = winningMoves + 1;
        }
    }
    // check first diagonal
    let emptyCount = 0;
    let markerCount = 0;
    
    if (this.getSquareSymbol(0, 0) === this.emptySquareSymbol) {
        emptyCount = emptyCount + 1;
    }
    else if(this.getSquareSymbol(0, 0) === squareSymbol) {
        markerCount = markerCount + 1;
    }
    
    if (this.getSquareSymbol(1, 1) === this.emptySquareSymbol) {
        emptyCount = emptyCount + 1;
    }
    else if (this.getSquareSymbol(1, 1) === squareSymbol) {
        markerCount = markerCount + 1;
    }
    
    if (this.getSquareSymbol(2, 2) === this.emptySquareSymbol) {
        emptyCount = emptyCount + 1;
    }
    else if(this.emptySquareSymbol(2, 2) === squareSymbol) {
        markerCount = markerCount + 1;
    }
    if (emptyCount === 1 && markerCount === 2) {
        winningMoves = winningMoves + 1;
    }
    // check second diagonal

    return winningMoves;
}
    gameIsWon() {
        // Are there three of the same markers diagonally from upper left?
        if (this.dataModel[0][0] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][2] &&
            this.dataModel[2][2] !== this.emptySquareSymbol) {
            return true;
        }
        // Are there three of the same markers diagonally from upper left?
        if (this.dataModel[0][2] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][0] &&
            this.dataModel[2][0] !== this.emptySquareSymbol) {
            return true;
        }
        for (let row = 0; row < this.size; row++) {
            if (this.dataModel[row][0] === this.dataModel[row][1] &&
                this.dataModel[row][1] === this.dataModel[row][2] &&
                this.dataModel[row][2] !== this.emptySquareSymbol) {
                return true;
            }
        }
        for (let col = 0; col < this.size; col++) {
            if (this.dataModel[0][col] === this.dataModel[1][col] &&
                this.dataModel[1][col] === this.dataModel[2][col] &&
                this.dataModel[2][col] !== this.emptySquareSymbol) {
                return true;
            }
        }
        return false;
    }

    gameIsDrawn() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.dataModel[row][col] === this.emptySquareSymbol) {
                    return false;
                }
            }
        }
        return true;
    }
    debugBoard() {
        let boardString = '\n';
        let moveCount = 0;
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
                if (this.dataModel[row][col] != this.emptySquareSymbol) {
                    moveCount++;
                }
            }
            boardString = boardString + '\n';
        }
        console.log('The data model after ' + moveCount + ' move(s):' + boardString);
    }
    takeTurns() {
        if (this.gameIsWon()) {
            let message = '        Game Over.\n        ';
            if (this.activeMarker instanceof PrincessMarker) {
                message = message + 'The Princess wins.';
            }
            else if (this.activeMarker instanceof StrangerMarker) {
                message = message + 'The Stranger wins.';
            }
            game.end(message);
            return;
        }
        if (this.gameIsDrawn()) {
            game.end('        Game Over.\n        The game ends in a draw.');
            return;
        }
        //   this.activeMarker = new PrincessMarker(this);
        if (!this.activeMarker) {

            if (Math.random() < 0.5) {
                this.activeMarker = new PrincessMarker(this);
            }
            else {
                this.activeMarker = new StrangerMarker(this);
            }
        }
        else if (this.activeMarker instanceof PrincessMarker) {
            // princess has moved; now it's stranger's turn
            this.activeMarker = new StrangerMarker(this);
        }
        else if (this.activeMarker instanceof StrangerMarker) {
            // stranger has moved; now it's princess's turn
            this.activeMarker = new PrincessMarker(this);
        }
    }

}
let theBoard = new TicTacToe();
theBoard.takeTurns();
