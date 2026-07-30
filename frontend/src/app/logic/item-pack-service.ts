import { inject, Service } from '@angular/core';
import { ItemPack } from '../models';
import { DatabaseService } from '.';

@Service()
export class ItemPackService {
    private databaseService = inject(DatabaseService);

    public async getAllAsync(): Promise<ItemPack[]> {
        const store = await this.databaseService.getItemPackStoreAsync(false);
        const result = await store.getAllAsync();
        return result;
    }

    public async getByIdAsync(id: string): Promise<ItemPack | undefined> {
        const store = await this.databaseService.getItemPackStoreAsync(false);
        const result = await store.getByIdAsync(id);
        return result;
    }

    public async createNewAsync(): Promise<void> {
        const newItem = {
            id: crypto.randomUUID(),
            name: "New item pack",
            questions: [],
            items: [],
        };

        const store = await this.databaseService.getItemPackStoreAsync(true);
        await store.insertAsync(newItem);
    }

    public async upsertAsync(updatedItemPack: ItemPack): Promise<void> {
        const store = await this.databaseService.getItemPackStoreAsync(true);
        await store.upsertAsync(updatedItemPack);
    }

    public async deleteAsync(id: string): Promise<void> {
        const store = await this.databaseService.getItemPackStoreAsync(true);
        await store.deleteAsync(id);
    }

    public async exportAsync(id: string): Promise<string> {
        const model = await this.getByIdAsync(id);
        if (model === undefined) {
            throw new Error(`Item pack with id "${id}" was not found on export`);
        }

        const data = JSON.stringify(model);
        return data;
    }

    public async importAsync(data: string): Promise<void> {
        const model = JSON.parse(data);
        await this.upsertAsync(<ItemPack>model);
    }
}
