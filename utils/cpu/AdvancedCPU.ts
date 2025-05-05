import { Cell } from "@/constants/game";
import Actor from "../game/Actor";
import Board from "../game/Board";
import Match from "../game/Match";

export class AdvancedCPU extends Actor {
    public constructor(
        name: string,
        private readonly delay: number = 0,
        private readonly difficultyOffset = 0
    ) {
        super(name);
    }

    public async readValidMove(match: Match): Promise<[number, number]> {
        const board = match.getBoard();
        const symbol = match.getCurrentSymbol();
        const opponent = symbol === Cell.X ? Cell.O : Cell.X;
        const moves = board.getValidMoves();

        const scored = moves.map(([row, column]): { move: [number, number], score: number } => {
            board.setCell(row, column, symbol);
            const score = this.minimax(board, 0, false, symbol, opponent, -Infinity, Infinity);
            board.setCell(row, column, Cell.EMPTY);

            return { move: [row, column], score };
        });

        const bestScore = Math.max(...scored.map(({ score }) => score));
        const candidates = scored
            .filter(({ score }) => score >= bestScore - this.difficultyOffset)
            .map(({ move }) => move);

        await new Promise<void>(resolve => setTimeout(() => resolve(), this.delay));

        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    private minimax(
        board: Board,
        depth: number,
        isMax: boolean,
        symbol: Cell,
        opponent: Cell,
        alpha: number,
        beta: number
    ): number {
        const winner = board.getWinner();
        const moves = board.getValidMoves();

        if (winner === symbol)
            return 10 - depth;

        if (winner === opponent)
            return -10 + depth;

        if (moves.length === 0)
            return 0;


        const init = {
            best: isMax ? -Infinity : Infinity,
            a: alpha,
            b: beta,
        };

        const { best } = moves.reduce(({ best, a, b }, [r, c]) => {
            // poda α–β
            if (b <= a)
                return { best, a, b };

            board.setCell(r, c, isMax ? symbol : opponent, false);
            const val = this.minimax(board, depth + 1, !isMax, symbol, opponent, a, b);
            board.setCell(r, c, Cell.EMPTY, false);

            const newBest = isMax ? Math.max(best, val) : Math.min(best, val);
            const newA = isMax ? Math.max(a, val) : a;
            const newB = isMax ? b : Math.min(b, val);

            return { best: newBest, a: newA, b: newB };
        }, init);

        return best;
    }
};

