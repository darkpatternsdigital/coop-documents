import type { MarkdownHeading } from "astro";
import { useAtomValue } from "jotai";
import { currentHeadings } from "./current-headings";

export function getArticleNumber(headings: MarkdownHeading[], slug: string) {
    const articles = headings.filter(h => h.depth === 2);
    const articleNumber = articles.findIndex(article => article.slug === slug) + 1;

    return articleNumber;
}

export function useArticleNumber(id: string | undefined) {
    return id === undefined ? NaN : getArticleNumber(useAtomValue(currentHeadings), id);
}