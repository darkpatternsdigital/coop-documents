import type { MarkdownHeading } from "astro";
import { articleTitle } from "./article-title";
import { Heading } from "./standard-styles";
import { elementTemplate } from "../../element-template";
import { getDefaultStore } from "jotai";
import { currentHeadings } from "./current-headings";

export function documentComponents(headings: MarkdownHeading[]) {
    const store = getDefaultStore();
    store.set(currentHeadings, headings);
    return {
        h1: Heading.h1,
        h2: articleTitle(headings),
        p: elementTemplate('Paragraph', 'p', (T) => <T className="my-4" />),
    };
}