export enum Cell {
    EMPTY = " ",
    X = "X",
    O = "O"
};

export enum TicTacToeSymbol {
    EMPTY = " ",
    X = "❌",
    O = "⭕️",
}

export function convertCellToSymbol(cell: Cell): TicTacToeSymbol {
    if (cell === Cell.X)
        return TicTacToeSymbol.X;
    if (cell === Cell.O)
        return TicTacToeSymbol.O;
    return TicTacToeSymbol.EMPTY;
};
