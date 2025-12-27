import { useCallback, useState } from "react";

export interface PatientHomeState {
    navigationRoute: string | null;
    navigationMethod: "replace" | "push";
}

export interface PatientHomeActions {
    goToSchedule: () => void;
    goToAppointments: () => void;
    clearNavigation: () => void;
}

export default function usePatientHomeViewModel(): PatientHomeState & PatientHomeActions {
    const [navigationRoute, setNavigationRoute] = useState<string | null>(null);
    const [navigationMethod, setNavigationMethod] = useState<"replace" | "push">("replace");

    const goToSchedule = useCallback(() => {
        setNavigationMethod("push");
        setNavigationRoute("/schedule");
    }, []);

    const goToAppointments = useCallback(() => {
        setNavigationMethod("push");
        setNavigationRoute("/my-appointments");
    }, []);

    const clearNavigation = useCallback(() => {
        setNavigationRoute(null);
    }, []);

    return {
        navigationRoute,
        navigationMethod,
        goToSchedule,
        goToAppointments,
        clearNavigation,
    };
}
