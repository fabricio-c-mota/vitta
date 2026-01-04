import { useCallback, useState } from "react";
import TimeSlot from "@/model/entities/timeSlot";
import RepositoryError from "@/model/errors/repositoryError";
import { IGetAvailableTimeSlotsUseCase } from "@/usecase/appointment/availability/iGetAvailableTimeSlotsUseCase";
import { formatDateISO } from "@/view/utils/dateFormatters";

type AvailabilityState = {
    selectedDate: Date | null;
    availableSlots: TimeSlot[];
    selectedSlot: TimeSlot | null;
    loading: boolean;
    availabilityMap: Map<string, boolean>;
};

type AvailabilityActions = {
    selectDate: (date: Date, nutritionistId: string, patientId?: string) => Promise<void>;
    selectSlot: (slot: TimeSlot) => void;
    loadMonthAvailability: (
        year: number,
        month: number,
        nutritionistId: string,
        patientId?: string
    ) => Promise<void>;
    clearSelection: () => void;
};

export default function useScheduleAvailability(
    getAvailableTimeSlotsUseCase: IGetAvailableTimeSlotsUseCase,
    onError: (message: string | null) => void
): AvailabilityState & AvailabilityActions {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [loading, setLoading] = useState(false);
    const [availabilityMap, setAvailabilityMap] = useState<Map<string, boolean>>(new Map());

    const selectDate = useCallback(async (
        date: Date,
        nutritionistId: string,
        patientId?: string
    ): Promise<void> => {
        setSelectedDate(date);
        setSelectedSlot(null);
        onError(null);
        setLoading(true);
        setAvailableSlots([]);

        try {
            const slots = await getAvailableTimeSlotsUseCase.listAvailableSlots(date, nutritionistId, patientId);
            setAvailableSlots(slots);
        } catch (err) {
            if (err instanceof RepositoryError) {
                onError(err.message);
            } else {
                onError("Erro ao carregar horários disponíveis.");
            }
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    }, [getAvailableTimeSlotsUseCase, onError]);

    const selectSlot = useCallback((slot: TimeSlot): void => {
        setSelectedSlot(slot);
        onError(null);
    }, [onError]);

    const loadMonthAvailability = useCallback(async (
        year: number,
        month: number,
        nutritionistId: string,
        patientId?: string
    ): Promise<void> => {
        const startDate = new Date(year, month - 1, 1, 12, 0, 0);
        const endDate = new Date(year, month, 0, 12, 0, 0);

        try {
            const slotsMap = await getAvailableTimeSlotsUseCase.listAvailableSlotsForRange(
                startDate,
                endDate,
                nutritionistId,
                patientId
            );

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = formatDateISO(today);

            const newAvailabilityMap = new Map<string, boolean>();
            const current = new Date(startDate);
            while (current <= endDate) {
                const dateStr = formatDateISO(current);
                if (dateStr >= todayStr) {
                    const slots = slotsMap.get(dateStr) || [];
                    newAvailabilityMap.set(dateStr, slots.length > 0);
                }
                current.setDate(current.getDate() + 1);
            }

            setAvailabilityMap(newAvailabilityMap);
        } catch (err) {
            console.error("Erro ao carregar disponibilidade do mês:", err);
        }
    }, [getAvailableTimeSlotsUseCase]);

    const clearSelection = useCallback(() => {
        setSelectedSlot(null);
    }, []);

    return {
        selectedDate,
        availableSlots,
        selectedSlot,
        loading,
        availabilityMap,
        selectDate,
        selectSlot,
        loadMonthAvailability,
        clearSelection,
    };
}
