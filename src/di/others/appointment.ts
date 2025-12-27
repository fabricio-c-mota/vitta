import GetAvailableTimeSlotsUseCase from "@/usecase/appointment/availability/getAvailableTimeSlotsUseCase";
import { IGetAvailableTimeSlotsUseCase } from "@/usecase/appointment/availability/iGetAvailableTimeSlotsUseCase";
import RequestAppointmentUseCase from "@/usecase/appointment/request/requestAppointmentUseCase";
import { IRequestAppointmentUseCase } from "@/usecase/appointment/request/iRequestAppointmentUseCase";
import ListPatientAppointmentsUseCase from "@/usecase/appointment/list/listPatientAppointmentsUseCase";
import { IListPatientAppointmentsUseCase } from "@/usecase/appointment/list/iListPatientAppointmentsUseCase";
import GetAppointmentDetailsUseCase from "@/usecase/appointment/details/getAppointmentDetailsUseCase";
import { IGetAppointmentDetailsUseCase } from "@/usecase/appointment/details/iGetAppointmentDetailsUseCase";
import AcceptAppointmentUseCase from "@/usecase/appointment/status/acceptAppointmentUseCase";
import { IAcceptAppointmentUseCase } from "@/usecase/appointment/status/iAcceptAppointmentUseCase";
import RejectAppointmentUseCase from "@/usecase/appointment/status/rejectAppointmentUseCase";
import { IRejectAppointmentUseCase } from "@/usecase/appointment/status/iRejectAppointmentUseCase";
import CancelAppointmentUseCase from "@/usecase/appointment/status/cancelAppointmentUseCase";
import { ICancelAppointmentUseCase } from "@/usecase/appointment/status/iCancelAppointmentUseCase";
import ListNutritionistAgendaUseCase from "@/usecase/appointment/list/listNutritionistAgendaUseCase";
import { IListNutritionistAgendaUseCase } from "@/usecase/appointment/list/iListNutritionistAgendaUseCase";
import ListPendingAppointmentsUseCase from "@/usecase/appointment/list/listPendingAppointmentsUseCase";
import { IListPendingAppointmentsUseCase } from "@/usecase/appointment/list/iListPendingAppointmentsUseCase";
import { getAppointmentRepository, getInitError } from "@/di/others/base";

let availableTimeSlotsUseCase: IGetAvailableTimeSlotsUseCase | null = null;
let requestUseCase: IRequestAppointmentUseCase | null = null;
let patientAppointmentsUseCase: IListPatientAppointmentsUseCase | null = null;
let appointmentDetailsUseCase: IGetAppointmentDetailsUseCase | null = null;
let acceptUseCase: IAcceptAppointmentUseCase | null = null;
let rejectUseCase: IRejectAppointmentUseCase | null = null;
let cancelUseCase: ICancelAppointmentUseCase | null = null;
let nutritionistAgendaUseCase: IListNutritionistAgendaUseCase | null = null;
let pendingAppointmentsUseCase: IListPendingAppointmentsUseCase | null = null;
let initError: Error | null = null;

function initAppointmentUseCases() {
  if (
    availableTimeSlotsUseCase &&
    requestUseCase &&
    patientAppointmentsUseCase &&
    appointmentDetailsUseCase &&
    acceptUseCase &&
    rejectUseCase &&
    cancelUseCase &&
    nutritionistAgendaUseCase &&
    pendingAppointmentsUseCase
  ) {
    return;
  }
  if (initError) {
    return;
  }

  try {
    const baseError = getInitError();
    if (baseError) {
      throw baseError;
    }
    const repository = getAppointmentRepository();
    availableTimeSlotsUseCase = new GetAvailableTimeSlotsUseCase(repository);
    requestUseCase = new RequestAppointmentUseCase(repository);
    patientAppointmentsUseCase = new ListPatientAppointmentsUseCase(repository);
    appointmentDetailsUseCase = new GetAppointmentDetailsUseCase(repository);
    acceptUseCase = new AcceptAppointmentUseCase(repository);
    rejectUseCase = new RejectAppointmentUseCase(repository);
    cancelUseCase = new CancelAppointmentUseCase(repository);
    nutritionistAgendaUseCase = new ListNutritionistAgendaUseCase(repository);
    pendingAppointmentsUseCase = new ListPendingAppointmentsUseCase(repository);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao inicializar appointment";
    console.error("Erro fatal ao inicializar dependências:", errorMessage);
    initError = new Error(`Falha ao inicializar aplicação: ${errorMessage}`);
  }
}

function getAvailableTimeSlotsUseCase() {
  initAppointmentUseCases();
  if (!availableTimeSlotsUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return availableTimeSlotsUseCase;
}

function getRequestAppointmentUseCase() {
  initAppointmentUseCases();
  if (!requestUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return requestUseCase;
}

function getListPatientAppointmentsUseCase() {
  initAppointmentUseCases();
  if (!patientAppointmentsUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return patientAppointmentsUseCase;
}

function getAppointmentDetailsUseCase() {
  initAppointmentUseCases();
  if (!appointmentDetailsUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return appointmentDetailsUseCase;
}

function getAcceptAppointmentUseCase() {
  initAppointmentUseCases();
  if (!acceptUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return acceptUseCase;
}

function getRejectAppointmentUseCase() {
  initAppointmentUseCases();
  if (!rejectUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return rejectUseCase;
}

function getCancelAppointmentUseCase() {
  initAppointmentUseCases();
  if (!cancelUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return cancelUseCase;
}

function getListNutritionistAgendaUseCase() {
  initAppointmentUseCases();
  if (!nutritionistAgendaUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return nutritionistAgendaUseCase;
}

function getListPendingAppointmentsUseCase() {
  initAppointmentUseCases();
  if (!pendingAppointmentsUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de agendamento");
  }
  return pendingAppointmentsUseCase;
}

export {
  getAvailableTimeSlotsUseCase,
  getRequestAppointmentUseCase,
  getListPatientAppointmentsUseCase,
  getAppointmentDetailsUseCase,
  getAcceptAppointmentUseCase,
  getRejectAppointmentUseCase,
  getCancelAppointmentUseCase,
  getListNutritionistAgendaUseCase,
  getListPendingAppointmentsUseCase,
};
