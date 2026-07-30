import { inject, Service } from '@angular/core';
import { ComparisonSession } from '../models';
import { DatabaseService } from './database-service';

@Service()
export class ComparisonSessionService {
    private databaseService = inject(DatabaseService);

    public async getAllAsync(): Promise<ComparisonSession[]> {
        const store = await this.databaseService.getComparisonSessionStoreAsync(false);
        const result = await store.getAllAsync();
        return result;
    }

    public async getByIdAsync(id: string): Promise<ComparisonSession | undefined> {
        const store = await this.databaseService.getComparisonSessionStoreAsync(false);
        const result = await store.getByIdAsync(id);
        return result;
    }

    public async createAsync(session: ComparisonSession): Promise<string> {
        session.id = crypto.randomUUID();

        const store = await this.databaseService.getComparisonSessionStoreAsync(true);
        await store.insertAsync(session);

        return session.id;
    }

    public async upsertAsync(updatedComparisonSession: ComparisonSession): Promise<void> {
        const store = await this.databaseService.getComparisonSessionStoreAsync(true);
        await store.upsertAsync(updatedComparisonSession);
    }

    public async deleteAsync(id: string): Promise<void> {
        const store = await this.databaseService.getComparisonSessionStoreAsync(true);
        await store.deleteAsync(id);
    }
}
