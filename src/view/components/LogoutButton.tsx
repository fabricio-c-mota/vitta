import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "@/view/themes/theme";

type LogoutButtonProps = {
    onPress: () => void | Promise<void>;
    color?: string;
    size?: number;
};

export default function LogoutButton({
    onPress,
    color = colors.text,
    size = 22,
}: LogoutButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Feather name="log-out" size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: spacing.xs,
    },
});
