import { Service } from '@angular/core';
import { ItemPack } from '../models';

@Service()
export class ItemPackService {
    public getAll(): ItemPack[] {
        // TODO: Not implemented
        return [
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
    }

    public createNew(): void {
        throw new Error('Method not implemented.');
    }

    public delete(id: string): void {
        throw new Error('Method not implemented.');
    }

    public export(id: string): string {
        throw new Error('Method not implemented.');
    }

    public import(data: string): void {
        throw new Error('Method not implemented.');
    }
}
