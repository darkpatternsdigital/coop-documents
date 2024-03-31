import type React from "react";
import { Heading } from "./standard-styles";
import { useAtomValue } from "jotai";
import { currentHeadings } from "./current-headings";
import { getArticleNumber } from "./getArticleNumber";
import { romanize } from "./romanize";

export function ArticleTitle({ id, children, className, style, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const articleNumber = getArticleNumber(useAtomValue(currentHeadings), id ?? '');
    return (
        <Heading.h2 id={id} {...props} style={{ ...style, counterSet: `section ${articleNumber}` }}>
            Article {romanize(articleNumber)}
            <br/>
            {children}
        </Heading.h2>
    );
}
