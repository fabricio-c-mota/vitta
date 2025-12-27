import { useState, useCallback } from "react";
import Appointment from "@/model/entities/appointment";
import { IGetAppointmentDetailsUseCase } from "@/usecase/appointment/details/iGetAppointmentDetailsUseCase";
import { IAcceptAppointmentUseCase } from "@/usecase/appointment/status/iAcceptAppointmentUseCase";
import { IRejectAppointmentUseCase } from "@/usecase/appointment/status/iRejectAppointmentUseCase";
import { ICancelAppointmentUseCase } from "@/usecase/appointment/status/iCancelAppointmentUseCase";
import { IGetUserByIdUseCase } from "@/usecase/user/iGetUserByIdUseCase";
import RepositoryError from "@/model/errors/repositoryError";
import ValidationError from "@/model/errors/validationError";
import {
    NutritionistAppointmentDetailsActions,
    NutritionistAppointmentDetailsState,
} from "@/viewmodel/nutritionist/types/nutritionistAppointmentDetailsViewModelTypes";
export default function useNutritionistAppointmentDetailsViewModel(
    getAppointmentDetailsUseCase: IGetAppointmentDetailsUseCase,
    acceptAppointmentUseCase: IAcceptAppointmentUseCase,
    rejectAppointmentUseCase: IRejectAppointmentUseCase,
    cancelAppointmentUseCase: ICancelAppointmentUseCase,
    getUserByIdUseCase: IGetUserByIdUseCase
): NutritionistAppointmentDetailsState & NutritionistAppointmentDetailsActions {
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [patientName, setPatientName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const loadAppointment = useCallback(async (appointmentId: string): Promise<void> => {
        if (!appointmentId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getAppointmentDetailsUseCase.getById(appointmentId);
            if (!result) {
                setAppointment(null);
                setPatientName(null);
                setNotFound(true);
                return;
            }
            setAppointment(result);
            setNotFound(false);
            try {
                const patient = await getUserByIdUseCase.getById(result.patientId);
                setPatientName(patient?.name || "Paciente");
            } catch {
                setPatientName("Paciente");
            }
        } catch (err) {
            if (err instanceof RepositoryError) {
                setError(err.message);
            } else {
                setError("Erro ao carregar consulta.");
            }
        } finally {
            setLoading(false);
        }
    }, [getAppointmentDetailsUseCase, getUserByIdUseCase]);
    const acceptAppointment = useCallback(async (appointmentId: string): Promise<void> => {
        setProcessing(true);
        setError(null);
        try {
            const updated = await acceptAppointmentUseCase.acceptAppointment(appointmentId);
            setAppointment(updated);
            setSuccessMessage("Consulta aceita com sucesso!");
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(err.message);
            } else if (err instanceof RepositoryError) {
                setError(err.message);
            } else {
                setError("Erro ao aceitar consulta.");
            }
        } finally {
            setProcessing(false);
        }
    }, [acceptAppointmentUseCase]);
    const rejectAppointment = useCallback(async (appointmentId: string): Promise<void> => {
        setProcessing(true);
        setError(null);
        try {
            const updated = await rejectAppointmentUseCase.rejectAppointment(appointmentId);
            setAppointment(updated);
            setSuccessMessage("Consulta recusada.");
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(err.message);
            } else if (err instanceof RepositoryError) {
                setError(err.message);
            } else {
                setError("Erro ao recusar consulta.");
            }
        } finally {
            setProcessing(false);
        }
    }, [rejectAppointmentUseCase]);
    const cancelAppointment = useCallback(async (appointmentId: string): Promise<void> => {
        setProcessing(true);
        setError(null);
        try {
            const updated = await cancelAppointmentUseCase.cancelAppointment(appointmentId);
            setAppointment(updated);
            setSuccessMessage("Consulta cancelada.");
        } catch (err) {
            if (err instanceof ValidationError) {
                setError(err.message);
            } else if (err instanceof RepositoryError) {
                setError(err.message);
            } else {
                setError("Erro ao cancelar consulta.");
            }
        } finally {
            setProcessing(false);
        }
    }, [cancelAppointmentUseCase]);
    const clearError = useCallback((): void => {
        setError(null);
    }, []);
    const clearSuccess = useCallback((): void => {
        setSuccessMessage(null);
    }, []);
    const canHandle = appointment?.status === "pending";
    const canCancel = appointment?.status === "accepted";

    return {
        appointment,
        patientName,
        loading,
        processing,
        error,
        successMessage,
        notFound,
        canHandle,
        canCancel,
        loadAppointment,
        acceptAppointment,
        rejectAppointment,
        cancelAppointment,
        clearError,
        clearSuccess,
    };
}
