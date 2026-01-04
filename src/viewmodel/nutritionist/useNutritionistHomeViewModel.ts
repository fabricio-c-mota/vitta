import { useState, useEffect, useCallback } from "react";
import { IListPendingAppointmentsUseCase } from "@/usecase/appointment/list/iListPendingAppointmentsUseCase";
import { IListNutritionistAgendaUseCase } from "@/usecase/appointment/list/iListNutritionistAgendaUseCase";
import { IGetUserByIdUseCase } from "@/usecase/user/iGetUserByIdUseCase";
import RepositoryError from "@/model/errors/repositoryError";
import { AgendaItem, NutritionistHomeActions, NutritionistHomeState } from "@/viewmodel/nutritionist/types/nutritionistHomeViewModelTypes";

export default function useNutritionistHomeViewModel(
    listPendingAppointmentsUseCase: IListPendingAppointmentsUseCase,
    listNutritionistAgendaUseCase: IListNutritionistAgendaUseCase,
    getUserByIdUseCase: IGetUserByIdUseCase,
    nutritionistId: string
): NutritionistHomeState & NutritionistHomeActions {
    const [todayAppointments, setTodayAppointments] = useState<AgendaItem[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEmptyState, setShowEmptyState] = useState(true);
    const [navigationRoute, setNavigationRoute] = useState<string | null>(null);
    const [navigationMethod, setNavigationMethod] = useState<"replace" | "push">("replace");

    const hasAppointmentsToday = todayAppointments.length > 0;

    const loadData = useCallback(async (): Promise<void> => {
        if (!nutritionistId) return;

        setLoading(true);
        setError(null);

        try {
            const pending = await listPendingAppointmentsUseCase.listPendingByNutritionist(nutritionistId);
            setPendingCount(pending.length);

            const todayDate = new Date();
            todayDate.setHours(12, 0, 0, 0);
            const accepted = await listNutritionistAgendaUseCase.listAcceptedByDate(
                nutritionistId,
                todayDate
            );

            const items: AgendaItem[] = await Promise.all(
                accepted.map(async (appt) => {
                    let patientName = "Paciente";
                    try {
                        const patient = await getUserByIdUseCase.getById(appt.patientId);
                        if (patient) patientName = patient.name;
                    } catch {
                    }
                    return {
                        id: appt.id,
                        patientName,
                        time: appt.timeStart,
                    };
                })
            );

            items.sort((a, b) => a.time.localeCompare(b.time));
            setTodayAppointments(items);
        } catch (err) {
            if (err instanceof RepositoryError) {
                setError(err.message);
            } else {
                setError('Erro ao carregar dados.');
            }
        } finally {
            setLoading(false);
        }
    }, [listPendingAppointmentsUseCase, listNutritionistAgendaUseCase, getUserByIdUseCase, nutritionistId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!nutritionistId) return;

        const unsubscribe = listPendingAppointmentsUseCase.subscribePendingByNutritionist(
            nutritionistId,
            (pending) => {
                setPendingCount(pending.length);
            }
        );

        return unsubscribe;
    }, [listPendingAppointmentsUseCase, nutritionistId]);

    const refresh = useCallback(async (): Promise<void> => {
        await loadData();
    }, [loadData]);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const goToPendingRequests = useCallback(() => {
        setNavigationMethod("push");
        setNavigationRoute("/pending-requests");
    }, []);

    const goToAgenda = useCallback(() => {
        setNavigationMethod("push");
        setNavigationRoute("/agenda");
    }, []);

    const clearNavigation = useCallback(() => {
        setNavigationRoute(null);
    }, []);

    useEffect(() => {
        setShowEmptyState(!hasAppointmentsToday);
    }, [hasAppointmentsToday]);

    useEffect(() => {
        if (!hasAppointmentsToday && showEmptyState && !loading) {
            const timer = setTimeout(() => {
                setShowEmptyState(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hasAppointmentsToday, showEmptyState, loading]);

    return {
        todayAppointments,
        pendingCount,
        loading,
        error,
        showEmptyState,
        hasAppointmentsToday,
        navigationRoute,
        navigationMethod,
        refresh,
        clearError,
        goToPendingRequests,
        goToAgenda,
        clearNavigation,
    };
}
