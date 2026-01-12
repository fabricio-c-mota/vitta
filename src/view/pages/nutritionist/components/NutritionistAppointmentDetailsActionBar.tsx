import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, fontSizes, fonts, spacing } from "@/view/themes/theme";

type ConfirmVariant = "accept" | "reject" | "cancel" | "reactivate";

type Props = {
    canHandle: boolean;
    canCancel: boolean;
    canReactivate: boolean;
    processing: boolean;
    confirmVariant: ConfirmVariant;
    onAccept: () => void;
    onReject: () => void;
    onCancel: () => void;
    onReactivate: () => void;
};

export default function NutritionistAppointmentDetailsActionBar({
    canHandle,
    canCancel,
    canReactivate,
    processing,
    confirmVariant,
    onAccept,
    onReject,
    onCancel,
    onReactivate,
}: Props) {
    if (canHandle) {
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={onReject}
                    disabled={processing}
                    activeOpacity={0.9}
                >
                    {processing && confirmVariant === "reject" ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.actionText} maxFontSizeMultiplier={1.2}>Recusar</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={onAccept}
                    disabled={processing}
                    activeOpacity={0.9}
                >
                    {processing && confirmVariant === "accept" ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.actionText} maxFontSizeMultiplier={1.2}>Aceitar</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    if (canCancel) {
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={onCancel}
                    disabled={processing}
                    activeOpacity={0.9}
                >
                    {processing && confirmVariant === "cancel" ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.actionText} maxFontSizeMultiplier={1.2}>Cancelar Consulta</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={onReactivate}
                disabled={processing}
                activeOpacity={0.9}
            >
                {processing && confirmVariant === "reactivate" ? (
                    <ActivityIndicator color={colors.background} />
                ) : (
                    <Text style={styles.actionText} maxFontSizeMultiplier={1.2}>Aceitar</Text>
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
        paddingVertical: spacing.md,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 14,
        elevation: 4,
    },
    acceptButton: {
        backgroundColor: colors.primary,
    },
    rejectButton: {
        backgroundColor: colors.error,
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
