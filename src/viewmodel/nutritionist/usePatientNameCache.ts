import { useCallback, useState } from "react";
import { IGetUserByIdUseCase } from "@/usecase/user/iGetUserByIdUseCase";

export default function usePatientNameCache(getUserByIdUseCase: IGetUserByIdUseCase) {
    const [cache, setCache] = useState<Record<string, string>>({});

    const getPatientName = useCallback(async (patientId: string): Promise<string> => {
        if (cache[patientId]) {
            return cache[patientId];
        }
        try {
            const patient = await getUserByIdUseCase.getById(patientId);
            const name = patient?.name || "Paciente";
            setCache(prev => ({ ...prev, [patientId]: name }));
            return name;
        } catch {
            return "Paciente";
        }
    }, [getUserByIdUseCase, cache]);

    return { getPatientName };
}