import { Component, computed, inject, input } from '@angular/core';
import { ComparisonSession, ItemPack } from '../../../../models';
import { ComparisonModeConstants, ComparisonModeService, EloRatingModeResult } from '../../../../logic';

@Component({
    selector: 'app-elo-ranking-mode-result-component',
    imports: [],
    templateUrl: './elo-ranking-mode-result-component.html',
    styleUrl: './elo-ranking-mode-result-component.scss',
})
export class EloRankingModeResultComponent {
    private comparisonModeService = inject(ComparisonModeService);

    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected itemRows = computed(() => {
        const mode = this.comparisonModeService.getById(ComparisonModeConstants.eloRankingModeId)!;
        const result = mode.getResult(this.comparisonSession(), this.itemPack());
        return <EloRatingModeResult>result;
    });
}
