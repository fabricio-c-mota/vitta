import { renderHook, act, waitFor } from '@testing-library/react';
import useAppointmentDetailsViewModel from '@/viewmodel/appointment/useAppointmentDetailsViewModel';
import { IGetAppointmentDetailsUseCase } from '@/usecase/appointment/details/iGetAppointmentDetailsUseCase';
import { IGetUserByIdUseCase } from '@/usecase/user/iGetUserByIdUseCase';
import { ICancelAppointmentUseCase } from '@/usecase/appointment/status/iCancelAppointmentUseCase';
import { IAppointmentPushNotificationUseCase } from '@/usecase/notifications/iAppointmentPushNotificationUseCase';
import RepositoryError from '@/model/errors/repositoryError';
import ValidationError from '@/model/errors/validationError';
import Appointment from '@/model/entities/appointment';

describe('ViewModel de Detalhes da Consulta - Paciente', () => {
    let mockGetAppointmentDetailsUseCase: IGetAppointmentDetailsUseCase;
    let mockGetUserByIdUseCase: IGetUserByIdUseCase;
    let mockCancelAppointmentUseCase: ICancelAppointmentUseCase;
    let mockAppointmentPushNotificationUseCase: IAppointmentPushNotificationUseCase;

    beforeEach(() => {
        mockGetAppointmentDetailsUseCase = {
            getById: jest.fn(),
        };
        mockGetUserByIdUseCase = {
            getById: jest.fn().mockResolvedValue({ id: 'nutri-1', name: 'Ana Silva', email: 'ana@test.com', role: 'nutritionist', createdAt: new Date() }),
        };
        mockCancelAppointmentUseCase = {
            cancelAppointment: jest.fn(),
            prepareCancel: jest.fn(),
        };
        mockAppointmentPushNotificationUseCase = {
            notify: jest.fn(),
        };
    });

    const mockAppointment: Appointment = {
        id: 'appt-123',
        patientId: 'patient-1',
        nutritionistId: 'nutri-1',
        date: '2024-01-15',
        timeStart: '09:00',
        timeEnd: '11:00',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('deve inicializar com estado padrão', () => {
        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        expect(result.current.appointment).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.notFound).toBe(false);
    });

    it('deve carregar detalhes da consulta', async () => {
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.appointment).toEqual(mockAppointment);
        expect(result.current.loading).toBe(false);
        expect(result.current.notFound).toBe(false);
    });

    it('deve setar loading durante carregamento', async () => {
        let resolveLoad: (value: Appointment) => void;
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockImplementation(() =>
            new Promise((resolve) => {
                resolveLoad = resolve;
            })
        );

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        act(() => {
            result.current.loadAppointment('appt-123');
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolveLoad!(mockAppointment);
        });

        expect(result.current.loading).toBe(false);
    });

    it('deve setar notFound quando consulta não existe', async () => {
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('non-existent');
        });

        expect(result.current.appointment).toBeNull();
        expect(result.current.notFound).toBe(true);
    });

    it('deve tratar RepositoryError', async () => {
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockRejectedValue(
            new RepositoryError('Erro ao carregar')
        );

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.error).toBe('Erro ao carregar');
        expect(result.current.appointment).toBeNull();
    });

    it('deve tratar erro genérico', async () => {
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockRejectedValue(new Error('Unknown'));

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.error).toBe('Erro ao carregar detalhes da consulta.');
    });

    it('deve limpar erro', async () => {
        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockRejectedValue(
            new RepositoryError('Erro')
        );

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.error).not.toBeNull();

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });

    it('deve carregar nome do nutricionista', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await waitFor(() => {
            expect(result.current.nutritionistLoading).toBe(false);
        });

        expect(result.current.nutritionistName).toBe('Ana Silva');
        expect(mockGetUserByIdUseCase.getById).toHaveBeenCalledWith('nutri-1');
    });

    it('deve cancelar consulta com sucesso', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const cancelledAppointment = { ...mockAppointment, status: 'cancelled' as const };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockResolvedValue(cancelledAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.appointment?.status).toBe('cancelled');
        expect(result.current.successMessage).toBe('Consulta cancelada.');
        expect(mockAppointmentPushNotificationUseCase.notify).toHaveBeenCalledWith(cancelledAppointment, 'cancelled', 'nutritionist');
    });

    it('deve tratar ValidationError ao cancelar', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockRejectedValue(new ValidationError('Não pode cancelar'));

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.error).toBe('Não pode cancelar');
    });

    it('deve tratar RepositoryError ao cancelar', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockRejectedValue(new RepositoryError('Erro de conexão'));

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.error).toBe('Erro de conexão');
    });

    it('deve tratar erro genérico ao cancelar', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockRejectedValue(new Error('Unknown error'));

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.error).toBe('Erro ao cancelar consulta.');
    });

    it('deve retornar erro quando cancelAppointmentUseCase não é fornecido', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase
                // cancelAppointmentUseCase não fornecido
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.error).toBe('Cancelamento indisponível.');
    });

    it('deve ignorar erro ao enviar notificação de cancelamento', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const cancelledAppointment = { ...mockAppointment, status: 'cancelled' as const };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockResolvedValue(cancelledAppointment);
        (mockAppointmentPushNotificationUseCase.notify as jest.Mock).mockRejectedValue(new Error('Notification failed'));

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.successMessage).toBe('Consulta cancelada.');
        expect(consoleSpy).toHaveBeenCalledWith('Falha ao enviar notificacao de cancelamento:', expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('deve limpar mensagem de sucesso', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'accepted',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const cancelledAppointment = { ...mockAppointment, status: 'cancelled' as const };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);
        (mockCancelAppointmentUseCase.cancelAppointment as jest.Mock).mockResolvedValue(cancelledAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(
                mockGetAppointmentDetailsUseCase,
                mockGetUserByIdUseCase,
                mockCancelAppointmentUseCase,
                mockAppointmentPushNotificationUseCase
            )
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        await act(async () => {
            await result.current.cancelAppointment('appt-123');
        });

        expect(result.current.successMessage).not.toBeNull();

        act(() => {
            result.current.clearSuccess();
        });

        expect(result.current.successMessage).toBeNull();
    });

    it('deve calcular canCancel corretamente', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.canCancel).toBe(true);
    });

    it('deve negar cancelamento para consulta rejeitada', async () => {
        const mockAppointment: Appointment = {
            id: 'appt-123',
            patientId: 'patient-1',
            nutritionistId: 'nutri-1',
            date: '2024-01-15',
            timeStart: '09:00',
            timeEnd: '11:00',
            status: 'rejected',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (mockGetAppointmentDetailsUseCase.getById as jest.Mock).mockResolvedValue(mockAppointment);

        const { result } = renderHook(() =>
            useAppointmentDetailsViewModel(mockGetAppointmentDetailsUseCase)
        );

        await act(async () => {
            await result.current.loadAppointment('appt-123');
        });

        expect(result.current.canCancel).toBe(false);
    });
});
