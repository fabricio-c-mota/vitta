import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, fontSizes, spacing, borderRadius } from "@/view/themes/theme";

type ErrorMessageProps = {
    message: string;
    onRetry?: () => void;
    retryLabel?: string;
};

export default function ErrorMessage({
    message,
    onRetry,
    retryLabel = "Tentar novamente",
}: ErrorMessageProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Feather name="alert-circle" size={24} color={colors.error} />
            </View>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Feather name="refresh-cw" size={16} color={colors.primary} />
                    <Text style={styles.retryText}>{retryLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.error + "15",
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: "center",
    },
    iconWrapper: {
        marginBottom: spacing.sm,
    },
    message: {
        fontSize: fontSizes.sm + 2,
        color: colors.error,
        fontFamily: fonts.regular,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    retryButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    retryText: {
        fontSize: fontSizes.sm + 2,
        color: colors.primary,
        fontFamily: fonts.medium,
    },
});
