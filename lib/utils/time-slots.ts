import { addMinutes, setHours, setMinutes, isBefore, isAfter, startOfToday, format, roundToNearestMinutes } from "date-fns";

export interface TimeSlot {
    date: Date;
    label: string;
    available: boolean;
}

const OPENING_HOUR = 10;
const CLOSING_HOUR = 18;
const SLOT_INTERVAL_MINUTES = 15;
const PREP_BUFFER_MINUTES = 30;

export function generateAvailableTimeSlots(): TimeSlot[] {
    const now = new Date();
    const today = startOfToday();
    const slots: TimeSlot[] = [];

    // Start at opening time
    let currentSlot = setMinutes(setHours(today, OPENING_HOUR), 0);
    const closingTime = setMinutes(setHours(today, CLOSING_HOUR), 0);

    // Minimum valid time is "now" + buffer
    // We explicitly round up "now" to avoid edge cases where a slot is exactly now
    const minimumPickupTime = addMinutes(now, PREP_BUFFER_MINUTES);

    while (isBefore(currentSlot, closingTime)) {
        // Check if slot is in the future relative to the buffer
        // A slot at 12:00 is valid if now + 30min <= 12:00
        const isAvailable = isAfter(currentSlot, minimumPickupTime);

        slots.push({
            date: new Date(currentSlot),
            label: format(currentSlot, "HH:mm"), // 14:15
            available: isAvailable,
        });

        // Increment
        currentSlot = addMinutes(currentSlot, SLOT_INTERVAL_MINUTES);
    }

    return slots;
}
