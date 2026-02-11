import { addMinutes, setHours, setMinutes, isBefore, isAfter, startOfToday, format, getDay } from "date-fns";

export interface TimeSlot {
    date: Date;
    label: string;
    available: boolean;
}

const SLOT_INTERVAL_MINUTES = 15;
const PREP_BUFFER_MINUTES = 30;

function getStoreHours(): { openHour: number; openMinute: number; closeHour: number; closeMinute: number } | null {
    const day = getDay(new Date()); // 0 = Sunday
    if (day === 0) return null; // Sunday - closed
    if (day === 6) return { openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0 }; // Saturday
    return { openHour: 7, openMinute: 30, closeHour: 16, closeMinute: 30 }; // Mon-Fri
}

export function generateAvailableTimeSlots(): TimeSlot[] {
    const hours = getStoreHours();
    if (!hours) return []; // Closed today (Sunday)

    const now = new Date();
    const today = startOfToday();
    const slots: TimeSlot[] = [];

    let currentSlot = setMinutes(setHours(today, hours.openHour), hours.openMinute);
    const closingTime = setMinutes(setHours(today, hours.closeHour), hours.closeMinute);

    const minimumPickupTime = addMinutes(now, PREP_BUFFER_MINUTES);

    while (isBefore(currentSlot, closingTime)) {
        const isAvailable = isAfter(currentSlot, minimumPickupTime);

        slots.push({
            date: new Date(currentSlot),
            label: format(currentSlot, "HH:mm"),
            available: isAvailable,
        });

        currentSlot = addMinutes(currentSlot, SLOT_INTERVAL_MINUTES);
    }

    return slots;
}
