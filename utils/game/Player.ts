import Actor from "./Actor";
import Match from "./Match";

export default class Player extends Actor {
    private resolver: ((value: [number, number]) => void) | null = null;

    constructor(name: string) {
        super(name);
    }

    async readValidMove(match: Match): Promise<[number, number]> {
        while (true) {
            const [row, column] = await new Promise<[number, number]>((resolve) => {
                this.resolver = resolve;
            });

            if (match.isValidMove(row, column)) {
                this.resolver = null;
                return [row, column];
            }
        }
    }

    public handlePress(match: Match, pressedRowIndex: number, pressedColumnIndex: number) {
        if (match.hasMatchEnded() || !match.isValidMove(pressedRowIndex, pressedColumnIndex))
            return;

        if (this.resolver)
            this.resolver([pressedRowIndex, pressedColumnIndex]);
    }
};


