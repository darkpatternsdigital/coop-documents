import { Fragment } from "react";

export type AddressData = string[];

export function Address({ data }: { data: AddressData }) {
    return (
        <address className="not-italic">
            {data.map((line, index) => (
                <Fragment key={index}>
                    {index === 0 ? null : <br />}
                    {line}
                </Fragment>
            ))}
        </address>
    )
}