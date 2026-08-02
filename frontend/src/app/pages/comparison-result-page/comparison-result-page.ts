import { Component, computed, effect, inject, input, resource } from '@angular/core';
import { ComparisonModeService, ItemPackService, ComparisonModeConstants, ComparisonSessionService } from '../../logic';
import { ComparisonItemSelectionComponent } from "./comparison-item-selection-component/comparison-item-selection-component";
import { EloRankingModeResultComponent, StickyModeResultComponent, TournamentModeResultComponent } from "./mode-specific";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { PageTitleComponent } from "../../components";
import { LoadingPlaceholderPage } from "../loading-placeholder-page/loading-placeholder-page";

@Component({
    selector: 'app-comparison-result-page',
    imports: [ComparisonItemSelectionComponent, EloRankingModeResultComponent, StickyModeResultComponent, TournamentModeResultComponent, NotFoundPage, PageTitleComponent, LoadingPlaceholderPage],
    templateUrl: './comparison-result-page.html',
    styleUrl: './comparison-result-page.scss',
})
export class ComparisonResultPage {
    private comparisonSessionService = inject(ComparisonSessionService);
    private itemPackService = inject(ItemPackService);
    private comparisonModeService = inject(ComparisonModeService);

    public sessionId = input.required<string>();
    protected comparisonSessionResource = resource({
        params: () => this.sessionId(),
        loader: ({ params: sessionId }) => this.comparisonSessionService.getByIdAsync(sessionId),
    });
    protected comparisonMode = computed(() => this.comparisonSessionResource.hasValue()
        ? this.comparisonModeService.getById(this.comparisonSessionResource.value().comparisonMode)
        : undefined);

    protected comparisonModeConstants = ComparisonModeConstants;

    protected itemPackResource = resource({
        params: ({ chain }) => chain(this.comparisonSessionResource)?.itemPackId,
        loader: async ({ params: itemPackId }) => await this.itemPackService.getByIdAsync(itemPackId),
    });
    protected selectionRows = computed(() => {
        if (!this.comparisonSessionResource.hasValue()) {
            return undefined;
        }

        const rawSelections = this.comparisonSessionResource.value().selections;
        const itemPackItems = this.itemPackResource.value()?.items;
        const selectionRows = rawSelections.map(selection => ({
            firstItem: itemPackItems?.find(item => item.id === selection.optionItemIds[0]),
            secondItem: itemPackItems?.find(item => item.id === selection.optionItemIds[1]),
            isFirstSelected: selection.selectedItemId === selection.optionItemIds[0],
            isSecondSelected: selection.selectedItemId === selection.optionItemIds[1],
        }));

        selectionRows.reverse();

        return selectionRows;
    });

    protected onPrintClick(): void {
        window.print();
    }
}
