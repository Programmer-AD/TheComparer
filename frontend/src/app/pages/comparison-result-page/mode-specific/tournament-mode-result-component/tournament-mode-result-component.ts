import { Component, computed, input } from '@angular/core';
import { ComparisonSession, Item, ItemPack } from '../../../../models';

@Component({
    selector: 'app-tournament-mode-result-component',
    imports: [],
    templateUrl: './tournament-mode-result-component.html',
    styleUrl: './tournament-mode-result-component.scss',
})
export class TournamentModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected itemRows = computed(() => this.getRows());

    private getRows(): (Item & { wonComparisons: number })[] {
        const comparisonSession = this.comparisonSession();
        const itemPack = this.itemPack();

        const result = itemPack.items.map(item => {
            const wonComparisons = comparisonSession.selections.filter(x => x.selectedItemId === item.id).length;
            return ({ ...item, wonComparisons: wonComparisons });
        });

        result.sort((a, b) => b.wonComparisons - a.wonComparisons);

        return result;
    }
}
