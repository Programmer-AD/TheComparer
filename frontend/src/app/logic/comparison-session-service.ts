import { Service } from '@angular/core';
import { ComparisonSession } from '../models';

@Service()
export class ComparisonSessionService {
    // TODO: Not implemented
    private mockData: ComparisonSession[] = [];

    public getAll(): ComparisonSession[] {
        return this.mockData;
    }

    public create(session: ComparisonSession): string {
        session.id = crypto.randomUUID();

        this.mockData.push(session);

        return session.id;
    }
}
