import type { MarkdownHeading } from "astro";
import { ArticleTitle } from "./article-title";
import { Heading } from "./standard-styles";
import { elementTemplate } from "../../element-template";
import { getDefaultStore } from "jotai";
import { currentHeadings } from "./current-headings";
import styles from './document-styles.module.css';

const documentComponents = {
    h1: Heading.h1,
    h2: ArticleTitle,
    p: elementTemplate('Paragraph', 'p', (T) => <T className="my-4" />),
    ol: elementTemplate('OrderedList', 'ol', (T) => <T className={`my-4 ${styles.subsectionNumbering}`} />),
    li: elementTemplate('ListItem', 'li', (T) => <T className="my-4" />),
};

export function getDocumentComponents(headings: MarkdownHeading[]) {
    const store = getDefaultStore();
    store.set(currentHeadings, headings);
    return documentComponents;
}