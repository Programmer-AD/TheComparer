import { Service } from '@angular/core';
import { ComparisonMode, EloRankingMode, StickyMode, TournamentMode } from './comparison-modes';

@Service()
export class ComparisonModeService {
    private modes = [new EloRankingMode(), new TournamentMode(), new StickyMode()];

    public getAll(): ComparisonMode[] {
        return this.modes;
    }

    public getById(id: string): ComparisonMode | undefined {
        return this.modes.find(x => x.id === id);
    }
}
