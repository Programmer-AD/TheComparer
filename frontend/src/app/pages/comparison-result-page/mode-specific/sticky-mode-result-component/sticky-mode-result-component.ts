import { Component, computed, inject, input } from '@angular/core';
import { ComparisonSession, ItemPack } from '../../../../models';
import { ComparisonModeConstants, ComparisonModeService, StickyModeResult } from '../../../../logic';
import { ComparisonItemComponent } from "../../../../components";

@Component({
    selector: 'app-sticky-mode-result-component',
    imports: [ComparisonItemComponent],
    templateUrl: './sticky-mode-result-component.html',
    styleUrl: './sticky-mode-result-component.scss',
})
export class StickyModeResultComponent {
    private comparisonModeService = inject(ComparisonModeService);

    public comparisonSession = input.required<ComparisonSession>();
    public itemPack = input.required<ItemPack>();

    protected winnerItem = computed(() => {
        const mode = this.comparisonModeService.getById(ComparisonModeConstants.stickyModeId)!;
        const result = mode.getResult(this.comparisonSession(), this.itemPack());
        return <StickyModeResult>result;
    });

}
