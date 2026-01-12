import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, fonts, spacing, fontSizes } from "@/view/themes/theme";

type Props = {
    processing: boolean;
    onCancel: () => void;
};

export default function AppointmentDetailsActionBar({ processing, onCancel }: Props) {
    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={onCancel}
                disabled={processing}
            >
                {processing ? (
                    <ActivityIndicator color={colors.background} />
                ) : (
                    <Text style={styles.actionText} maxFontSizeMultiplier={1.2}>Cancelar Consulta</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.06)",
        flexDirection: "row",
        gap: spacing.md,
    },
    actionButton: {
        flex: 1,
        minHeight: 60,
        borderRadius: 30,
        paddingVertical: spacing.md,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 14,
        elevation: 4,
    },
    cancelButton: {
        backgroundColor: colors.error,
    },
    actionText: {
        color: colors.background,
        fontSize: fontSizes.lg,
        fontFamily: fonts.bold,
    },
});
