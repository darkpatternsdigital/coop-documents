import { parseISO } from 'date-fns';

interface PatronageEvents {
    addMember: { name: string; tenureRatePerWeek: number };
    tenureRate: { name: string; tenureRatePerWeek: number };
    patronage: { name: string; additional: number; comment: string };
}

type PatronageEvent =
    & { date: Date }
    & {
        [P in keyof PatronageEvents]: { type: P } & PatronageEvents[P]
    }[keyof PatronageEvents];


export class PatronageRecord {
    private events: PatronageEvent[] = [];

    add<const P extends keyof PatronageEvents>(date: Date | string, type: P, data: PatronageEvents[P]): this {
        if (typeof date === 'string')
            date = parseISO(date);
        const after = this.events.findIndex(e => e.date > date);
        const newEvent = { date, type, ...data } as PatronageEvent;
        if (after === -1)
            this.events.push(newEvent);
        else
            this.events.splice(after, 0, newEvent);
        return this;
    }

    get allEvents() { return [...this.events]; }
}