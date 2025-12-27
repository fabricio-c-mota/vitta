import Appointment from "@/model/entities/appointment";

export interface NutritionistAppointmentDetailsState {
    appointment: Appointment | null;
    patientName: string | null;
    loading: boolean;
    processing: boolean;
    error: string | null;
    successMessage: string | null;
    notFound: boolean;
    canHandle: boolean;
    canCancel: boolean;
}

export interface NutritionistAppointmentDetailsActions {
    loadAppointment: (appointmentId: string) => Promise<void>;
    acceptAppointment: (appointmentId: string) => Promise<void>;
    rejectAppointment: (appointmentId: string) => Promise<void>;
    cancelAppointment: (appointmentId: string) => Promise<void>;
    clearError: () => void;
    clearSuccess: () => void;
}
