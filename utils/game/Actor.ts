import Match from "./Match";

export default abstract class Actor {
    public constructor(
        public readonly name: string,
        public points: number = 0
    ) { }

    abstract readValidMove(match: Match): Promise<[number, number]>;
}
