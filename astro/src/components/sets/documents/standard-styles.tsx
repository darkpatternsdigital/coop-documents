import { elementTemplate } from "../../element-template";

export const Heading = elementTemplate(
    'Heading',
    'h6',
    (T) =>
        <T
            className="small-caps font-bold text-center"
            style={{ fontVariant: 'small-caps' }} />,
).themed({
    h1: () => <h1 className="text-lg" />,
    h2: () => <h2 />,
});

