import { getDefaultStore, useAtomValue } from "jotai";
import { currentHeadings } from "./current-headings";
import type { MarkdownHeading } from "astro";

export function getArticleNumber(slug: string, headings?: MarkdownHeading[]) {
    headings ??= getDefaultStore().get(currentHeadings);
    const articles = headings.filter(h => h.depth === 2);
    const articleNumber = articles.findIndex(article => article.slug === slug);
    if (articleNumber === -1) {
        console.log('unknown', {slug, headings });
        return 0;
    }

    return articleNumber + 1;
}

export function useArticleNumber(id: string | undefined) {
    return id === undefined ? NaN : getArticleNumber(id, useAtomValue(currentHeadings));
}