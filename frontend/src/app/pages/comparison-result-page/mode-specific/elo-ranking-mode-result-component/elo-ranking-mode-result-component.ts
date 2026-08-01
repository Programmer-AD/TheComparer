import { Component, computed, input } from '@angular/core';
import { ComparisonSession, Item, ItemPack } from '../../../../models';
import { EloRatingModeCustomData } from '../../../../logic';

@Component({
    selector: 'app-elo-ranking-mode-result-component',
    imports: [],
    templateUrl: './elo-ranking-mode-result-component.html',
    styleUrl: './elo-ranking-mode-result-component.scss',
})
export class EloRankingModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected itemRows = computed(() => this.getRows());

    private getRows(): (Item & { rating: number })[] {
        const comparisonSession = this.comparisonSession();
        const itemPack = this.itemPack();
        const modeData = <EloRatingModeCustomData>comparisonSession.customModeData;

        const result = itemPack.items.map(item => {
            const rating = modeData.itemRatings.get(item.id)!;
            return ({ ...item, rating: rating });
        });

        result.sort((a, b) => b.rating - a.rating);

        return result;
    }
}
