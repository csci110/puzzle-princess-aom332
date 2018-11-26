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
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * 150 + 50;
        this.y = this.board.y + row * 150 + 50;
 
    }
}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", "Princess Ann");
        this.dragging = false;

    }

    handleMouseLeftButtonDown() {
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        this.dragging = false;

        let col = Math.floor((this.x - this.board.x) / 150);
        // window.alert(col);
        if (col < 0 || col > 2) {
            this.startY;
            return;
        }
        let row = Math.floor((this.y - this.board.y) / 150);
        // window.alert(row)
        if (row < 0 || row > 2) {
            this.x = this.startX;
            return;
        }
        this.playInSquare(row, col);
        
        
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
class StrangerMarker extends Marker {}

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

    }
    takeTurns() {
        this.activeMarker = new PrincessMarker(this);
    }
}
let theBoard = new TicTacToe();
theBoard.takeTurns();
