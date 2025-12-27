import Appointment from "@/model/entities/appointment";

export type AgendaFilter = "all" | "today" | "week";

export interface AgendaAppointmentItem {
    id: string;
    patientName: string;
    date: string;
    dateFormatted: string;
    timeStart: string;
    timeEnd: string;
    status: Appointment["status"];
}

export interface NutritionistAgendaState {
    selectedDateAppointments: AgendaAppointmentItem[];
    selectedDateFormatted: string;
    selectedDate: Date | null;
    filter: AgendaFilter;
    markedDates: Set<string>;
    loading: boolean;
    selectedDateLoading: boolean;
    refreshing: boolean;
    error: string | null;
    navigationRoute: string | null;
    navigationMethod: "replace" | "push";
}

export interface NutritionistAgendaActions {
    selectDate: (date: Date) => Promise<void>;
    setFilter: (filter: AgendaFilter) => void;
    refresh: () => Promise<void>;
    retry: () => Promise<void>;
    openAppointment: (appointmentId: string) => void;
    clearNavigation: () => void;
}
