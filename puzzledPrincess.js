import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");

class Marker extends Sprite {
    constructor(board, image, name) {
        super();
        this.board = board;
        this.name = name;
        this.setImage = image;
        this.x = 150;
        this.y = 275;
        
    }
}
class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", "Princess ANn");
        this.dragging = false;
    }
}
class StrangerMarker extends Marker {}

class TicTacToe extends Sprite {
    constructor() {
        super();

        this.name = "TicTacToe";
        this.setImage = ("board.png");
        this.x = 300;
        this.y = 85;
        this.SquareSize = 150;
        this.size = 3;
        this.activeMarker; // variable exists, but value is undefined
        
    }
    takeTurns() {
        this.activeMarker = this.PrincessMarker(this);
    }
}
let theBoard = new TicTacToe();
theBoard.takeTurns();
