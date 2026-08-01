import { Component, computed, input } from '@angular/core';
import { ComparisonSession, Item, ItemPack } from '../../../../models';
import { ArrayExtensions } from '../../../../logic';
import { ComparisonItemComponent } from "../../../../components";

@Component({
    selector: 'app-sticky-mode-result-component',
    imports: [ComparisonItemComponent],
    templateUrl: './sticky-mode-result-component.html',
    styleUrl: './sticky-mode-result-component.scss',
})
export class StickyModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected winnerItem = computed(() => this.getWinnerItem());

    private getWinnerItem(): Item | undefined {
        const lastSelection = ArrayExtensions.getLastElement(this.comparisonSession().selections);
        const itemThatStayed = this.itemPack().items.find(x => x.id === lastSelection?.selectedItemId);
        return itemThatStayed;
    }
}
