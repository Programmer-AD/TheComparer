import { Service } from '@angular/core';
import { ComparisonSession, ItemPack } from '../models';

@Service()
export class DatabaseService {
    private readonly dbName: string = "the_comparer";
    private readonly dbVersion: number = 1;

    private readonly itemPackStoreName = "item_packs";
    private readonly comparisonSessionStoreName = "comparison_sessions";

    private openedDatabase: IDBDatabase | undefined = undefined;

    public getItemPackStoreAsync(allowEdit: boolean): Promise<DatabaseStoreWrapper<ItemPack>> {
        return this.getStoreAsync<ItemPack>(this.itemPackStoreName, allowEdit);
    }

    public getComparisonSessionStoreAsync(allowEdit: boolean): Promise<DatabaseStoreWrapper<ComparisonSession>> {
        return this.getStoreAsync<ComparisonSession>(this.comparisonSessionStoreName, allowEdit);
    }

    private async getStoreAsync<T>(name: string, allowEdit: boolean): Promise<DatabaseStoreWrapper<T>> {
        const db = await this.getDatabaseAsync();
        const transaction = db.transaction(name, allowEdit ? "readwrite" : "readonly");
        const store = transaction.objectStore(this.itemPackStoreName);
        return new DatabaseStoreWrapper<T>(store);
    }

    private async getDatabaseAsync(): Promise<IDBDatabase> {
        if (this.openedDatabase === undefined) {
            this.openedDatabase = await this.openDatabaseAsync();
        }

        return this.openedDatabase;
    }

    private async openDatabaseAsync(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (globalThis.indexedDB === undefined) {
                reject("IndexedDB is not supported");
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.addEventListener("success", () => {
                resolve(request.result);
            });

            request.addEventListener("error", () => {
                reject(request.error);
            });

            request.addEventListener("upgradeneeded", () => {
                this.setupDatabase(request.result);
            })
        });

    }

    private setupDatabase(db: IDBDatabase): void {
        db.createObjectStore(this.itemPackStoreName, { keyPath: "id" });
        db.createObjectStore(this.comparisonSessionStoreName, { keyPath: "id" });
    }
}

export class DatabaseStoreWrapper<T> {
    public constructor(private objectStore: IDBObjectStore) { }

    public async getAllAsync(): Promise<T[]> {
        const dbRequest = this.objectStore.getAll();
        const result = await this.asPromise(dbRequest);
        return result;
    }

    public async getByIdAsync(id: string): Promise<T | undefined> {
        const dbRequest = this.objectStore.get(id);
        const result = await this.asPromise(dbRequest);
        return result;
    }

    public async insertAsync(data: T): Promise<void> {
        const dbRequest = this.objectStore.add(data);
        await this.asPromise(dbRequest);
    }

    public async upsertAsync(data: T): Promise<void> {
        const dbRequest = this.objectStore.put(data);
        await this.asPromise(dbRequest);
    }

    public async deleteAsync(id: string): Promise<void> {
        const dbRequest = this.objectStore.delete(id);
        await this.asPromise(dbRequest);
    }

    private asPromise(dbRequest: IDBRequest): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            dbRequest.addEventListener("success", () => resolve(dbRequest.result));
            dbRequest.addEventListener("error", () => reject(dbRequest.error));
        });
    }
}
