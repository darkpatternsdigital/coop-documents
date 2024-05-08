import { date } from 'astro/zod';
import { parseISO, addDays } from 'date-fns';

export interface PatronageEvents {
    addMember: { name: string; tenureRatePerWeek: number };
    tenureRate: { name: string; tenureRatePerWeek: number };
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
    tenurePerWeek: number;
    tenure: number;
    tenureYTD: number;
    patronageScheduleYTD: number;
    patronageYTD: number;
};

function normalizeDate(date: Date | string): Date {
    return typeof date === 'string' ? parseISO(date) : date;
}

function newPatronageEntry(memberDate: Date): PatronageEntry {
    return {
        memberDate,
        weeksYTD: 0,
        tenurePerWeek: 0,
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

    getDetailsAt(date: Date | string): Record<string, PatronageEntry> {
        date = normalizeDate(date);
        const results: Record<string, PatronageEntry> = {};
        if (!this.events[0]) return results;
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
                        newMember.tenurePerWeek = nextEvent.tenureRatePerWeek;
                        results[nextEvent.name] = newMember;
                        break;
                    case 'patronage':
                        results[nextEvent.name]!.patronageScheduleYTD += nextEvent.additional;
                        break;
                    case 'tenureRate':
                        results[nextEvent.name]!.tenurePerWeek = nextEvent.tenureRatePerWeek;
                        break;
                }
            }

            // process tenure
            if (current.getDay() === 5 /* Saturday */) {
                // TODO: it's unclear in the bylaws when Tenure is allocated;
                // what happens for partial weeks at beginning/end of the year?
                // This code assumes that all tenure is allocated on Saturday at
                // the end of the week.
                for (const entry of Object.values(results)) {
                    entry.weeksYTD += 1;
                    entry.tenure += entry.tenurePerWeek;
                    entry.tenureYTD += entry.tenurePerWeek
                }
            }
        }

        for (const entry of Object.values(results)) {
            const base = entry.tenureYTD + entry.patronageScheduleYTD;
            entry.patronageYTD = base + Math.min(entry.tenure, base * 2);
        }
        return results;
    }

    get allEvents() { return [...this.events]; }

    clone(): PatronageRecord {
        return new PatronageRecord(this.events);
    }
}