import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ComparisonSession, Item } from '../../models';
import { ComparisonModeService } from '../../logic';
import { ComparisonItemComponent, PageTitleComponent } from "../../components";

@Component({
    selector: 'app-comparison-page',
    imports: [ComparisonItemComponent, PageTitleComponent],
    templateUrl: './comparison-page.html',
    styleUrl: './comparison-page.scss',
})
export class ComparisonPage {
    private router = inject(Router);
    private comparisonModeService = inject(ComparisonModeService);

    public comparisonSession = input.required<ComparisonSession>();
    protected comparisonMode = computed(() => this.comparisonModeService.getById(this.comparisonSession().comparisonMode)!);

    protected firstItem = signal<Item | undefined>(undefined);
    protected secondItem = signal<Item | undefined>(undefined);
    protected completedComparisonCount = signal<number>(0);
    protected estimatedTotalComparisonCount = signal<number>(0);

    constructor() {
        effect(async () => {
            // TODO: Fix flickering
            await this.refreshComparisonStateAsync();
        });
    }

    protected async onSelectionClick(selectedItem: Item | undefined): Promise<void> {
        // selectedItem == undefined means "Equals"
        await this.comparisonMode().setSelectionAsync(this.comparisonSession(), {
            selectedItemId: selectedItem?.id,
            optionItemIds: [this.firstItem()!.id, this.secondItem()!.id]
        });

        await this.refreshComparisonStateAsync();
    }

    private async refreshComparisonStateAsync(): Promise<void> {
        const comparisonState = await this.comparisonMode().getComparisonStateAsync(this.comparisonSession());

        if (comparisonState.completedComparisons >= comparisonState.estimatedTotalComparisons || comparisonState.items === undefined) {
            // If all comparisons are done - go to result
            this.router.navigate(["comparison", this.comparisonSession().id, "result"]);
            return;
        }

        this.firstItem.set(comparisonState.items[0]);
        this.secondItem.set(comparisonState.items[1]);
        this.completedComparisonCount.set(comparisonState.completedComparisons);
        this.estimatedTotalComparisonCount.set(comparisonState.estimatedTotalComparisons);
    }
}
