export const formatDateToDDMMYYYY = (dateStr: string | null): string | null => {
    if (!dateStr) return null;
    try {
        if (dateStr.includes('/') && dateStr.split('/')[2].length === 4) return dateStr;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
};
