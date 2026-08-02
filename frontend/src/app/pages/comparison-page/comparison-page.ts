import { Component, computed, effect, inject, input, resource } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../../models';
import { ComparisonModeService, ComparisonSessionService } from '../../logic';
import { ComparisonItemComponent, PageTitleComponent } from "../../components";
import { LoadingPlaceholderPage } from "../loading-placeholder-page/loading-placeholder-page";
import { NotFoundPage } from "../not-found-page/not-found-page";

@Component({
    selector: 'app-comparison-page',
    imports: [ComparisonItemComponent, PageTitleComponent, LoadingPlaceholderPage, NotFoundPage],
    templateUrl: './comparison-page.html',
    styleUrl: './comparison-page.scss',
})
export class ComparisonPage {
    private router = inject(Router);
    private comparisonModeService = inject(ComparisonModeService);
    private comparisonSessionService = inject(ComparisonSessionService);

    public sessionId = input.required<string>();

    protected comparisonSessionResource = resource({
        params: () => this.sessionId(),
        loader: ({ params: sessionId }) => this.comparisonSessionService.getByIdAsync(sessionId),
    });

    protected comparisonMode = computed(() => this.comparisonSessionResource.hasValue()
        ? this.comparisonModeService.getById(this.comparisonSessionResource.value().comparisonMode)
        : undefined);

    protected comparisonStateResource = resource({
        params: ({ chain }) => chain(this.comparisonSessionResource),
        loader: async ({ params: comparisonSession }) => this.comparisonMode() !== undefined
            ? await this.comparisonMode()!.getComparisonStateAsync(comparisonSession)
            : undefined,
    })

    constructor() {
        effect(async () => {
            const comparisonState = this.comparisonStateResource.value();
            if (comparisonState !== undefined
                && (comparisonState.completedComparisons >= comparisonState.estimatedTotalComparisons || comparisonState.items === undefined)) {
                // If all comparisons are done - go to result
                this.router.navigate(["comparison", this.sessionId(), "result"]);
                return;
            }
        });
    }

    protected async onSelectionClick(selectedItem: Item | undefined): Promise<void> {
        // When selectedItem is undefined, it means "Equals"
        const comparisonSession = this.comparisonSessionResource.value();
        const comparisonMode = this.comparisonMode();
        const comparisonState = this.comparisonStateResource.value();

        if (comparisonMode === undefined || comparisonSession === undefined || comparisonState === undefined) {
            console.error("There were no selection since either mode, session or state is undefined.");
            return;
        }

        await comparisonMode.setSelectionAsync(comparisonSession, {
            selectedItemId: selectedItem?.id,
            optionItemIds: comparisonState.items!.map(x => x.id),
        });

        this.comparisonStateResource.reload();
    }
}
