import { Component, computed, inject, input, linkedSignal, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ComparisonMode, ComparisonModeService, ComparisonSessionService, ItemPackService } from '../../logic';
import { ShortTextInputComponent, SelectComponent, PageTitleComponent } from "../../components";
import { LoadingPlaceholderPage } from "../loading-placeholder-page/loading-placeholder-page";
import { NotFoundPage } from "../not-found-page/not-found-page";

@Component({
    selector: 'app-comparison-start-page',
    imports: [SelectComponent, ShortTextInputComponent, PageTitleComponent, LoadingPlaceholderPage, NotFoundPage],
    templateUrl: './comparison-start-page.html',
    styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage {
    private router = inject(Router);
    private itemPackService = inject(ItemPackService);
    private comparisonModeService = inject(ComparisonModeService);
    private comparisonSessionService = inject(ComparisonSessionService);

    public itemPackId = input.required<string>();

    protected itemPackResource = resource({
        params: () => this.itemPackId(),
        loader: ({ params: itemPackId }) => this.itemPackService.getByIdAsync(itemPackId),
    });
    protected areEnoughItems = computed(() => this.itemPackResource.hasValue() && this.itemPackResource.value().items.length >= 2);

    protected comparisonModes: ComparisonMode[] = this.comparisonModeService.getAll();

    protected selectedComparisonModeId = signal<string>(this.comparisonModes[0].id);
    protected selectedComparisonMode = computed(() => this.comparisonModeService.getById(this.selectedComparisonModeId()));

    protected questionOptions = computed(() => (this.itemPackResource.value()?.questions.map(x => ({ value: x, caption: x })) ?? []).concat([{ value: "", caption: "Other" }]));
    protected selectedQuestion = linkedSignal<string>(() => this.itemPackResource.hasValue() ? this.itemPackResource.value().questions[0] : "");
    protected customQuestion = signal<string>("What is better?");

    protected estimatedComparisonCount = computed(() => this.itemPackResource.hasValue()
        ? this.selectedComparisonMode()?.estimateComparisonCount(this.itemPackResource.value().items.length)
        : undefined);

    protected async onStartButtonClick() {
        const sessionId = await this.comparisonSessionService.createAsync({
            id: "assigned by service",
            itemPackId: this.itemPackId(),
            itemPackName: this.itemPackResource.value()!.name,
            comparisonMode: this.selectedComparisonModeId(),
            comparisonQuestion: this.selectedQuestion() === "" ? this.customQuestion() : this.selectedQuestion(),
            startDate: new Date(),
            selections: [],
            customModeData: undefined,
        });

        this.router.navigate(["comparison", sessionId]);
    }
}
