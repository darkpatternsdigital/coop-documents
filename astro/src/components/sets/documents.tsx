import type { MarkdownHeading } from "astro";

export const documentComponents = (headings: MarkdownHeading[]) => {
    console.log({ headings });
    return ({
        h1: 'h2',
        h2: 'h3',
        h3: 'h4',
        h4: 'h5',
        h5: 'h6',
        pre: 'span'
    });
};