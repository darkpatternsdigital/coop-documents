import type { MarkdownHeading } from "astro";
import { atom } from "jotai";

export const currentHeadings = atom<MarkdownHeading[]>([]);
