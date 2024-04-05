import { createSlug } from '../../../lib/create-slug';
import { useArticleNumber } from './getArticleNumber';
import { romanize } from './romanize';

export function Ref({ to, number, section }: { to: string, number?: boolean, section?: string }) {
    const articleNumber = useArticleNumber(createSlug(to));
    if (isNaN(articleNumber)) return `ERR: Unknown reference (${JSON.stringify({to, number, section})})`;
    if (number) return articleNumber;
    if (section) return <>Section {articleNumber}.{section}</>;
    return <>ARTICLE {romanize(articleNumber)}</>;
}

export function makeRef(props: React.ComponentProps<typeof Ref>) {
    return () => <Ref {...props} />;
}