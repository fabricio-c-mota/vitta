import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardTypeOptions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing, fontSizes, borderRadius } from "@/view/themes/theme";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type TextInputFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: FeatherIconName;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function TextInputField({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "sentences",
}: TextInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry;
    const passwordAutoCapitalize = isPassword ? "none" : autoCapitalize;
    const passwordAutoComplete = isPassword ? "password" : undefined;
    const passwordTextContentType = isPassword ? "password" : undefined;

    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <Feather name={icon} size={20} color={colors.primary} style={styles.leftIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType={keyboardType}
                    autoCapitalize={passwordAutoCapitalize}
                    secureTextEntry={isPassword && !showPassword}
                    value={value}
                    onChangeText={onChangeText}
                    autoComplete={passwordAutoComplete}
                    textContentType={passwordTextContentType}
                    autoCorrect={!isPassword}
                    importantForAutofill={isPassword ? "no" : undefined}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                        style={styles.rightIconButton}
                    >
                        <Feather
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldWrapper: {
        marginBottom: spacing.xs,
    },
    label: {
        fontSize: fontSizes.sm + 2,
        color: colors.text,
        marginBottom: spacing.sm,
        fontFamily: fonts.regular,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputBackground,
        borderRadius: borderRadius.lg + 2,
        paddingHorizontal: spacing.md,
        height: 60,
    },
    leftIcon: {
        marginRight: spacing.sm + 4,
    },
    input: {
        flex: 1,
        fontSize: fontSizes.md,
        color: colors.text,
        fontFamily: fonts.regular,
    },
    rightIconButton: {
        marginLeft: spacing.sm + 4,
    },
});
