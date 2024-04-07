import type { MarkdownHeading } from "astro";
import type React from "react";
import { Heading } from "./standard-styles";
import { getArticleNumber } from "./getArticleNumber";
import { romanize } from "./romanize";

export function getArticleTitle(headings: MarkdownHeading[]) {
    return function ArticleTitle({ id, children, className, style, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
        const articleNumber = getArticleNumber(id ?? '', headings);
        return (
            <Heading.h2 id={id} {...props} style={{ ...style, counterSet: `article ${articleNumber}`, '--article': articleNumber }}>
                Article {romanize(articleNumber)}
                <br/>
                {children}
            </Heading.h2>
        );
    }
}