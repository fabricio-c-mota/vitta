import { useEffect, useState, useCallback } from "react";
import User from "@/model/entities/user";
import AuthError from "@/model/errors/authError";
import { IAuthUseCases } from "@/usecase/auth/iAuthUseCases";

export type HomeState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    unauthenticatedRedirect: string | null;
    startupRedirect: string | null;
};

export type HomeActions = {
    logout: () => Promise<void>;
    clearError: () => void;
};

export default function useHomeViewModel(authUseCases: IAuthUseCases): HomeState & HomeActions {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = authUseCases.onAuthStateChanged((authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [authUseCases]);

    const logout = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await authUseCases.logout();
            setUser(null);
        } catch (err: unknown) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('Erro ao fazer logout');
            }
        } finally {
            setLoading(false);
        }
    }, [authUseCases]);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const unauthenticatedRedirect = !loading && !user ? "/login" : null;
    const startupRedirect = !loading
        ? user
            ? user.role === "nutritionist"
                ? "/nutritionist-home"
                : "/patient-home"
            : "/login"
        : null;

    return {
        user,
        loading,
        error,
        unauthenticatedRedirect,
        startupRedirect,
        logout,
        clearError,
    };
}
