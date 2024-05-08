import { compareAsc, format } from 'date-fns';
import type { PatronageEntry } from "../../business-logic/patronage";
const { amber, blue, cyan, emerald, orange, purple, rose } = (await import('tailwindcss/colors')).default;

const colorIndices = [
    500,
    900,
    100,
    700,
    300,
] as const;
type ColorIndices = typeof colorIndices[number];

const colorMaps: { [P in ColorIndices]: string }[] = [
    amber,
    emerald,
    blue,
    orange,
    cyan,
    purple,
    rose
];

const colors = (Array(colorIndices.length * colorMaps.length).fill(0).map((_, index) => {
    const colorRange = colorMaps[index % colorMaps.length]!;
    return colorRange[colorIndices[index % colorIndices.length]!];
}))

export function PointInTime({ data, membersOrder }: { data: Record<string, PatronageEntry>, membersOrder?: string[] }) {
    const allEntries = Object.entries(data);
    const order = membersOrder ?? allEntries.sort((a, b) => compareAsc(a[1].memberDate, b[1].memberDate)).map(([name]) => name);
    return (
        <>
            <div className="flex gap-1">
                {order.map((name, index) =>
                    <div className="h-4" key={name} style={{ background: colors[index], flexBasis: 0, flexGrow: data[name]?.patronageYTD }}></div>
                )}
            </div>
            <details>
                <summary className="cursor-pointer">
                    <div className="inline-flex gap-1 flex-wrap">
                        {order.map((name, index) =>
                            <div key={name}>
                                <span className="inline-block h-4 w-4" style={{ background: colors[index] }}></span>
                                {' '}{name}
                            </div>
                        )}
                    </div>
                </summary>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Member Date</th>
                            <th>Weeks YTD</th>
                            <th>Tenure (YTD/total)</th>
                            <th>Patronage Schedule (YTD)</th>
                            <th>Patronage (YTD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((name, index) =>
                            {
                                const current = data[name]!;
                                return <tr key={name}>
                                    <td><span className="inline-block h-4 w-4" style={{ background: colors[index] }}></span>
                                        {' '}{name}</td>
                                    <td>{format(current.memberDate, 'MMM d, yyyy')}</td>
                                    <td>{current.weeksYTD.toFixed(0)}</td>
                                    <td>{current.tenureYTD.toFixed(0)} / {current.tenure.toFixed(0)}</td>
                                    <td>{current.patronageScheduleYTD.toFixed(0)}</td>
                                    <td>{current.patronageYTD.toFixed(0)}</td>
                                </tr>;
                            }
                        )}
                    </tbody>
                </table>
            </details>
        </>
    )
}