import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { colors, fonts, fontSizes, spacing } from "@/view/themes/theme";

type LoadingIndicatorProps = {
    message?: string;
    size?: "small" | "large";
    color?: string;
    fullScreen?: boolean;
};

export default function LoadingIndicator({
    message,
    size = "large",
    color = colors.primary,
    fullScreen = false,
}: LoadingIndicatorProps) {
    if (fullScreen) {
        return (
            <View style={styles.fullScreenContainer}>
                <ActivityIndicator size={size} color={color} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    message: {
        marginTop: spacing.md,
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        fontFamily: fonts.regular,
    },
});
