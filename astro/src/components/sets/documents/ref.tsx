import { useEffect } from 'react';
import { createSlug } from '../../../lib/create-slug';
import { romanize } from './romanize';

export function Ref({ articleNumber, section }: { comment: string, articleNumber: number; section?: string }) {
    if (isNaN(articleNumber) || typeof articleNumber !== 'number') return `ERR: Unknown reference (${JSON.stringify({articleNumber, section})})`;
    if (section) return <>Section {articleNumber}.{section}</>;
    return <>ARTICLE {romanize(articleNumber)}</>;
}

export function makeRef(props: React.ComponentProps<typeof Ref>) {
    return () => <Ref {...props} />;
}
