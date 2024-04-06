import type React from "react";
import { Heading } from "./standard-styles";
import { getArticleNumber } from "./getArticleNumber";
import { romanize } from "./romanize";

export function ArticleTitle({ id, children, className, style, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const articleNumber = getArticleNumber(id ?? '');
    return (
        <Heading.h2 id={id} {...props} style={{ ...style, counterSet: `article ${articleNumber}` }}>
            Article {romanize(articleNumber)}
            <br/>
            {children}
        </Heading.h2>
    );
}
