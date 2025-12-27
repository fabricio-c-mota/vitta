import AuthError from "@/model/errors/authError";
import ValidationError from "@/model/errors/validationError";
import RepositoryError from "@/model/errors/repositoryError";

type FieldErrors = {
    emailError: string | null;
    passwordError: string | null;
};

type LoginErrorResult = FieldErrors & {
    error: string | null;
};

export function validateLoginInputs(email: string, password: string): FieldErrors & {
    trimmedEmail: string;
    trimmedPassword: string;
    isValid: boolean;
} {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const hasEmail = trimmedEmail.length > 0;
    const hasPassword = trimmedPassword.length > 0;

    return {
        trimmedEmail,
        trimmedPassword,
        isValid: hasEmail && hasPassword,
        emailError: hasEmail ? null : "Email é obrigatório",
        passwordError: hasPassword ? null : "Senha é obrigatória",
    };
}

export function resolveLoginError(error: unknown): LoginErrorResult {
    if (error instanceof ValidationError) {
        if (error.message.toLowerCase().includes("email")) {
            return { emailError: error.message, passwordError: null, error: null };
        }
        if (error.message.toLowerCase().includes("senha")) {
            return { emailError: null, passwordError: error.message, error: null };
        }
        return { emailError: null, passwordError: null, error: error.message };
    }

    if (error instanceof AuthError || error instanceof RepositoryError) {
        return { emailError: null, passwordError: null, error: error.message };
    }

    return { emailError: null, passwordError: null, error: "Erro desconhecido ao fazer login" };
}

export function resolveResetPasswordError(error: unknown): string {
    if (error instanceof ValidationError || error instanceof AuthError || error instanceof RepositoryError) {
        return error.message;
    }
    return "Não foi possível enviar o email de recuperação.";
}
