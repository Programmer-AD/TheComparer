import { Service } from '@angular/core';
import { ComparisonMode } from './comparison-modes';

@Service()
export class ComparisonModeService {
    private modes = <ComparisonMode[]>[];

    public getAll(): ComparisonMode[] {
        return this.modes;
    }

    public getById(id: string): ComparisonMode | undefined {
        return this.modes.find(x => x.id === id);
    }
}
