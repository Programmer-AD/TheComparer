import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ComparisonMode, ComparisonModeService, ComparisonSessionService } from '../../logic';
import { ShortTextInputComponent, SelectComponent, PageTitleComponent } from "../../components";
import { ItemPack } from '../../models';

@Component({
    selector: 'app-comparison-start-page',
    imports: [SelectComponent, ShortTextInputComponent, PageTitleComponent],
    templateUrl: './comparison-start-page.html',
    styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage {
    private router = inject(Router);
    private comparisonModeService = inject(ComparisonModeService);
    private comparisonSessionService = inject(ComparisonSessionService);

    protected itemPack = input.required<ItemPack>();
    protected areEnoughItems = computed(() => this.itemPack().items.length >= 2);

    protected comparisonModes: ComparisonMode[] = this.comparisonModeService.getAll();

    protected selectedComparisonModeId = signal<string>(this.comparisonModes[0].id);
    protected selectedComparisonMode = computed(() => this.comparisonModeService.getById(this.selectedComparisonModeId()));

    protected questionOptions = computed(() => this.itemPack().questions.map(x => ({ value: x, caption: x })).concat([{ value: "", caption: "Other" }]));
    protected selectedQuestion = signal<string>("");
    protected customQuestion = signal<string>("What is better?");

    protected estimatedComparisonCount = computed(() => this.selectedComparisonMode()?.estimateComparisonCount(this.itemPack().items.length));

    constructor() {
        effect(async () => {
            if (this.itemPack().questions.length > 0) {
                this.selectedQuestion.set(this.itemPack().questions[0]);
            }
        });
    }

    protected async onStartButtonClick() {
        const sessionId = await this.comparisonSessionService.createAsync({
            id: "assigned by service",
            itemPackId: this.itemPack().id,
            itemPackName: this.itemPack().name,
            comparisonMode: this.selectedComparisonModeId(),
            comparisonQuestion: this.selectedQuestion() === "" ? this.customQuestion() : this.selectedQuestion(),
            startDate: new Date(),
            selections: [],
            customModeData: undefined,
        });

        this.router.navigate(["comparison", sessionId]);
    }
}
