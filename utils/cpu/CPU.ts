import { Cell } from "@/constants/game";
import Actor from "../game/Actor";
import Board from "../game/Board";
import Match from "../game/Match";

export class CPU extends Actor {
    public constructor(
        name: string,
        private readonly delay: number = 0,
        private readonly difficultyOffset: number = 0
    ) {
        super(name);
    }

    private avaliableBoard(board: Board, symbol: Cell) {
        const rowsLength = board.getRowsLength();
        const columnsLength = board.getColumnsLength();

        const rows: [number, number][][] = Array.from({ length: rowsLength },
            (_, row) => Array.from({ length: columnsLength }, (_, column) => [row, column]));
        const columns: [number, number][][] = Array.from({ length: columnsLength },
            (_, column) => Array.from({ length: rowsLength }, (_, row) => [row, column]));
        const diagonals: [number, number][][] = [
            Array.from({ length: rowsLength }, (_, i) => [i, i]),
            Array.from({ length: rowsLength }, (_, i) => [i, columnsLength - 1 - i])
        ];


        const lines = [...rows, ...columns, ...diagonals];

        let score = 0;
        for (const line of lines) {
            const symbolCount = board.countSymbol(line, symbol);
            const emptyCount = board.countSymbol(line, Cell.EMPTY);
            const opponentCount = line.length - symbolCount - emptyCount;

            if (symbolCount === line.length)
                return 10;

            if (opponentCount === line.length)
                return -10;

            score += (symbolCount > 0 && opponentCount === 0) ? symbolCount
                : (opponentCount > 0 && symbolCount === 0) ? -opponentCount
                    : 0;
        }
        return score;
    }

    public async readValidMove(match: Match): Promise<[number, number]> {
        const board = match.getBoard();
        const symbol = match.getCurrentSymbol();
        const moves = board.getValidMoves();

        const scored = moves.map(([row, column]): { move: [number, number], score: number } => {
            board.setCell(row, column, symbol, false);
            const score = this.avaliableBoard(board, symbol);
            board.setCell(row, column, Cell.EMPTY, false);

            return { move: [row, column], score };
        });

        const bestScore = scored.reduce((max, { score }) => Math.max(max, score), -Infinity);
        const candidates = scored
            .filter(({ score }) => score >= bestScore - this.difficultyOffset)
            .map(({ move }) => move);

        await new Promise<void>(resolve => setTimeout(() => resolve(), this.delay));

        return candidates[Math.floor(Math.random() * candidates.length)];
    }
};


