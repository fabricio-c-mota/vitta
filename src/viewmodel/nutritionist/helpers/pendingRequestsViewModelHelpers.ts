export function formatPendingDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}
