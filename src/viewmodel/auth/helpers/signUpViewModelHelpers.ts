import AuthError from "@/model/errors/authError";
import ValidationError from "@/model/errors/validationError";
import RepositoryError from "@/model/errors/repositoryError";

export type SignUpFieldErrors = {
    nameError: string | null;
    emailError: string | null;
    passwordError: string | null;
    confirmPasswordError: string | null;
    formError: string | null;
};

export function validateSignUpInputs(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
): { trimmedName: string; trimmedEmail: string; trimmedPassword: string; trimmedConfirm: string; errors: SignUpFieldErrors } {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    const errors: SignUpFieldErrors = {
        nameError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
        formError: null,
    };

    if (!trimmedName) {
        errors.nameError = "Nome é obrigatório";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (!trimmedEmail) {
        errors.emailError = "Email é obrigatório";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (!isEmailValid) {
        errors.emailError = "Email inválido";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (!trimmedPassword) {
        errors.passwordError = "Senha é obrigatória";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (trimmedPassword.length < 6) {
        errors.passwordError = "Senha deve ter pelo menos 6 caracteres";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (!trimmedConfirm) {
        errors.confirmPasswordError = "Confirme sua senha";
        return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
    }

    if (trimmedPassword !== trimmedConfirm) {
        errors.confirmPasswordError = "As senhas não coincidem";
    }

    return { trimmedName, trimmedEmail, trimmedPassword, trimmedConfirm, errors };
}

export function resolveSignUpError(error: unknown): SignUpFieldErrors {
    const defaults: SignUpFieldErrors = {
        nameError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
        formError: null,
    };

    if (error instanceof ValidationError) {
        if (error.message.toLowerCase().includes("nome")) {
            return { ...defaults, nameError: error.message };
        }
        if (error.message.toLowerCase().includes("email")) {
            return { ...defaults, emailError: error.message };
        }
        if (error.message.toLowerCase().includes("senha")) {
            return { ...defaults, passwordError: error.message };
        }
        return { ...defaults, formError: error.message };
    }

    if (error instanceof AuthError) {
        return { ...defaults, emailError: error.message };
    }

    if (error instanceof RepositoryError) {
        return { ...defaults, formError: error.message };
    }

    if (error instanceof Error) {
        return { ...defaults, formError: error.message };
    }

    return { ...defaults, formError: "Erro desconhecido ao criar conta" };
}
