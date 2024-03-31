import type { MarkdownHeading } from "astro";
import { articleTitle } from "./article-title";
import { Heading } from "./standard-styles";
import { elementTemplate } from "../../element-template";
import { getDefaultStore } from "jotai";
import { currentHeadings } from "./current-headings";
import styles from './document-styles.module.css';

export function documentComponents(headings: MarkdownHeading[]) {
    const store = getDefaultStore();
    store.set(currentHeadings, headings);
    return {
        h1: Heading.h1,
        h2: articleTitle(headings),
        p: elementTemplate('Paragraph', 'p', (T) => <T className="my-4" />),
        ol: elementTemplate('OrderedList', 'ol', (T) => <T className={`my-4 ${styles.subsectionNumbering}`} />),
        li: elementTemplate('ListItem', 'li', (T) => <T className="my-4" />),
    };
}