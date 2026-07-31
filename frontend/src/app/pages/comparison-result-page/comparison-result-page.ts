import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { PageSetupService } from '../../utils';
import { ComparisonSession, ItemPack } from '../../models';
import { ComparisonModeService, ItemPackService, ComparisonModeConstants } from '../../logic';
import { ComparisonItemSelectionComponent } from "./comparison-item-selection-component/comparison-item-selection-component";
import { EloRankingModeResultComponent, StickyModeResultComponent, TournamentModeResultComponent } from "./mode-specific";

@Component({
    selector: 'app-comparison-result-page',
    imports: [ComparisonItemSelectionComponent, EloRankingModeResultComponent, StickyModeResultComponent, TournamentModeResultComponent],
    templateUrl: './comparison-result-page.html',
    styleUrl: './comparison-result-page.scss',
})
export class ComparisonResultPage {
    private pageSetupService = inject(PageSetupService);
    protected comparisonModeService = inject(ComparisonModeService);
    private itemPackService = inject(ItemPackService);

    public comparisonSession = input.required<ComparisonSession>();
    protected comparisonMode = computed(() => this.comparisonModeService.getById(this.comparisonSession().comparisonMode)!);

    protected comparisonModeConstants = ComparisonModeConstants;

    protected itemPack = signal<ItemPack | undefined>(undefined);
    protected selectionRows = computed(() => {
        const rawSelections = this.comparisonSession().selections;
        const selectionRows = rawSelections.map(selection => ({
            firstItem: this.itemPack()?.items?.find(item => item.id === selection.optionItemIds[0]),
            secondItem: this.itemPack()?.items?.find(item => item.id === selection.optionItemIds[1]),
            isFirstSelected: selection.selectedItemId === selection.optionItemIds[0],
            isSecondSelected: selection.selectedItemId === selection.optionItemIds[1],
        }));

        selectionRows.reverse();

        return selectionRows;
    });

    constructor() {
        effect(async () => {
            this.pageSetupService.setupPage(`Result of ${this.comparisonMode().name} for "${this.comparisonSession().itemPackName}"`, "/");

            const itemPack = await this.itemPackService.getByIdAsync(this.comparisonSession().itemPackId);
            this.itemPack.set(itemPack);
        })
    }
}
