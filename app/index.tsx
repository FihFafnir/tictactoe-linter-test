import { CPU } from "@/utils/cpu/CPU";
import Board from "@/utils/game/Board";
import CellPressable from "@/components/Cell";
import Match from "@/utils/game/Match";
import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";
import Player from "@/utils/game/Player";
import { convertCellToSymbol, TicTacToeSymbol } from "@/constants/game";


const player = new Player("Jogador");
const cpu = new CPU("CPU", 300);
const actors = [player, cpu];

function shuffle<T>(arr: T[]): T[] {
    const copy = arr.slice();
    let remaining = copy.length;

    while (remaining > 0) {
        const index = Math.floor(Math.random() * remaining--);
        [copy[remaining], copy[index]] = [
            copy[index], copy[remaining]];
    }

    return copy;
}

function createEmptyBoard() {
    return Array.from({
        length: 3
    }, () => new Array(3).fill(TicTacToeSymbol.EMPTY));
}

export default function TicTacToe() {
    const [board, setBoard] = useState<TicTacToeSymbol[][]>(createEmptyBoard());
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentSymbol, setCurrentSymbol] = useState<string>();
    const [scores, setScores] = useState<{ player: number, cpu: number }>({ player: 0, cpu: 0 });

    const renderBoard = (board: Board) =>
        setBoard(board.map(row =>
            row.map(cell =>
                convertCellToSymbol(cell))));

    const currentMatch = () => matches.length ? matches[matches.length - 1] : null;

    const startMatch = async () => {
        const match = new Match(shuffle(actors));
        match.getBoard().subscribe(renderBoard);

        setMatches(matches => [...matches, match]);

        while (!match.hasMatchEnded()) {
            const player = match.getCurrentPlayer();
            const symbol = match.getCurrentSymbol();
            setCurrentSymbol(`${player.name} - ${convertCellToSymbol(symbol)}`);

            const [row, column] = await player.readValidMove(match);
            match.move(row, column);
        }

        const winner = match.getWinner();

        if (winner)
            winner.points++;

        setScores({
            player: player.points,
            cpu: cpu.points
        });
    };

    const handlePress = (rowIndex: number, columnIndex: number) => {
        if (currentMatch() === null || currentMatch()?.hasMatchEnded())
            startMatch();

        if (currentMatch() && player instanceof Player)
            player.handlePress(currentMatch()!, rowIndex, columnIndex);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tic Tac Toe</Text>
            <View style={styles.infoRow}>
                <Text style={styles.subtitle}>Turno: {currentSymbol}</Text>
                <Text style={styles.score}>Placar - Jogador: {scores.player} | CPU: {scores.cpu}</Text>
            </View>
            <View style={styles.board}>
                {board.map((row, rowIndex) => (
                    <View style={styles.row} key={rowIndex}>
                        {row.map((cell, columnIndex) => (
                            <CellPressable
                                key={columnIndex}
                                content={cell}
                                onPress={() => handlePress(rowIndex, columnIndex)} />
                        ))}
                    </View>
                ))}
            </View>
            <Pressable style={styles.resetButton} onPress={startMatch}>
                <Text style={styles.resetText}>Reiniciar Jogo</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 36,
        width: "100%",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: "#666",
    },
    score: {
        fontSize: 18,
        fontWeight: "bold",
    },
    board: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        maxWidth: 100,
        width: Dimensions.get("screen").width * 0.2,
        aspectRatio: 1,
        margin: 4,
        borderRadius: 8,
        backgroundColor: "#EFEFF4",
        justifyContent: "center",
        alignItems: "center",
    },
    cellPressed: {
        backgroundColor: "#D1D1D6",
    },
    cellOccupied: {
        backgroundColor: "#FFFFFF",
    },
    cellContent: {
        fontSize: 48,
    },
    resetButton: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    resetText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
