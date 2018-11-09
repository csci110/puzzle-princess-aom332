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
        this.row;
        this.row = Math.floor(0, 3);
        window.alert("The row number is " + row);
    
        
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
