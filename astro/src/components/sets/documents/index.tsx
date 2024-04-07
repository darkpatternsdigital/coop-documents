import type { MarkdownHeading } from "astro";
import { getArticleTitle } from "./article-title";
import { Heading } from "./standard-styles";
import { elementTemplate } from "../../element-template";
import { getDefaultStore } from "jotai";
import { currentHeadings } from "./current-headings";
import styles from './document-styles.module.css';

const documentComponents = {
    h1: Heading.h1,
    p: elementTemplate('Paragraph', 'p', (T) => <T className="my-4" />),
    ol: elementTemplate('OrderedList', 'ol', (T) => <T className={`my-4 ${styles.subsectionNumbering}`} />),
    li: elementTemplate('ListItem', 'li', (T) => <T className="my-4" />),
    ul: elementTemplate('UnorderedList', 'ul', (T) => <T className={`my-4 ml-6 list-disc`} />),
    blockquote: elementTemplate('ToDoBlockQuote', 'blockquote', (T) => <T className={`my-4 px-4 border-l-emerald-500 border-l-4`} />),
};

export function getDocumentComponents(headings: MarkdownHeading[]) {
    const store = getDefaultStore();
    store.set(currentHeadings, headings);
    return {
        ...documentComponents,
        h2: getArticleTitle(headings),
    };
}