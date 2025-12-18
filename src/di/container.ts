import AuthUseCases from "@/usecase/auth/authUseCases";
import { IAuthUseCases } from "@/usecase/auth/iAuthUseCases";
import FirebaseAuthService from "@/infra/firebase/service/firebaseAuthService";
import FirebaseUserRepository from "@/infra/firebase/repository/firebaseUserRepository";
import FirebaseAppointmentRepository from "@/infra/firebase/repository/firebaseAppointmentRepository";
import { IAppointmentRepository } from "@/model/repositories/iAppointmentRepository";
import { IUserRepository } from "@/model/repositories/iUserRepository";
import GetAvailableTimeSlotsUseCase, { IGetAvailableTimeSlotsUseCase } from "@/usecase/appointment/getAvailableTimeSlotsUseCase";
import RequestAppointmentUseCase, { IRequestAppointmentUseCase } from "@/usecase/appointment/requestAppointmentUseCase";
import ListPatientAppointmentsUseCase, { IListPatientAppointmentsUseCase } from "@/usecase/appointment/listPatientAppointmentsUseCase";
import GetAppointmentDetailsUseCase, { IGetAppointmentDetailsUseCase } from "@/usecase/appointment/getAppointmentDetailsUseCase";
import GetNutritionistUseCase, { IGetNutritionistUseCase } from "@/usecase/user/getNutritionistUseCase";

const authService = new FirebaseAuthService();
const userRepository: IUserRepository = new FirebaseUserRepository();
const appointmentRepository: IAppointmentRepository = new FirebaseAppointmentRepository();

const authUseCases: IAuthUseCases = new AuthUseCases(authService, userRepository);

const getAvailableTimeSlotsUseCase: IGetAvailableTimeSlotsUseCase = new GetAvailableTimeSlotsUseCase(appointmentRepository);
const requestAppointmentUseCase: IRequestAppointmentUseCase = new RequestAppointmentUseCase(appointmentRepository);
const listPatientAppointmentsUseCase: IListPatientAppointmentsUseCase = new ListPatientAppointmentsUseCase(appointmentRepository);
const getAppointmentDetailsUseCase: IGetAppointmentDetailsUseCase = new GetAppointmentDetailsUseCase(appointmentRepository);
const getNutritionistUseCase: IGetNutritionistUseCase = new GetNutritionistUseCase(userRepository);

export {
    authUseCases,
    userRepository,
    appointmentRepository,
    getAvailableTimeSlotsUseCase,
    requestAppointmentUseCase,
    listPatientAppointmentsUseCase,
    getAppointmentDetailsUseCase,
    getNutritionistUseCase,
};

