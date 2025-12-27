import { useState, useCallback } from "react";
import { IGetAvailableTimeSlotsUseCase } from "@/usecase/appointment/availability/iGetAvailableTimeSlotsUseCase";
import { IRequestAppointmentUseCase } from "@/usecase/appointment/request/iRequestAppointmentUseCase";
import { IGetNutritionistUseCase } from "@/usecase/user/iGetNutritionistUseCase";
import User from "@/model/entities/user";
import ValidationError from "@/model/errors/validationError";
import useScheduleAvailability from "@/viewmodel/appointment/helpers/useScheduleAvailability";
import { ScheduleActions, ScheduleState } from "@/viewmodel/appointment/types/scheduleViewModelTypes";
import useScheduleSubmission from "@/viewmodel/appointment/helpers/useScheduleSubmission";

export default function useScheduleViewModel(
    getAvailableTimeSlotsUseCase: IGetAvailableTimeSlotsUseCase,
    requestAppointmentUseCase: IRequestAppointmentUseCase,
    getNutritionistUseCase?: IGetNutritionistUseCase
): ScheduleState & ScheduleActions {
    const [observations, setObservationsState] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [nutritionist, setNutritionist] = useState<User | null>(null);
    const [nutritionistLoading, setNutritionistLoading] = useState(false);
    const [nutritionistError, setNutritionistError] = useState<string | null>(null);
    const [navigationRoute, setNavigationRoute] = useState<string | null>(null);
    const [navigationMethod, setNavigationMethod] = useState<"replace" | "push">("replace");

    const {
        selectedDate,
        availableSlots,
        selectedSlot,
        loading,
        availabilityMap,
        selectDate,
        selectSlot,
        loadMonthAvailability,
        clearSelection,
    } = useScheduleAvailability(getAvailableTimeSlotsUseCase, setError);

    const setObservations = useCallback((text: string): void => {
        setObservationsState(text);
    }, []);

    const {
        submitting,
        successMessage,
        successRedirect,
        requestAppointment,
        submitAppointment,
        clearSuccess,
    } = useScheduleSubmission({
        requestAppointmentUseCase,
        selectedDate,
        selectedSlot,
        observations,
        nutritionist,
        nutritionistLoading,
        onError: setError,
        onClearSelection: clearSelection,
        onClearObservations: () => setObservationsState(""),
        onRefreshDate: selectDate,
    });

    const loadNutritionist = useCallback(async (): Promise<void> => {
        if (!getNutritionistUseCase) {
            return;
        }

        setNutritionistLoading(true);
        setNutritionistError(null);

        try {
            const result = await getNutritionistUseCase.getNutritionist();
            setNutritionist(result);
        } catch (err) {
            if (err instanceof ValidationError) {
                setNutritionistError(err.message);
            } else {
                setNutritionistError('Erro ao carregar nutricionista.');
            }
        } finally {
            setNutritionistLoading(false);
        }
    }, [getNutritionistUseCase]);

    const clearNutritionistError = useCallback((): void => {
        setNutritionistError(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const confirmSuccessRedirect = useCallback(() => {
        if (!successRedirect) return;
        setNavigationMethod("replace");
        setNavigationRoute(successRedirect);
    }, [successRedirect]);

    const goBack = useCallback(() => {
        setNavigationMethod("replace");
        setNavigationRoute("/patient-home");
    }, []);

    const clearNavigation = useCallback(() => {
        setNavigationRoute(null);
    }, []);

    return {
        selectedDate,
        availableSlots,
        selectedSlot,
        observations,
        loading,
        submitting,
        error,
        successMessage,
        successRedirect,
        availabilityMap,
        nutritionist,
        nutritionistLoading,
        nutritionistError,
        navigationRoute,
        navigationMethod,
        selectDate,
        selectSlot,
        setObservations,
        requestAppointment,
        submitAppointment,
        loadMonthAvailability,
        loadNutritionist,
        clearNutritionistError,
        clearError,
        clearSuccess,
        goBack,
        clearNavigation,
        confirmSuccessRedirect,
    };
}
