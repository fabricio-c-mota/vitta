import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, spacing, fontSizes } from "@/view/themes/theme";
import ScreenHeader from "@/view/components/ScreenHeader";
import TextInputField from "@/view/pages/auth/components/TextInputField";
import AlertModal from "@/view/components/AlertModal";
import { useAuthLoginViewModel } from "@/di/container";
import useRedirectEffect from "@/view/hooks/useRedirectEffect";

export default function ForgotPasswordScreen() {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState("");
    const {
        emailError,
        resetLoading,
        resetSuccess,
        navigationRoute,
        navigationMethod,
        resetPassword,
        clearError,
        clearResetSuccess,
        goToLogin,
        clearNavigation,
    } = useAuthLoginViewModel();

    useRedirectEffect(navigationRoute, { method: navigationMethod, onComplete: clearNavigation });

    useEffect(() => {
        if (resetSuccess) {
            const timer = setTimeout(() => {
                clearResetSuccess();
                goToLogin();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [resetSuccess, clearResetSuccess, goToLogin]);

    async function handleSubmit() {
        await resetPassword(email);
    }

    function handleEmailChange(value: string) {
        setEmail(value);
        clearError();
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                    <ScreenHeader title="Recuperar Senha" />

                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <Text style={styles.title} maxFontSizeMultiplier={1.2}>Esqueceu sua senha?</Text>
                            <Text style={styles.subtitle}>
                                Informe seu e-mail para enviarmos um link de redefinição.
                            </Text>

                            <TextInputField
                                label="E-mail"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChangeText={handleEmailChange}
                                icon="mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                textContentType="emailAddress"
                                error={emailError ?? undefined}
                                hasError={!!emailError}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[styles.submitButton, resetLoading && styles.submitDisabled]}
                            onPress={handleSubmit}
                            disabled={resetLoading}
                            activeOpacity={0.9}
                        >
                            {resetLoading ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <Text style={styles.submitText} maxFontSizeMultiplier={1.2}>Enviar link</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <AlertModal
                        visible={!!resetSuccess}
                        title="Email enviado"
                        message={resetSuccess ?? undefined}
                        variant="success"
                        onConfirm={() => {
                            clearResetSuccess();
                            goToLogin();
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.surface,
        flexDirection: "column",
    },

    scrollContent: {
        flex: 1,
    },

    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },

    title: {
        fontSize: fontSizes.xl2,
        fontFamily: fonts.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    subtitle: {
        fontSize: fontSizes.md,
        fontFamily: fonts.regular,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },

    bottomBar: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.06)",
    },

    submitButton: {
        minHeight: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 14,
        elevation: 4,
    },

    submitDisabled: {
        opacity: 0.7,
    },

    submitText: {
        color: colors.background,
        fontSize: fontSizes.mdLg,
        fontFamily: fonts.bold,
    },
});
