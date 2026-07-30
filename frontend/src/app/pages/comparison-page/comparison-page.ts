import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { PageSetupService } from '../../utils';
import { ComparisonSession, Item } from '../../models';
import { ComparisonModeService } from '../../logic';
import { ComparisonItemComponent } from "./comparison-item-component/comparison-item-component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-comparison-page',
    imports: [ComparisonItemComponent],
    templateUrl: './comparison-page.html',
    styleUrl: './comparison-page.scss',
})
export class ComparisonPage {
    private router = inject(Router);
    private pageSetupService = inject(PageSetupService);
    private comparisonModeService = inject(ComparisonModeService);

    public comparisonSession = input.required<ComparisonSession>();
    public comparisonMode = computed(() => this.comparisonModeService.getById(this.comparisonSession().comparisonMode)!);

    public firstItem = signal<Item | undefined>(undefined);
    public secondItem = signal<Item | undefined>(undefined);
    public completedComparisonCount = signal<number>(0);
    public estimatedTotalComparisonCount = signal<number>(0);

    constructor() {
        effect(async () => {
            this.pageSetupService.setupPage(`Comparing items from "${this.comparisonSession().itemPackName}"`, "/");

            await this.refreshComparisonItemsAsync();
            await this.refreshProgressAsync();
        });
    }

    protected async onSelectionClick(selectedItem: Item | undefined): Promise<void> {
        // selectedItem == undefined means "Equals"
        await this.comparisonMode().setSelectionAsync(this.comparisonSession(), {
            selectedItemId: selectedItem?.id,
            optionItemIds: [this.firstItem()!.id, this.secondItem()!.id]
        });

        await this.refreshSelectionAsync();
    }

    private refreshSelectionAsync() {
        return Promise.all([
            this.refreshComparisonItemsAsync(),
            this.refreshProgressAsync()
        ]);
    }

    private async refreshComparisonItemsAsync(): Promise<void> {
        const items = await this.comparisonMode().getItemsToCompareAsync(this.comparisonSession());

        if (items === undefined) {
            // If no pair - comparisons ended
            this.router.navigate(["comparison", this.comparisonSession().id, "result"]);
            return;
        }

        this.firstItem.set(items[0]);
        this.secondItem.set(items[1]);
    }

    private async refreshProgressAsync(): Promise<void> {
        const progress = await this.comparisonMode().getProgressAsync(this.comparisonSession());

        this.completedComparisonCount.set(progress.completed);
        this.estimatedTotalComparisonCount.set(progress.estimatedTotal);
    }
}
