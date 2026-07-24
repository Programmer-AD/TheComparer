import { Item } from ".";

export interface ItemPack {
    id: string;

    name: string;
    author?: string;
    icon?: string;
    description?: string;
    questions: string[];

    items: Item[];
}
