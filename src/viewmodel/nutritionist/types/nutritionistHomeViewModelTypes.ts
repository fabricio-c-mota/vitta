export interface AgendaItem {
    id: string;
    patientName: string;
    time: string;
}

export interface NutritionistHomeState {
    todayAppointments: AgendaItem[];
    pendingCount: number;
    loading: boolean;
    error: string | null;
    showEmptyState: boolean;
    hasAppointmentsToday: boolean;
    navigationRoute: string | null;
    navigationMethod: "replace" | "push";
}

export interface NutritionistHomeActions {
    refresh: () => Promise<void>;
    clearError: () => void;
    goToPendingRequests: () => void;
    goToAgenda: () => void;
    clearNavigation: () => void;
}
