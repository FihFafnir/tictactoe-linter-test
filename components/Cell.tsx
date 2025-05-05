import { TicTacToeSymbol } from "@/constants/game";
import React from "react";
import { StyleSheet, Pressable, Text, Dimensions } from "react-native";

type CellProps = {
    content: TicTacToeSymbol;
    onPress: () => void;
};

export default function Cell({ content, onPress }: CellProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.cell,
                pressed && styles.pressed,
                content !== TicTacToeSymbol.EMPTY && styles.occupied,
            ]}
            onPress={onPress}
        >
            <Text style={styles.content}>{content}</Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
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
    pressed: {
        backgroundColor: "#D1D1D6",
    },
    occupied: {
        backgroundColor: "#FFFFFF",
    },
    content: {
        fontSize: 48,
    },
});
