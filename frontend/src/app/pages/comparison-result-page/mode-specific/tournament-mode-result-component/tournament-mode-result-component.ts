import { Component, computed, inject, input } from '@angular/core';
import { ComparisonSession, ItemPack } from '../../../../models';
import { ComparisonModeConstants, ComparisonModeService, TournamentModeResult } from '../../../../logic';

@Component({
    selector: 'app-tournament-mode-result-component',
    imports: [],
    templateUrl: './tournament-mode-result-component.html',
    styleUrl: './tournament-mode-result-component.scss',
})
export class TournamentModeResultComponent {
    private comparisonModeService = inject(ComparisonModeService);

    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected itemRows = computed(() => {
        const mode = this.comparisonModeService.getById(ComparisonModeConstants.tournamentModeId)!;
        const result = mode.getResult(this.comparisonSession(), this.itemPack());
        return <TournamentModeResult>result;
    });
}
