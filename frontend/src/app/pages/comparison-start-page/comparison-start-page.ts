import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CustomNavigationService, PageSetupService } from '../../utils';
import { ComparisonMode, ComparisonModeService, ComparisonSessionService, ItemPackService } from '../../logic';
import { SelectComponent } from "../../components/select-component/select-component";
import { ShortTextInputComponent } from "../../components";
import { Router } from '@angular/router';

@Component({
    selector: 'app-comparison-start-page',
    imports: [SelectComponent, ShortTextInputComponent],
    templateUrl: './comparison-start-page.html',
    styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage {
    private router = inject(Router);
    private pageSetupService = inject(PageSetupService);
    private customNavigationService = inject(CustomNavigationService);
    private itemPackService = inject(ItemPackService);
    private comparisonModeService = inject(ComparisonModeService);
    private comparisonSessionService = inject(ComparisonSessionService);

    // From route
    public itemPackId = input.required<string>();

    // Just mock item if it is not found since we anyway would redirect in such case
    protected itemPack = computed(
        () => this.itemPackService.getById(this.itemPackId())
            ?? { name: "", author: "", description: "", icon: "", items: [], questions: [] });
    protected areEnoughItems = computed(() => this.itemPack().items.length >= 2);

    protected comparisonModes: ComparisonMode[] = this.comparisonModeService.getAll();

    protected selectedComparisonModeId = signal<string>(this.comparisonModes[0].id);
    protected selectedComparisonMode = computed(() => this.comparisonModeService.getById(this.selectedComparisonModeId()));

    protected questionOptions = computed(() => this.itemPack().questions.map(x => ({ value: x, caption: x })).concat([{ value: "", caption: "Other" }]));
    protected selectedQuestion = signal<string>("");
    protected customQuestion = signal<string>("What is better?");

    protected estimatedComparisonCount = computed(() => this.selectedComparisonMode()?.estimateComparisonCount(this.itemPack().items.length));

    constructor() {
        effect(() => {
            if (this.itemPack() === undefined) {
                this.customNavigationService.showNotFoundPage();
                return;
            }

            this.pageSetupService.setupPage(`Setup comparison for "${this.itemPack().name}"`, "/");
        });
    }

    protected onStartButtonClick() {
        const sessionId = this.comparisonSessionService.create({
            id: "assigned by service",
            itemPackId: this.itemPackId(),
            itemPackName: this.itemPack().name,
            comparisonMode: this.selectedComparisonModeId(),
            comparisonQuestion: this.selectedQuestion() === "" ? this.customQuestion() : this.selectedQuestion(),
            startDate: new Date(),
            selections: [],
            customItemStates: {},
        });

        this.router.navigate(["comparison", sessionId]);
    }
}
