import { parseISO, addDays } from 'date-fns';

// One per day of the week
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TenureSchedule = Record<DayOfWeek, number>;
export const noWorkSchedule: TenureSchedule = [0,0,0,0,0,0,0];
// TODO: it's unclear in the bylaws when Tenure is allocated; what happens for
// partial weeks at beginning/end of the year? This code allows for a tenure
// schedule array.
export const fullWorkWeekSchedule: TenureSchedule = [0, 2, 1, 1, 1, 0, 0];

export interface PatronageEvents {
    addMember: { name: string; tenureSchedule: TenureSchedule };
    tenureRate: { name: string; tenureSchedule: TenureSchedule };
    patronage: { name: string; additional: number; comment: string };
}

export type PatronageEvent<T extends keyof PatronageEvents = keyof PatronageEvents> =
    & { date: Date }
    & {
        [P in keyof PatronageEvents]: { type: P } & PatronageEvents[P]
    }[T];

export type PatronageEntry = {
    memberDate: Date;
    weeksYTD: number;
    tenureSchedule: TenureSchedule;
    tenure: number;
    tenureYTD: number;
    patronageScheduleYTD: number;
    patronageYTD: number;
};

export type PatronageSnapshot = {
    date: Date;
    details: Record<string, PatronageEntry>;
}

function normalizeDate(date: Date | string): Date {
    return typeof date === 'string' ? parseISO(date) : date;
}

function newPatronageEntry(memberDate: Date): PatronageEntry {
    return {
        memberDate,
        weeksYTD: 0,
        tenureSchedule: noWorkSchedule,
        tenure: 0,
        tenureYTD: 0,
        patronageScheduleYTD: 0,
        patronageYTD: 0,
    };
}

export class PatronageRecord {
    private events: PatronageEvent[];
    constructor(events?: PatronageEvent[]) {
        this.events = events ? [...events] : [];
    }

    add<const P extends keyof PatronageEvents>(date: Date | string, type: P, data: PatronageEvents[P]): this {
        date = normalizeDate(date);
        const after = this.events.findIndex(e => e.date > date);
        const newEvent = { date, type, ...data } as PatronageEvent;
        if (after === -1)
            this.events.push(newEvent);
        else
            this.events.splice(after, 0, newEvent);
        return this;
    }

    getDetailsAt(date: Date | string): PatronageSnapshot {
        date = normalizeDate(date);
        const results: Record<string, PatronageEntry> = {};
        if (!this.events[0]) return { date, details: results };
        let nextEvent: PatronageEvent | undefined;
        for (let current = this.events[0].date, nextEventIndex = 0; current <= date; current = addDays(current, 1)) {
            // reset from end of year
            if (current.getMonth() === 0 && current.getDate() === 1)
                for (const entry of Object.values(results)) {
                    entry.patronageScheduleYTD = 0;
                    entry.patronageYTD = 0;
                    entry.tenureYTD = 0;
                }

            // process events
            while ((nextEvent = this.events[nextEventIndex]) && nextEvent.date <= current) {
                nextEventIndex++;
                switch (nextEvent.type) {
                    case 'addMember':
                        const newMember = newPatronageEntry(current);
                        newMember.tenureSchedule = nextEvent.tenureSchedule;
                        results[nextEvent.name] = newMember;
                        break;
                    case 'patronage':
                        results[nextEvent.name]!.patronageScheduleYTD += nextEvent.additional;
                        break;
                    case 'tenureRate':
                        results[nextEvent.name]!.tenureSchedule = nextEvent.tenureSchedule;
                        break;
                }
            }

            // process tenure
            const dayOfWeek = current.getDay() as DayOfWeek;
            for (const entry of Object.values(results)) {
                if (dayOfWeek === 6 /* Saturday */)
                    entry.weeksYTD += 1;
                entry.tenure += entry.tenureSchedule[dayOfWeek];
                entry.tenureYTD += entry.tenureSchedule[dayOfWeek];
            }
        }

        for (const entry of Object.values(results)) {
            const base = entry.tenureYTD + entry.patronageScheduleYTD;
            entry.patronageYTD = base + Math.min(entry.tenure, base * 2);
        }
        return { date, details: results };
    }

    get allEvents() { return [...this.events]; }

    clone(): PatronageRecord {
        return new PatronageRecord(this.events);
    }
}