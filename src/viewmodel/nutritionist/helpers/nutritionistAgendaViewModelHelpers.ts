import { AgendaFilter } from "@/viewmodel/nutritionist/types/nutritionistAgendaViewModelTypes";

export function formatDateShort(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    }).toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatSelectedDate(date: Date | null): string {
    if (!date) return "";
    const formatted = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getDateRange(filterType: AgendaFilter): { start: Date; end: Date } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterType) {
        case "today":
            return { start: today, end: today };
        case "week": {
            const dayOfWeek = today.getDay();
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
            return { start: today, end: endOfWeek };
        }
        case "all":
        default: {
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 60);
            return { start: today, end: endDate };
        }
    }
}
