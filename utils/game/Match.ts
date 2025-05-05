import { Cell } from "@/constants/game";
import Actor from "./Actor";
import Board from "./Board";

export default class Match {
    private board: Board;
    private turn: number;

    public constructor(
        private readonly players: Actor[]
    ) {
        this.board = new Board();
        this.turn = 0;
    }

    private hasWinner(): boolean {
        return this.board.getWinner() !== null;
    }

    public hasMatchEnded() {
        return this.hasWinner() || this.board.isFull();
    }

    public getCurrentPlayer() {
        return this.players[this.turn % this.players.length];
    }

    public getCurrentSymbol() {
        return this.turn % this.players.length
            ? Cell.O : Cell.X;
    }

    public getBoard(): Board {
        return this.board;
    }

    public getWinner(): Actor | null {
        if (this.hasWinner())
            return this.players[this.turn % this.players.length];

        if (this.board.isFull())
            return null;

        throw new Error("This match has not ended.");
    }

    public isValidMove(row: number | null, column: number | null) {
        if (this.hasMatchEnded())
            throw new Error("This match has already ended.");

        return row !== null
            && column !== null
            && this.board.isValidMove(row, column);
    }

    public move(row: number, column: number): boolean {
        if (this.hasMatchEnded())
            throw new Error("This match has already ended.");

        if (!this.board.isCellEmpty(row, column))
            throw new Error("This cell is already occupied.");

        if (!this.board.isValidMove(row, column))
            throw new Error("This move is not valid.");


        this.board.setCell(row, column, this.getCurrentSymbol());

        const ended = this.hasMatchEnded();

        if (!ended)
            this.turn++;

        return ended;
    }

    public toString() {
        return this.board.toString();
    }
};

