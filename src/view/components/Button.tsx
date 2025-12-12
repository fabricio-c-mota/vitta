import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from "react-native";
import { colors, fonts, fontSizes, borderRadius } from "@/view/themes/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function Button({
    title,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
    style,
    textStyle,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const buttonStyles = [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text` as keyof typeof styles],
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "primary" ? colors.white : colors.primary}
                />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 56,
        borderRadius: borderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.primaryLight,
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: "transparent",
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontSize: fontSizes.md,
        fontFamily: fonts.bold,
    },
    primaryText: {
        color: colors.white,
    },
    secondaryText: {
        color: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    ghostText: {
        color: colors.primary,
    },
});
