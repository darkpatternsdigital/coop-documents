import { createSlug } from '../../../lib/create-slug';
import { useArticleNumber } from './getArticleNumber';
import { romanize } from './romanize';

export function Ref({ to }: { to: string }) {
    const articleNumber = useArticleNumber(createSlug(to));
    return <>Article {romanize(articleNumber)}</>;
}