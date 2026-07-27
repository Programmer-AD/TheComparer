import { Service } from '@angular/core';
import { Item, ItemPack } from '../models';

@Service()
export class ItemPackService {
    // TODO: Not implemented
    private mockData: ItemPack[] = [
        {
            id: "test",
            name: "Test pack mock",
            author: "Mock author",
            description: "Description mock",
            questions: [
                "Test question"
            ],
            items: []
        },
        {
            id: "test 2",
            name: "Test pack 2 mock",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA7UlEQVR4AeySMQ6CQBBF/64SGsQLGAoKGltqzqAF8ThwH0+gsaImxjMQO7uFhsRlXeIRZkxIHMILNP9n981oc0gdE8Yc06y+IasvMNUVjgONhT9yQOqAxKAYpBqg5mUHxSDVADUvOygGqQaoedlBDoO9L+FgcFZNWGGCwqAceg60L8s5cJMqnmHY4YUOAQqskHOg49MDHGzLO/blGZUfRzXi+53/iWi8bcuCsg3GXYIYiZ9IA4uWA+0vuOFBRQiUxhpzZwSApXcu813Lff/lgL+bgBikuhWDYpBqgJqXHRSDVAPUvOygGKQaoOY/AAAA///njMhGAAAABklEQVQDAGX0HVJyXuuXAAAAAElFTkSuQmCC",
            questions: [
                "Test question"
            ],
            items: []
        }
    ];

    public getAll(): ItemPack[] {
        return [...this.mockData];
    }

    public getById(id: string): ItemPack | undefined {
        return this.mockData.find(x => x.id === id);
    }

    public createNew(): void {
        this.mockData.push({
            id: crypto.randomUUID(),
            name: "New item pack",
            questions: [],
            items: [],
        });
    }

    public delete(id: string): void {
        const index = this.mockData.findIndex(x => x.id === id);
        if (index > 0) {
            this.mockData.splice(index, 1);
        }
    }

    public export(id: string): string {
        const model = this.getById(id);
        if (model === undefined) {
            throw new Error(`Item with id "${id}" was not found on export`);
        }

        const data = JSON.stringify(model);
        return data;
    }

    public import(data: string): void {
        const model = JSON.parse(data);
        this.mockData.push(model);
    }
}
