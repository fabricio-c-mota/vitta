import useHomeViewModel from "@/viewmodel/auth/useHomeViewModel";
import useLoginViewModel from "@/viewmodel/auth/useLoginViewModel";
import useSignUpViewModel from "@/viewmodel/auth/useSignUpViewModel";
import useAppointmentDetailsViewModel from "@/viewmodel/appointment/useAppointmentDetailsViewModel";
import useMyAppointmentsViewModel from "@/viewmodel/appointment/useMyAppointmentsViewModel";
import useScheduleViewModel from "@/viewmodel/appointment/useScheduleViewModel";
import useNutritionistAgendaViewModelHook from "@/viewmodel/nutritionist/useNutritionistAgendaViewModel";
import useNutritionistAppointmentDetailsViewModelHook from "@/viewmodel/nutritionist/useNutritionistAppointmentDetailsViewModel";
import useNutritionistHomeViewModelHook from "@/viewmodel/nutritionist/useNutritionistHomeViewModel";
import usePendingRequestsViewModelHook from "@/viewmodel/nutritionist/usePendingRequestsViewModel";
import usePatientHomeViewModelHook from "@/viewmodel/patient/usePatientHomeViewModel";
import { getAuthUseCases } from "@/di/others/auth";
import {
    getAcceptAppointmentUseCase,
    getCancelAppointmentUseCase,
    getAppointmentDetailsUseCase,
    getAvailableTimeSlotsUseCase,
    getListNutritionistAgendaUseCase,
    getListPatientAppointmentsUseCase,
    getListPendingAppointmentsUseCase,
    getRejectAppointmentUseCase,
    getRequestAppointmentUseCase,
} from "@/di/others/appointment";
import { getNutritionistUseCase, getUserByIdUseCase } from "@/di/others/user";

export function useAuthHomeViewModel() {
    return useHomeViewModel(getAuthUseCases());
}

export function useAuthLoginViewModel() {
    return useLoginViewModel(getAuthUseCases());
}

export function useAuthSignUpViewModel() {
    return useSignUpViewModel(getAuthUseCases());
}

export function usePatientScheduleViewModel() {
    return useScheduleViewModel(
        getAvailableTimeSlotsUseCase(),
        getRequestAppointmentUseCase(),
        getNutritionistUseCase()
    );
}

export function usePatientAppointmentsViewModel(patientId: string) {
    return useMyAppointmentsViewModel(getListPatientAppointmentsUseCase(), patientId);
}

export function usePatientAppointmentDetailsViewModel() {
    return useAppointmentDetailsViewModel(
        getAppointmentDetailsUseCase(),
        getUserByIdUseCase(),
        getCancelAppointmentUseCase()
    );
}

export function usePatientHomeViewModel() {
    return usePatientHomeViewModelHook();
}

export function useNutritionistAgendaViewModel(nutritionistId: string) {
    return useNutritionistAgendaViewModelHook(getListNutritionistAgendaUseCase(), getUserByIdUseCase(), nutritionistId);
}

export function useNutritionistPendingRequestsViewModel(nutritionistId: string) {
    return usePendingRequestsViewModelHook(
        getListPendingAppointmentsUseCase(),
        getAcceptAppointmentUseCase(),
        getRejectAppointmentUseCase(),
        getUserByIdUseCase(),
        nutritionistId
    );
}

export function useNutritionistHomeViewModel(nutritionistId: string) {
    return useNutritionistHomeViewModelHook(
        getListPendingAppointmentsUseCase(),
        getListNutritionistAgendaUseCase(),
        getUserByIdUseCase(),
        nutritionistId
    );
}

export function useNutritionistAppointmentDetailsViewModel() {
    return useNutritionistAppointmentDetailsViewModelHook(
        getAppointmentDetailsUseCase(),
        getAcceptAppointmentUseCase(),
        getRejectAppointmentUseCase(),
        getCancelAppointmentUseCase(),
        getUserByIdUseCase()
    );
}
