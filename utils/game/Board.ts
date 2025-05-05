import { Cell } from "@/constants/game";

export default class Board {
    private observers: ((board: Board) => void)[];

    public constructor(
        private board: Cell[][] = Array.from({
            length: 3
        }, () => Array(3).fill(Cell.EMPTY))
    ) {
        this.board = board.map((row) => row.slice());
        this.observers = [];
    }

    private propagate() {
        for (const callback of this.observers)
            callback(this);
    }

    public subscribe(callback: (board: Board) => void) {
        this.observers.push(callback);

        callback(this);
    }

    public unsubscribeAll() {
        this.observers = [];
    }

    public getRowsLength() {
        return this.board.length;
    }

    public getColumnsLength() {
        return this.board[0].length;
    }

    public getCellsLength() {
        return this.getRowsLength() * this.getColumnsLength();
    }

    public getValidMoves(): [number, number][] {
        const positions = this.board.flatMap((row, rowIndex) => row
            .map((_, columnIndex): [number, number] => [rowIndex, columnIndex]));
        return positions.filter(([row, column]) => this.isValidMove(row, column));
    }

    public getWinner(): Cell | null {
        const rowsLength = this.getRowsLength();
        const columnsLength = this.getColumnsLength();

        const rows: [number, number][][] = Array.from({ length: rowsLength },
            (_, row) => Array.from({ length: columnsLength }, (_, column) => [row, column]));
        const columns: [number, number][][] = Array.from({ length: columnsLength },
            (_, column) => Array.from({ length: rowsLength }, (_, row) => [row, column]));
        const diagonals: [number, number][][] = [
            Array.from({ length: rowsLength }, (_, i) => [i, i]),
            Array.from({ length: rowsLength }, (_, i) => [i, columnsLength - 1 - i])
        ];
        const lines = [...rows, ...columns, ...diagonals];

        if (lines.some(line => this.areCellsEqual(line, Cell.O)))
            return Cell.O;

        if (lines.some(line => this.areCellsEqual(line, Cell.X)))
            return Cell.X;

        return null;
    }

    public isValidMove(row: number, column: number) {
        return row >= 0 && column >= 0
            && row < this.board.length && column < this.board[row].length
            && this.isCellEmpty(row, column);
    }

    public isCellEmpty(row: number, column: number) {
        return this.board[row][column] === Cell.EMPTY;
    }

    public isFull() {
        return !this.board.some(row => row.some(cell => cell === Cell.EMPTY));
    }

    public setCell(row: number, column: number, value: Cell, propagate: boolean = true) {
        this.board[row][column] = value;

        if (propagate)
            this.propagate();
    }

    public countSymbol(positions: [number, number][], symbol: Cell) {
        return positions.filter(([row, column]) => this.board[row][column] === symbol).length;
    }

    public areCellsEqual(positions: [number, number][], symbol: Cell | null = null): boolean {
        if (symbol === null)
            return this.areCellsEqual(positions, Cell.O) || this.areCellsEqual(positions, Cell.X);
        return this.countSymbol(positions, symbol) === positions.length;
    }

    public map<T>(callbackfn: (value: Cell[], index: number, array: Cell[][]) => T[]): T[][] {
        return this.board.map(callbackfn);
    }

    public toString() {
        return this.board
            .map(row => row
                .map(cell => cell.toString()).join("|"))
            .join("\n");
    }
};

